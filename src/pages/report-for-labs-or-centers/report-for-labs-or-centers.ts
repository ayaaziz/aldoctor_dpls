import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ActionSheetController, Platform, AlertController, LoadingController} from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { File } from '@ionic-native/file';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileChooser } from '@ionic-native/file-chooser';
import { Base64 } from '@ionic-native/base64';
import { FilePath } from '@ionic-native/file-path';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer } from '@ionic-native/file-transfer';




@IonicPage()
@Component({
  selector: 'page-report-for-labs-or-centers',
  templateUrl: 'report-for-labs-or-centers.html',
  providers: [File, FileChooser, IOSFilePicker, Base64, FilePath,Camera,InAppBrowser]

})
export class ReportForLabsOrCentersPage {

  item
  lang_direction = "";
  user_cv_name = [];
  pathforview;
  linktoview;
  certtxtname = ""
  cv_ext="";
  cv_data="";

  reportData=[]
  filesExt = [];
  accessToken;
  orderFiles = [];
  files = [];
  photos = [];
  photosToShow = [];
  filesToShow = [];
  photosContainer = [];
  filesContainer = [];
  photosContainerExt = [];
  filesContainerExt = [];

  loading;



  //photosToShow = [{imgOrFile:2,data:"lll"},{imgOrFile:1,data:"assets/imgs/default-avatar.png"},{imgOrFile:2,data:"assets/imgs/default-avatar.png"},{imgOrFile:2,data:"assets/imgs/default-avatar.png"}] 


  constructor(private camera: Camera, public actionSheetCtrl: ActionSheetController, private iab: InAppBrowser,private filePicker: IOSFilePicker,
    private file: File, private filePath: FilePath, public platform: Platform,
    private base64: Base64, private fileChooser: FileChooser,public helper: HelperProvider, public navCtrl: NavController, public navParams: NavParams,
    private service:LoginServiceProvider,
    private storage:Storage,
    private translate:TranslateService,
    private alertCtrl:AlertController,
    private loadingCtrl: LoadingController,
    private fileOpener:FileOpener,
    private transfer:FileTransfer) {

    this.item = this.navParams.get('recievedItem')
    console.log("item from report for labs and centeers :", this.item)

    this.lang_direction = this.helper.lang_direction;



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportForLabsOrCentersPage');


    //ayaaaaa
    this.accessToken = localStorage.getItem('user_login_token');
    this.service.getCurrentOrder(this.item.orderId,this.accessToken,
      resp => {
        console.log("orderDetails ",resp);
        var myorder = JSON.parse(JSON.stringify(resp)).order;
      
        if(myorder.files.length > 0)
        {
          this.orderFiles = myorder.files;

          for(var i=0;i<this.orderFiles.length;i++) {

            if(this.orderFiles[i].type == 2) {

              let fileExt = this.orderFiles[i].path.split('.').pop();
              if(fileExt == "jpeg" || fileExt == "png" || fileExt == "jpg" || fileExt =="BMP" || fileExt == "gif") {
                this.photos.push({id:this.orderFiles[i].id,path:this.helper.serviceUrl+this.orderFiles[i].path});    
              } else {
                // let fileName = this.orderFiles[i].path.split('/').pop();
                // this.files.push({id:this.orderFiles[i].id,path:this.orderFiles[i].fileName});   
                this.files.push({id:this.orderFiles[i].id,path:this.helper.serviceUrl+this.orderFiles[i].path,fileName:this.orderFiles[i].fileName});  
              }
            }
          
          }
          console.log("ayaaaa files",this.files);
        }
      },
      error => {
        console.log(error);
      })
       
  }


  selectWorkerCertificate(){
    let actionSheet = this.actionSheetCtrl.create({
      title: "اختر مصدر التقرير",
      buttons: [
        {
          text: "رفع ملفات",
          handler: () => {
            this.getCertificates();
          }
        },
        {
          text: "تحميل من الألبوم",
          handler: () => {
            this.takePictureforworker(this.camera.PictureSourceType.PHOTOLIBRARY,1);
          }
        },

        {
          text: "إستخدام الكاميرا",
          handler: () => {
            this.takePictureforworker(this.camera.PictureSourceType.CAMERA,2);
          }
        },
        {
          text: "إلغاء",
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();

  }

  public takePictureforworker(sourceType,typex) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100, //50
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit:true,
      // targetWidth:200,
      // targetHeight:200
    };
    this.camera.getPicture(options).then((imageData: string) => {
    
        // this.photosToShow.push({imgOrFile:1,data:'data:image/jpeg;base64,' + imageData});
        this.photosToShow.push('data:image/jpeg;base64,' + imageData);

        let imgdata = encodeURIComponent(imageData)
      
        
        this.cv_ext =  'jpeg';
        this.cv_data = imgdata;
      
   
        // this.reportData.push(this.cv_data);
        this.photosContainer.push(this.cv_data);
        // this.filesExt.push(this.cv_ext);
        this.photosContainerExt.push(this.cv_ext);

    }, (err) => {
      // Handle error
    });
  }



  getCertificates() {
    // this.hidecrtforexperience = true;
    if (this.platform.is('ios')) {
      this.filePicker.pickFile()
        .then(uri => {
          

          let correctPath = uri.substr(0, uri.lastIndexOf('/') + 1);
          let filename = uri.substr(uri.lastIndexOf('/') + 1)
          this.certtxtname = filename;
          // this.hidecrtforexperience = true;
          this.user_cv_name.push(filename)
          let fileExt = filename.split('.').pop();
          this.cv_ext = fileExt
          var cvextuper = this.cv_ext.toUpperCase();
          if (cvextuper == "pdf".toUpperCase() || cvextuper == "docx".toUpperCase() || cvextuper == "doc".toUpperCase() || cvextuper == "JPEG".toUpperCase() || cvextuper == "PNG".toUpperCase() || cvextuper == "JPG".toUpperCase() || cvextuper == "GIF".toUpperCase() || cvextuper == "BMP".toUpperCase()) {
            console.log("from if : ", cvextuper);
            // this.helper.presentToast(this.translate.instant("fileupsu"));
          } else {
            console.log("from else : ", cvextuper);

            

            this.helper.presentToast("لا يمكن تحميل هذا الملف، من فضلك اختر ملف بامتداد pdf أو docx أو doc أو JPEG أو PNG أو JPG أو GIF أو BMP");
            this.cv_data = "";
            this.cv_ext = "";
            this.certtxtname = ""
            // this.hidecrtforexperience = false;
            this.user_cv_name = [];
          }

          var vx = "file:///"+correctPath
            this.file.resolveLocalFilesystemUrl(vx).then(fileEntry => {
              console.log("file entry : ",fileEntry)
              fileEntry.getMetadata((metadata) => {
    
                  console.log("worker cert meta data from resolveLocalFilesystemUrl : ",metadata);//metadata.size is the size in bytes
                  // metadata.size: 20761
    // this.vedioSize = (metadata.size / 1024)/1024
                  console.log("(metadata.size / 1024)/1024 : ",(metadata.size / 1024)/1024)
                  if((metadata.size / 1024)/1024 > 1){
                   this.helper.presentToast("أقصى حجم للملف ١ ميجا")
                  //  this.hidecrtforexperience = false;
                   this.cv_data = "";
                           this.cv_ext = "";
                           this.certtxtname = ""
                           
                           this.user_cv_name = [];

                  }else{

          this.file.readAsDataURL("file:///" + correctPath, filename).then((val) => {
            this.pathforview = "file:///" + correctPath;

            this.cv_data = encodeURIComponent(val.split(",")[1]);

            if (cvextuper == "JPEG".toUpperCase() || cvextuper == "PNG".toUpperCase() || cvextuper == "JPG".toUpperCase() || cvextuper == "GIF".toUpperCase() || cvextuper == "BMP".toUpperCase()) {

          
              this.certtxtname = ""
              // this.photosToShow.push({imgOrFile:1,data:this.pathforview})
              // this.reportData.push({imgOrFile:1,data:this.cv_data})


              //ayaaa
              // this.reportData.push(this.cv_data);
              this.photosContainer.push(this.cv_data);
              // this.filesExt.push(this.cv_ext);
              this.photosContainerExt.push(this.cv_ext);
              this.photosToShow.push(this.pathforview);





            }else if (cvextuper == "pdf".toUpperCase() || cvextuper == "docx".toUpperCase() || cvextuper == "doc".toUpperCase()){

              // this.photosToShow.push({imgOrFile:2,data:this.certtxtname})
              // this.filesToShow.push(this.certtxtname);
              console.log("ayaa pathforview: "+this.pathforview);
              this.filesToShow.push({fileName:this.certtxtname,path:this.pathforview});

              
              // this.reportData.push({imgOrFile:2,data:this.cv_data})

              //ayaaaaa
              // this.reportData.push(this.cv_data);
              this.filesContainer.push(this.cv_data);
              // this.filesExt.push(this.cv_ext);
              this.filesContainerExt.push(this.cv_ext);

            }


            console.log("this.cv_data: ", this.cv_data);
            console.log("this.user_cv_name : ", this.user_cv_name);
            console.log("this.cv_ext : ", this.cv_ext)
        
          }).catch(err => console.log('Error reader' + err));

        }
      });
    });

        }).catch(err => console.log('Error' + err));
    }
    else if (this.platform.is('android')) {
      this.fileChooser.open()
        .then(uri => {
          console.log("uuu" + uri)
          //alert("uri : "+ uri)

          this.filePath.resolveNativePath(uri).then((result) => {
            this.base64.encodeFile(result).then((base64File: string) => {
              console.log("base64File " + base64File)
              let fileData = base64File.split(',')[1];
              this.cv_data = encodeURIComponent(fileData);
              console.log("this.cv_data : ", this.cv_data);
              this.filePath.resolveNativePath(uri)
                .then(filePath => {
                  console.log(filePath)
                  this.pathforview = filePath;

                  let filename = filePath.substr(filePath.lastIndexOf('/') + 1)
                  this.certtxtname = filename;
                  // this.hidecrtforexperience = true;
                  this.user_cv_name.push(filename)
                  let fileExt = filename.split('.').pop();
                  // this.cv_ext.push(fileExt)
                  this.cv_ext = fileExt;
                  var cvextuper = this.cv_ext.toUpperCase();


                  if (cvextuper == "pdf".toUpperCase() || cvextuper == "docx".toUpperCase() || cvextuper == "doc".toUpperCase() || cvextuper == "JPEG".toUpperCase() || cvextuper == "PNG".toUpperCase() || cvextuper == "JPG".toUpperCase() || cvextuper == "GIF".toUpperCase() || cvextuper == "BMP".toUpperCase()) {
                    console.log("from if : ", cvextuper);
                    // this.helper.presentToast(this.translate.instant("fileupsu"));
                    var vx =filePath
                    this.file.resolveLocalFilesystemUrl(vx).then(fileEntry => {
                      console.log("file entry : ",fileEntry)
                      fileEntry.getMetadata((metadata) => {
            
                          console.log("worker cert meta data from resolveLocalFilesystemUrl : ",metadata);//metadata.size is the size in bytes
                        
                          console.log("(metadata.size / 1024)/1024 : ",(metadata.size / 1024)/1024)
                          if((metadata.size / 1024)/1024 > 1){
                           this.helper.presentToast("أقصى حجم للملف ١ ميجا")
                          //  this.hidecrtforexperience = false;
                           this.cv_data = "";
                           this.cv_ext = "";
                           this.certtxtname = ""
                           
                           this.user_cv_name = [];
                          }
                          else{
                            if (cvextuper == "JPEG".toUpperCase() || cvextuper == "PNG".toUpperCase() || cvextuper == "JPG".toUpperCase() || cvextuper == "GIF".toUpperCase() || cvextuper == "BMP".toUpperCase()) {

                              // this.photosToShow.push({imgOrFile:1,data: uri});
                              this.certtxtname = ""
                              // this.photosToShow.push({imgOrFile:1,data:this.pathforview})
                              // this.reportData.push({imgOrFile:1,data:this.cv_data})
          
                              //ayaaaa
                              // this.reportData.push(this.cv_data);
                              this.photosContainer.push(this.cv_data);
                              // this.filesExt.push(this.cv_ext);
                              this.photosContainerExt.push(this.cv_ext);
                              this.photosToShow.push(this.pathforview);
          
          
                            }else if (cvextuper == "pdf".toUpperCase() || cvextuper == "docx".toUpperCase() || cvextuper == "doc".toUpperCase()){
          
                              // this.photosToShow.push({imgOrFile:2,data:this.certtxtname})
                              // this.reportData.push({imgOrFile:2,data:this.cv_data})
          
                              // this.filesToShow.push(this.certtxtname);
                              this.filesToShow.push({fileName:this.certtxtname,path:this.pathforview});                    
          
                               //ayaaaa
                              //  this.reportData.push(this.cv_data);
                              this.filesContainer.push(this.cv_data);
                              // this.filesExt.push(this.cv_ext);
                              this.filesContainerExt.push(this.cv_ext);
          
                            }
                          }

                          })
                        })
                  } else {
                    console.log("from else : ", cvextuper);
                    this.helper.presentToast("لا يمكن تحميل هذا الملف، من فضلك اختر ملف بامتداد pdf أو docx أو doc أو JPEG أو PNG أو JPG أو GIF أو BMP");
                    this.cv_data = "";
                    this.cv_ext = "";
                    this.certtxtname = ""
                    // this.hidecrtforexperience = false;
                    this.user_cv_name = [];
                  }

                  console.log("this.user_cv_name : ", this.user_cv_name);
                  console.log("this.cv_ext : ", this.cv_ext)
                 

                })
                .catch(err => console.log(err));
            }, (err) => {
              console.log("base" + err);
            });

          }, (err) => {
            console.log(err);
          })


        })
        .catch(e => console.log(e));
    }
  }



showcv() {
    
      if(this.linktoview){
        console.log("if editedu or editexp open ",this.linktoview);
        // window.open(this.linktoview);
        const browser = this.iab.create(this.linktoview,'_system',"location=yes");
      }else {
        console.log("else editedu or editexp open ");
        this.helper.presentToast("لا يوجد شهادة لعرضها");
      }
   // }
  }

  deleteFile(x,index){
    console.log("file index",index);
    console.log("x: ",x);

    // this.reportData.splice(index, 1);

    let alert = this.alertCtrl.create({
      title: this.translate.instant("deleteFile"),
      message: this.translate.instant("confirmDeleteFile"),
      buttons: [
        {
          text: this.translate.instant("canceltxt"),
          role: 'cancel'
        },
        {
          text: this.translate.instant("confirmtxt"),
          handler: ()=> {
            if(x == 1) {
              this.photosToShow.splice(index,1);
              this.photosContainer.splice(index,1);
              this.photosContainerExt.splice(index,1);

            } else if(x == 2) {
              this.filesToShow.splice(index,1);
              this.filesContainer.splice(index,1);
              this.filesContainerExt.splice(index,1);
            }
          }
        }]
    });
    alert.present();
  }

  removeFile(x,id,index) {
    console.log("file id",id);
    console.log("x: ",x);


    let alert = this.alertCtrl.create({
      title: this.translate.instant("deleteFile"),
      message: this.translate.instant("confirmDeleteFile"),
      buttons: [
        {
          text: this.translate.instant("canceltxt"),
          role: 'cancel'
        },
        {
          text: this.translate.instant("confirmtxt"),
          handler: ()=> {
            //api for delete
            if(navigator.onLine) {
              this.storage.get("user_login_token").then((val) => {
              
                this.service.deleteResultFile(id,val.access_token).subscribe(
                  resp => {
                    if(JSON.parse(JSON.stringify(resp)).success ){   
          
                      if(x == 1) {
                        this.photos.splice(index,1);
                      } else if (x == 2) {
                        this.files.splice(index,1);
                      }

                    } else {
                      this.helper.presentToast(this.translate.instant("serverError"));
                    }
                  },
                  err => {
                    this.helper.presentToast(this.translate.instant("serverError"));
                  }
                );
              })
            } else {
              this.helper.presentToast(this.translate.instant("serverError"))
            }
          }
        }]
    });
    alert.present();

  }

  sendReport(){
 console.log("this.reportData: ",this.reportData)
//  alert("this.reportData.length : " + this.reportData)

console.log("this.photosToShow.length: "+this.photosToShow.length);
console.log("this.filesToShow.length: "+this.filesToShow.length);
console.log("this.photosToShow: "+this.photosToShow[length-1]);
console.log("this.filesToShow.length: "+this.filesToShow[length-1]);


this.photosContainer.forEach(element => {
  this.reportData.push(element);
});

this.filesContainer.forEach(element => {
  this.reportData.push(element);
});


this.photosContainerExt.forEach(element => {
  this.filesExt.push(element);
});

this.filesContainerExt.forEach(element => {
  this.filesExt.push(element);
});


if (this.photosToShow.length <= 0 && this.photos.length <= 0 && this.files.length <= 0 && this.filesToShow.length <= 0){

  this.helper.presentToast("الرجاء إضافة مرفقات التقرير ")

}else{
  // send reportData array to api  (this.reportData)
  console.log("call api to send report imgs ")

  // ayaaaaaa
  if (navigator.onLine) {
    this.storage.get("user_login_token").then((val) => {

      this.presentLoadingCustom();
      this.service.uploadReport(this.item.orderId,val.access_token,this.reportData,this.filesExt.join(',')).subscribe(
        resp => {
          this.loading.dismiss();
          if(JSON.parse(JSON.stringify(resp)).success ){
            this.helper.presentToast(this.translate.instant("reportSent"));
            this.navCtrl.pop();
          } else {
            this.helper.presentToast("الرجاء إضافة مرفقات");
          }
        },
        err => {
          this.loading.dismiss();
          this.helper.presentToast(this.translate.instant("serverError"));
        }
      );
    })
  } else {
    this.helper.presentToast(this.translate.instant("serverError"))
  }
}
 
  }


  presentLoadingCustom() {
    this.loading = this.loadingCtrl.create({
      content: "",
      duration: 5000
    });

    this.loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    this.loading.present();
  }


  //ayaaaaaaaaa
  openFile(file,x) {

    let fileExt = file.path.split('.').pop();
    let mimeType;

    console.log("urllllll: "+file.path);
    console.log("fileExt: "+fileExt);

    if(x == 1) {

       ///////
    console.log("pdf_file "+file.path);

    let path = null;

    if(this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else {
      // path = this.file.dataDirectory;
      path = this.file.externalApplicationStorageDirectory
    }

    console.log("path***** "+path);

    const fileTransfer = this.transfer.create();

    // fileTransfer.download('https://motivationletter.net/wp-content/uploads/2018/09/Motivation-Letter-For-Master-Degree-Sample-PDF.pdf',path + 'CarFeatures.pdf').then(entry => {
    fileTransfer.download(file.path?file.path:"",path + file.fileName).then(entry => {
      
      let url = entry.toURL();

      console.log("url***** "+url);


      console.log(url);
      
      if(fileExt == "doc") {
        mimeType = "msword";
      } else if(fileExt == "docx") {
        mimeType = "vnd.openxmlformats-officedocument.wordprocessingml.document";
      } else {
        mimeType = fileExt;
      }

      this.fileOpener.open(url, 'application/'+mimeType)
      .then((data) => console.log('File is opened: '+data))
      .catch(e => console.log('Error opening file', e));
    })

    } else if(x == 2) {

      if(fileExt == "doc") {
        mimeType = "msword";
      } else if(fileExt == "docx") {
        mimeType = "vnd.openxmlformats-officedocument.wordprocessingml.document";
      } else {
        mimeType = fileExt;
      }


      this.fileOpener.open(file.path, 'application/'+mimeType)
      .then((data) => console.log('File is opened: '+data))
      .catch(e => console.log('Error opening file', e));
    }
  
  }


  fullScreen(index,x){
    console.log("image clicked",index);

    if(x == 1) {
      this.navCtrl.push('full-screen',{data:this.photos[index].path});
    
    } else if(x == 2) {
      this.navCtrl.push('full-screen',{data:this.photosToShow[index]});
    }
  }
  
}
