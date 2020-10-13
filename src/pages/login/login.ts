import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { AlertController } from 'ionic-angular';
//import { SignupPage } from '../../pages/signup/signup';
import { CodepagePage } from '../codepage/codepage';
import { TabsPage } from '../../pages/tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  usernameTxt //= '"201022344500"';
  passwordTxt //= '123456';
  loginForm;
  submitAttempt = false;
  langDirection: string;
  usernameLocal: string;
  passwordLocal: string;

  thanksAlert = true;
  opacityOfAllContent = 1;
  LE
  PT

  hidePassword = true;
  pwdType = "password";
  iconName = "ios-eye-off";


  constructor(public toastCtrl: ToastController, public loginservice: LoginServiceProvider,
     public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams
     ,public helper: HelperProvider, public storage: Storage, public translate: TranslateService
     ,public platform: Platform, private alertCtrl: AlertController, private events: Events) {
      this.langDirection = this.helper.lang_direction;
      this.usernameLocal = translate.instant("Username")
      this.passwordLocal = translate.instant("Password")
    this.loginForm = formBuilder.group({
      username: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required])],
      password: ['', Validators.required]
    });
   
  
    //ayaaaaaa 
    this.usernameTxt = localStorage.getItem("dplsPhone");
    this.passwordTxt = localStorage.getItem("dplsPwd");

    console.log("dplsPhone: "+this.usernameTxt);
    console.log("dplsPwd: "+this.passwordTxt);
    ///////////
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

  }

  changelang() {
   
    if (this.helper.currentLang == 'ar') {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      this.helper.currentLang = 'en';
      this.helper.lang_direction = 'ltr';
      this.langDirection = "ltr";
      this.usernameLocal = this.translate.instant("Username")
      this.passwordLocal = this.translate.instant("Password")
      this.platform.setDir('ltr',true)

    }
    else {

      this.translate.use('ar');
      this.helper.currentLang = 'ar';
      this.translate.setDefaultLang('ar');
      this.helper.lang_direction = 'rtl';
      this.langDirection = "rtl";
      this.usernameLocal = this.translate.instant("Username")
      this.passwordLocal = this.translate.instant("Password")
      this.platform.setDir('rtl',true)
    }
  }
  authSuccessCallback(data) {
    //localStorage.setItem('adftrmee', data.access_token)
    //this.mainService.categoriesService( this.helper.DeviceId, (data) => this.categoriesSuccessCallback(data), (data) => this.categoriesFailureCallback(data));
    if (navigator.onLine) {
      this.loginservice.userLogin("2"+this.usernameTxt, this.passwordTxt,  (data) => this.loginSuccessCallback(data), (data) => this.loginFailureCallback(data))
    }
    else {
      this.presentToast(this.translate.instant("serverError"))
    }
   
  }
  authFailureCallback(data) {
    this.presentToast(this.translate.instant("serverError"))
  }
  loginSuccessCallback(data) {
    console.log(JSON.stringify(data))
   
      if(data.access_token){
        localStorage.setItem('kdkvfkhggsso',data.access_token)
        localStorage.setItem('reefdfdfvcvc',data.refresh_token)


           //ayaaaaaa 
           localStorage.setItem("dplsPhone",this.usernameTxt);
           localStorage.setItem("dplsPwd",this.passwordTxt);
 
           console.log("dplsPhone: "+this.usernameTxt);
           console.log("dplsPwd: "+this.passwordTxt);
           ///////////


        this.storage.set("user_login_token",data).then(()=>{
          this.getUserData();
      })
      }
      else{
        if(data.error){
          this.presentToast(this.translate.instant("phoneExists"))
        }
        if(data.success == false){
          this.presentToast(this.translate.instant(this.translate.instant("invalid_credentials")))
        }
      }
     
   
  }
  
  getUserData(){
    if(navigator.onLine){
      this.storage.get("user_login_token").then((val)=>{
        console.log("ddd "+ JSON.stringify(val))
        //alert(val.access_token)
        this.loginservice.registerFirebase(this.helper.registration,val.access_token)
        this.loginservice.getUserData(val.access_token,(data)=>this.getUserDataSuccessCallback(data),(data)=>this.getUserDataFailureCallback(data))
      })
    }
  }
  getUserDataSuccessCallback(data){
    console.log("user_data "+ JSON.stringify(data))
    data = JSON.parse(data)
    this.storage.set("user_avaial", data.availability)
    
    //notActivated in admin
    if(data.status == "0"){
      if(data.type == "doctor"){
        let services = data.doctor.speciality_services
      let servicesArr = []
      for(let i = 0; i < services.length ; i++){
        servicesArr.push(services[i].id)
      }
        this.navCtrl.setRoot(CodepagePage,{type:0,service_id: servicesArr.toString(), phoneToChange: "2" + this.usernameTxt})
      }
      else{
        this.navCtrl.setRoot(CodepagePage, {phoneToChange: "2" + this.usernameTxt})
      }
    }
    else if(data.status == "1" ){
      
      this.storage.set('user_login_info', data).then(()=>{
        if(data.doctor){
          this.storage.set('type', 0).then(()=>{
            this.events.publish('user:userLoginSucceededPending', data);
            this.navCtrl.setRoot(TabsPage)
          })
        }
        if(data.entity){
          this.storage.set('type', data.entity.type_id).then(()=>{
            this.events.publish('user:userLoginSucceededPending', data);
            this.navCtrl.setRoot(TabsPage)
          })
        }
        
        
      })
    }
    else if(data.status == "2"){
      if(data.type == "doctor"){
        //   let services = data.doctor.speciality_services
        // let servicesArr = []
        // for(let i = 0; i < services.length ; i++){
        //   servicesArr.push(services[i].id)
        // }
        // this.navCtrl.setRoot('ConfirmsignPage',{type:0,service_id: servicesArr.toString()})

        //ayaaaa
        console.log("speciality_id: "+ data.doctor.speciality_id);
        this.navCtrl.setRoot('ConfirmsignPage',{type:0,service_id: data.doctor.speciality_id})
        /////

      }
      else{
        this.navCtrl.setRoot('ConfirmsignPage')
      }
      
    }
    else if(data.status == "-1"){
      this.presentToast(this.translate.instant("AccountDisabeled"))
    }
    
  }
  getUserDataFailureCallback(data){
    this.presentToast(this.translate.instant("serverError"))
  }
  loginFailureCallback(data) {
    
    if(data.error.error == "invalid_credentials"){
      this.presentToast(this.translate.instant(this.translate.instant("invalid_credentials")))
    }
    else{
      this.presentToast(this.translate.instant("serverError"))
    }
  }
  loginToApp() {
    this.submitAttempt = true;
    if(this.loginForm.valid){
    if (navigator.onLine) {
      this.loginservice.userLogin("2"+this.usernameTxt, this.passwordTxt,  (data) => this.loginSuccessCallback(data), (data) => this.loginFailureCallback(data))
      //this.loginservice.getAccessToken((data) => this.authSuccessCallback(data), (data) => this.authFailureCallback(data));
    }
    else {
      this.presentToast(this.translate.instant("serverError"))
    }
  }
}
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  register(){
    let alert = this.alertCtrl.create({
      title: this.translate.instant("Registeration"),
      message: this.translate.instant("SelectRegTypeMsg"),
      inputs: [
        {
          type:'radio',
          name: 'doctor',
          label: this.translate.instant("Doctor"),
          value:'1'
        },
        {
          type:'radio',
          name: 'pharmacy',
          label: this.translate.instant("Pharmacy"),
          value:'2'
        },
        {
          type:'radio',
          name: 'radiology',
          label: this.translate.instant("Radiology"),
          value:'3'
        },
        {
          type:'radio',
          name: 'analysis',
          label: this.translate.instant("Analysis"),
          value:'4'
        },
        {
          type:'radio',
          name: 'nurse',
          label: this.translate.instant("nurse"),
          value:'5'
        }
      ],
      buttons: [
        {
          text: this.translate.instant('canceltxt'),
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translate.instant('register'),
          handler: (data:string) => {
           console.log("dd"+data)
           if(data == '1'){
             this.navCtrl.push("SignupPage")
           }
          else if(data == '2'){
            this.navCtrl.push("PhrmacyRegistrationPage")
          }
          else if(data == '3'){
            this.navCtrl.push("XrayRegistrationPage")
          }
          else if(data == '4'){
            this.navCtrl.push("LabRegistrationPage")
          }else if(data == '5'){
            this.navCtrl.push("nurseRegistrationPage")
          }
          }
        }
      ]
    });
    alert.present();
    
  }
  openForgotPassword(){
    this.navCtrl.push('ChangePhonePage',{forgotpass:1})
  }



  openworkingDays()
  {
    console.log("open working days")
    this.navCtrl.push("WorkingDaysPage")
  }

  ReportProblem(){
    this.thanksAlert = false;
    this.opacityOfAllContent = 0.1;
  }


  //ayaaaaaa
  togglePwd() {
    if(this.hidePassword) {
      this.hidePassword = false;
      this.pwdType = "text";
      this.iconName = "ios-eye";
    } else {
      this.hidePassword = true;
      this.pwdType = "password";
      this.iconName = "ios-eye-off";        
    }  
  }

}
