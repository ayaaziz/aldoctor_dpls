import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ActionSheetController, Platform} from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { File } from '@ionic-native/file';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileChooser } from '@ionic-native/file-chooser';
import { Base64 } from '@ionic-native/base64';
import { FilePath } from '@ionic-native/file-path';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera';



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

  reportData=[{imgOrFile:0,data:""}]



  constructor(private camera: Camera, public actionSheetCtrl: ActionSheetController, private iab: InAppBrowser,private filePicker: IOSFilePicker,
    private file: File, private filePath: FilePath, public platform: Platform,
    private base64: Base64, private fileChooser: FileChooser,public helper: HelperProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.item = this.navParams.get('recievedItem')
    console.log("item from report for labs and centeers :", this.item)

    this.lang_direction = this.helper.lang_direction;



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportForLabsOrCentersPage');
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
      targetWidth:200,
      targetHeight:200
    };
    this.camera.getPicture(options).then((imageData: string) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      // this.storage.get("js_info").then((val) => {
       // this.userImageUrl = 'data:image/jpeg;base64,' + imageData
        //this.storage.set("user_image",this.userImageUrl)
        let imgdata = encodeURIComponent(imageData)
        // this.certttxt = this.translate.instant("imageCaptured");
        if(typex == 1 )
        this.certtxtname = "تم إختيار الصورة"
        else if(typex == 2)
        this.certtxtname = "تم التقاط الصورة"
        
        this.cv_ext =  'jpeg'
        this.cv_data = imgdata
        // this.hidecrtforexperience = true;
        
        this.reportData.push({imgOrFile:1,data:this.cv_data})

      // })
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
            this.helper.presentToast("لا يمكن تحميل هذا الملف");
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
                          }
                          // else{

                          // }

                          })
                        })
                  } else {
                    console.log("from else : ", cvextuper);
                    this.helper.presentToast("لا يمكن تحميل هذا الملف");
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

  sendReport(){

  }


}