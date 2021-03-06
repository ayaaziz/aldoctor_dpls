import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,ActionSheetController,ToastController, AlertController, Events } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { Base64 } from '@ionic-native/base64';
import { FilePath } from '@ionic-native/file-path';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { passwordValidator, matchOtherValidator, emailValidator } from '../../validators/passwordValidator';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CodepagePage } from '../../pages/codepage/codepage';
import { Storage } from '@ionic/storage';
import { Content } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { File } from '@ionic-native/file';

/**
 * Generated class for the PhrmacyRegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-phrmacy-registration',
  templateUrl: 'phrmacy-registration.html',
  providers: [FileChooser, Base64, FilePath, IOSFilePicker, Camera,File]
})
export class PhrmacyRegistrationPage {
  @ViewChild(Content) content: Content;
  registerFormOne;
  submitAttempt = false;
  langDirection: string = 'rtl';
  pharmacyName
  pharmacyOwner
  phone
  email=""
  passwordTxt
  confirmpassword
  taxLicense
  governorate
  governorates = []
  cities = []
  city
  address
  deliveryCount
  termsStatus = false;
  editmode
  disableCities = true
  profile_pic_ext = []
  logoImg = ""
  imgPreview
  certificateData = []
  certifications_ext = []
  user_certficits= []
  extra_info
  accessToken

  hideImage = false
  RegisterationTitle
  entityphone

  gender;

  constructor(public toastCtrl: ToastController, private camera: Camera, public helper: HelperProvider, 
    public actionSheetCtrl: ActionSheetController, public loginservice: LoginServiceProvider,public events: Events,
     public translate: TranslateService, public formBuilder: FormBuilder,  private file: File,
     public filePicker: IOSFilePicker, public platform: Platform, private alertCtrl: AlertController,
      private filePath: FilePath, public navCtrl: NavController, public navParams: NavParams, 
      private fileChooser: FileChooser, private base64: Base64, public storage: Storage) {
    this.langDirection = this.helper.lang_direction;

    this.registerFormOne = formBuilder.group({

      pharmacyName: ['', Validators.required],
      pharmacyOwner: ['', Validators.required],
      entityphone: ['', Validators.required],
      email: ['', emailValidator.isValid],
      phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required])],
      address: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(4), Validators.required])],
      confirmpassword: ['', Validators.compose([ matchOtherValidator('password')])],
      taxLicense: ['', Validators.required],
      // governorate: ['', Validators.required],
      city: ['', Validators.required],
      deliveryCount: ['', Validators.required]
    });
    this.editmode = navParams.get('edit')
    if(this.editmode){
      this.registerFormOne.controls['phone'].setValidators(null)
      this.registerFormOne.controls['password'].setValidators(null)
      this.registerFormOne.controls['confirmpassword'].setValidators(null)
      this.hideImage =true
      this.RegisterationTitle = "تعديل"
      

      this.storage.get("user_login_info").then((val)=>{
        if(val != null){
          console.log('data from edit',val);
          this.pharmacyName = val.name
          this.pharmacyOwner =  val.extraInfo.owner_name

          //ayaaaaaaaa
          this.gender = val.gender;
          ////////////
          
          //this.email = val.email
          if(val.email == "static_"+ val.phone + "@gmail.com"){
            this.email = ""
          }
          else{
            this.email = val.email
          }
          this.address = val.entity.address
          this.helper.serviceAddress = val.entity.address
          
          this.taxLicense = val.extraInfo.tax_liscence
          this.governorate = val.entity.governorate_id
          this.city = val.entity.city_id
          this.deliveryCount = val.extraInfo.staff_num
          this.extra_info = val.extraInfo.extra_info
          this.entityphone = val.extraInfo.phone
          if(this.extra_info){
            let lat = this.extra_info.split(',')[0]
          let long = this.extra_info.split(',')[1]
          localStorage.setItem("entitylat",String(lat))
          localStorage.setItem("entitylong",String(long))
          }
        }
      });     
    }else{
      this.RegisterationTitle = this.translate.instant("register")
    }


    //ayaaaaa
    this.loginservice.getCities("",this.helper.currentLang , data => {
      this.cities = data
    }, 
    error => {
      this.helper.presentToast(this.translate.instant('serverError'))
    })

    
  }
  governChanged(){
    if(this.governorate){
      this.loginservice.getCities(this.governorate,this.helper.currentLang , data => {
      this.cities = data
      this.disableCities = false;
    }, data => {this.helper.presentToast(this.translate.instant('serverError'))}
  )
    }
    
  }
  openTermsOfUse(){
    this.navCtrl.push('RegisterConditionsPage')
  }
  ionViewDidLoad() {
    this.helper.serviceAddress = null
    if(!this.editmode){
      localStorage.removeItem("entitylat")
      localStorage.removeItem("entitylong")
      this.address = ""
    }
    console.log('ionViewDidLoad PhrmacyRegistrationPage');
    this.loginservice.getGovernerates(this.helper.currentLang, data => {
      this.governorates = data
    }, data => {this.helper.presentToast(this.translate.instant('serverError'))})
    
  }
  registerUser(){
    
    this.extra_info = localStorage.getItem("entitylat")+','+localStorage.getItem("entitylong")
    var serviceData ={
      name:"",
      email:"",
      address :"",
      owner :"",
      tax_liscence :"",
      governorate_id :"",
      city_id :"",
      deliveryCount :"",
      type_id:"",
      entityphone:"",
      extra_info: "",
      certificateData: "",
      certifications_ext: "",
      gender:""
    }
      this.submitAttempt=true;
      // alert(this.certifications_ext.toString())
      // console.log("certificateData" + this.certificateData)
    //this.submitAttempt = true;
    if(this.editmode == 1)
      this.termsStatus = true
    
    if(this.termsStatus == false){
      this.helper.presentToast(this.translate.instant('checkAgreement'))
    }
     else{
     if (this.registerFormOne.valid) {
      if(localStorage.getItem("entitylat") && localStorage.getItem("entitylong")){
      }
      else{
        this.content.scrollToTop()
        this.helper.presentToast(this.translate.instant('SpecifyLoc'))
        return;
      }
      if(navigator.onLine){
        if(this.editmode == 1)
        {
          serviceData.name = this.pharmacyName
          serviceData.email = this.email
          serviceData.address = this.address
          serviceData.owner = this.pharmacyOwner
          serviceData.tax_liscence = this.taxLicense
          serviceData.governorate_id = this.governorate
          serviceData.city_id = this.city
          serviceData.deliveryCount = this.deliveryCount
          serviceData.type_id ="1"
          serviceData.entityphone = this.entityphone
          serviceData.extra_info = this.extra_info
          serviceData.certificateData = String(this.certificateData)
          serviceData.certifications_ext = String(this.certifications_ext)

          //ayaaaaaa
          serviceData.gender = this.gender;
          //////////
          
          this.storage.get('user_login_token').then(data=>{
            console.log("data access token",data);
            this.loginservice.editserviceProfile(serviceData,data.access_token).subscribe(
              resp=>{
                console.log("resp from edit serviceprofile",resp);
                if(JSON.parse(JSON.stringify(resp)).success)
                  this.helper.presentToast(this.translate.instant('ProfileUpdated'))
                  this.events.publish("user:userLoginSucceeded", JSON.parse(JSON.stringify(resp)).user)
                  this.navCtrl.setRoot(TabsPage)

              },err=>{
                console.log("err from edit serviceprofile",err);
              }
            )
          })
         
        } 
        else
          this.loginservice.getAccessToken((data) => this.authSuccessCallback(data), (data) => this.authFailureCallback(data));

        
      }
      else{
       this.helper.presentToast(this.translate.instant("serverError"))
      }
     }
     else{
      this.content.scrollToTop()
      this.helper.presentToast(this.translate.instant('registerationFillData'))
    }
   } 
  }
  authFailureCallback(data) {
    this.helper.presentToast(this.translate.instant("cannotGetAccessToken"))
  }
  authSuccessCallback(data) {
    this.accessToken = data.access_token;
    //localStorage.setItem('adftrmee', data.access_token)
    //this.mainService.categoriesService( this.helper.DeviceId, (data) => this.categoriesSuccessCallback(data), (data) => this.categoriesFailureCallback(data));
    if (navigator.onLine) {
      
      this.loginservice.entityRegister(this.pharmacyName,this.email,"2"+this.phone,this.entityphone, this.logoImg,this.profile_pic_ext,this.passwordTxt,String(this.certificateData),this.address,this.extra_info,String(this.certifications_ext),this.pharmacyOwner,1,1,this.taxLicense,this.governorate,this.city,this.deliveryCount,'',(data)=>this.successCallback(data),(data)=>this.failureCallback(data))
    }
    else {
      this.helper.presentToast(this.translate.instant("serverError"))
    }
  }
  successCallback(data){
    
    console.log(JSON.stringify(data))
    //let res = JSON.parse(data)
    this.storage.set('user_login_token',data)
    if(data.access_token){
      this.navCtrl.setRoot(CodepagePage,{userToken: data.access_token, phoneToChange: "2" + this.phone})
    }
    else{
      if(data.errors.phone){
        this.helper.presentToast(this.translate.instant("phoneExists"))
      }
      else if(data.errors.email){
        this.helper.presentToast(this.translate.instant("emailExists"))
      }
      else{
        this.helper.presentToast(this.translate.instant("serverError"))
      }
    }
  }
  
  failureCallback(data){
    this.helper.presentToast(this.translate.instant("serverError"))
  }
  presentActionSheet() { 
    
    let actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant("SelectImageSource"),
      buttons: [
        {
          text: this.translate.instant("LoadfromLibrary"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: this.translate.instant("UseCamera"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: this.translate.instant("canceltxt"),
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imgPreview = 'data:image/jpeg;base64,' + imageData
      this.logoImg = encodeURIComponent(imageData);
      this.profile_pic_ext.push("jpeg")
     }, (err) => {
      // Handle error
     });
  }
  attachTaxFile(){
      if (this.platform.is('ios')) {
        this.filePicker.pickFile()
        .then(uri => {
          let correctPath = uri.substr(0, uri.lastIndexOf('/') + 1);
          let filename = uri.substr(uri.lastIndexOf('/') + 1)
          this.user_certficits.push(filename)
          let fileExt = filename.split('.').pop();
          this.certifications_ext.push(fileExt)
          this.file.readAsDataURL("file:///" + correctPath, filename).then((val) => {
            this.certificateData.push(encodeURIComponent(val.split(',')[1]))
            //console.log("certificateData" + this.certificateData)
          }).catch(err => console.log('Error reader' + err));
        }).catch(err => console.log('Error' + err));
      }
      else if (this.platform.is('android')) {
        this.fileChooser.open()
        .then(uri => {
          console.log("uuu" + uri)
          this.filePath.resolveNativePath(uri).then((filePathResult) => {
            console.log("filePathResult " + filePathResult)
          this.base64.encodeFile(filePathResult)
            .then(base64File => {
              let filename = filePathResult.substr(filePathResult.lastIndexOf('/') + 1)
              this.user_certficits.push(filename)
              let fileExt = filename.split('.').pop();
              console.log("ext "+fileExt)
              this.certifications_ext.push(fileExt)
              let fileData = base64File.split(',')[1];
              this.certificateData.push(encodeURIComponent(fileData))
             // alert(filename + " vv "+fileExt+" here is encoded image "+ fileData)
            })
            .catch((e) => {
              console.log('Error reading file' + JSON.stringify(e));
            })

          }, (err) => {
            console.log(err);
          })


        })
        .catch(e => console.log(e));
      }
      
    }
    
    openMap(){
      this.navCtrl.push('partner-address');
    }
    ionViewWillEnter() {
      if(this.helper.serviceAddress){
        this.address = this.helper.serviceAddress;
      }
    }
  
}
