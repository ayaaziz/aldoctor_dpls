import { Component } from '@angular/core';
import { NavController, ActionSheetController, ToastController, Events } from 'ionic-angular';
//import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { CodepagePage } from '../codepage/codepage';
import { ConfirmsignPage } from '../confirmsign/confirmsign';
import { RetimePage } from '../retime/retime';
import { NeworderPage } from '../neworder/neworder';
import { PatientreviewPage } from '../patientreview/patientreview';
import { CurrentorderPage } from '../currentorder/currentorder';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { ChangePasswordPage } from '../../pages/change-password/change-password';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers: [Camera]
})
export class AboutPage {
  ratingStatus = 4
  userName = ""
  userImageUrl = ""
  userAddress = ""
  phone = ""
  email = ""
  bio = ""
  speciality_services = []
  entity_prices = []
  lang_direction = ""
  fullname = ""
  type
  entityphone
  doctor_price
  doctor_retime
  constructor(public translate: TranslateService, public navCtrl: NavController, public storage: Storage,
    private camera: Camera, public actionSheetCtrl: ActionSheetController, public helper: HelperProvider,
    public loginservice: LoginServiceProvider, private events: Events) {
    this.lang_direction = helper.lang_direction

  }
  ionViewDidEnter() {
    this.storage.get("user_login_info").then((val) => {
console.log("val from storage enter : ",val)
      if (val != null) {
        this.storage.get('type').then(type_val => {
         this.type = type_val
          if (type_val == 0) {
            this.userImageUrl = val.profile_pic
            this.userAddress = val.doctor.address
            this.ratingStatus = val.rate
            if(this.ratingStatus == 0){
              this.ratingStatus = 5
            }
            this.userName = val.nickname
            if(val.doctor.discount)
            this.doctor_price = val.doctor.discount + "جنيه"
            if(val.doctor.price)
            this.doctor_retime = val.doctor.price + "جنيه"
            this.fullname = val.name
            this.bio = val.doctor.bio
            this.phone = String(val.phone).substring(1)
            //this.email = val.email
            if(val.email === "static_"+ val.phone + "@gmail.com"){
             
              this.email = ""
            }
            else{
              this.email = val.email
            }
            let servicesObj = val.extraInfo.speciality_services
            this.speciality_services = []
            for (let i = 0; i < servicesObj.length; i++) {
              if (this.helper.currentLang == 'en') {
                this.speciality_services.push({name : servicesObj[i].decoded_value})
              }
              else {
                this.speciality_services.push({name: servicesObj[i].decoded_value})
                //this.speciality_services.push(servicesObj[i].translation.value)
              }
            }
          }
          else {
            this.userName = val.name
            this.userImageUrl = val.profile_pic
            this.userAddress = val.entity.address
            this.ratingStatus = val.rate
            if(this.ratingStatus == 0){
              this.ratingStatus = 5
            }
            this.fullname = val.entity.owner_name
            this.entityphone = val.extraInfo.phone
            if(val.entity.service_prices)
            this.entity_prices = JSON.parse(val.entity.service_prices)
            this.phone = String(val.phone).substring(1)
            if(val.email === "static_"+ val.phone + "@gmail.com"){
             
              this.email = ""
            }
            else{
              this.email = val.email
            }
            if(type_val != 1){
            let servicesObj = val.entity.speciality_services
            this.speciality_services = []
           
            for (let i = 0; i < servicesObj.length; i++) {
              if(this.helper.userType != 2){
                if (this.helper.currentLang == 'en') {
                  this.speciality_services.push({name: servicesObj[i].service_name })
                }
                else {
                  this.speciality_services.push({name: servicesObj[i].service_name})
                  //this.speciality_services.push(servicesObj[i].translation.value)
                }
              }
              else{
              if (this.helper.currentLang == 'en') {
                if(this.entity_prices[i]){
                  this.speciality_services.push({name: servicesObj[i].service_name , price: this.entity_prices[i] + "جنيه"})
                }
                else{
                  this.speciality_services.push({name: servicesObj[i].service_name , price: null})
                }
                
              }
              else {
                if(this.entity_prices[i]){
                this.speciality_services.push({name: servicesObj[i].service_name , price: this.entity_prices[i] + "جنيه"})
              }
              else{
                this.speciality_services.push({name: servicesObj[i].service_name , price: null})
              }
                //this.speciality_services.push(servicesObj[i].translation.value)
              }
            }
            }
          }
          }
        })
      }
    })
  }
  openEditProfile() {
    this.storage.get('type').then(val => {
      if (val == 1) {
        this.navCtrl.push("PhrmacyRegistrationPage", { edit: 1 })
      }
      else if (val == 2) {
        this.navCtrl.push("XrayRegistrationPage", { edit: 1 })
      }
      else if (val == 3) {
        this.navCtrl.push("LabRegistrationPage", { edit: 1 })
      }
      else if (val == 0) {
        this.navCtrl.push('EditProfilePage')
      }
    })

  }
  
  selectImage() {

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
  getUserData() {
    if (navigator.onLine) {
      this.storage.get("user_login_token").then((val) => {
        console.log("ddd " + JSON.stringify(val))
        //this.loginservice.registerFirebase(this.helper.registration,val.access_token)
        this.loginservice.getUserData(val.access_token, (data) => this.getUserDataSuccessCallback(data), (data) => this.getUserDataFailureCallback(data))
      })
    }
  }
  getUserDataSuccessCallback(data) {
    console.log("user_data " + JSON.stringify(data))
    data = JSON.parse(data)
    this.storage.set("user_avaial", data.availability)
    if (data.status == "0") {
      this.navCtrl.setRoot(CodepagePage)
    }
    else if (data.status == "1") {
      this.storage.set('user_login_info', data);
    }
    else if (data.status == "2") {
      this.navCtrl.setRoot('ConfirmsignPage')
    }
    else if (data.status == "-1") {
      this.helper.presentToast(this.translate.instant("AccountDisabeled"))
    }
    this.events.publish('user:userLoginSucceededHome', data);
    this.events.publish("user:userLoginSucceeded", data)
  }
  getUserDataFailureCallback(data) {
    this.helper.presentToast(this.translate.instant("serverError"))
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
    this.camera.getPicture(options).then((imageData: string) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.storage.get("user_login_token").then((val) => {
        this.userImageUrl = 'data:image/jpeg;base64,' + imageData
        //this.storage.set("user_image",this.userImageUrl)
        let imgdata = encodeURIComponent(imageData)
        this.loginservice.changeProfilePic(imgdata, 'jpeg', val.access_token, (data) => this.changeProfileImgSuccessCallback(data), (data) => this.changeProfileImgFailureCallback(data))
      })
    }, (err) => {
      // Handle error
    });
  }
  changeProfileImgSuccessCallback(data) {
    this.getUserData()
  }
  changeProfileImgFailureCallback(data) {

  }
  changeTelephone() {
    this.navCtrl.push("ChangePhonePage")
  }
  ionViewDidLoad() {
  }
  changePassword() {
    this.navCtrl.push(ChangePasswordPage)
  }
  workingHours()
  {
    this.navCtrl.push("WorkingDaysPage")
  }
}
