import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../../pages/login/login';

/**
 * Generated class for the CodepagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-codepage',
  templateUrl: 'codepage.html',
})
export class CodepagePage {
  activationForm
  submitAttempt = false;
  code;
  lang_direction= ""
  changePhone = 0
  phoneToChange
  type
  service_id
  constructor(public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public storage: Storage,
     public formBuilder: FormBuilder, public helper: HelperProvider, public loginservice: LoginServiceProvider) {
      this.lang_direction = this.helper.lang_direction;
      this.changePhone = navParams.get('changePhone')
      this.phoneToChange = navParams.get('phoneToChange')
      this.type = navParams.get('type')
      this.service_id = navParams.get('service_id')
      this.activationForm = formBuilder.group({
      code: ['', Validators.required]
    })
    //storage.set("test","abc") 
  }

  login(){
    this.submitAttempt = true;
   
    if(this.activationForm.valid){
      if(navigator.onLine){
        //this.loginservice.getAccessToken((data) => this.authSuccessCallback(data), (data) => this.authFailureCallback(data));
        if(this.changePhone == 1){
          this.storage.get("user_login_token").then((val)=> {
            this.loginservice.activateChangePhone(this.code,this.phoneToChange, val.access_token ,(data)=>this.changeActivationSuccessCallback(data),(data)=>this.failureSuccessCallback(data))
          })
        }
        else if(this.changePhone == 2){
          this.loginservice.UserForgetPassword(this.code,this.phoneToChange, (data) => {
            if(data.success){
             this.presentToast(this.translate.instant("passwordSent"))
            this.navCtrl.setRoot(LoginPage)
            }
            else{
              if(String(data.status) == "-2"){
                this.presentToast("رقم الموبايل غير موجود")
              }
              else if(String(data.status) == "-1"){
                this.presentToast("كود التحقق خطأ")
              }
            }
            
          }, (data) => {
            this.presentToast(this.translate.instant("serverError"))
          })
        }
        else{
          this.storage.get("user_login_token").then((val)=> {
           
          this.loginservice.activateUser(this.code,val.access_token ,(data)=>this.activationSuccessCallback(data),(data)=>this.failureSuccessCallback(data))
        })
        }
        
      }
      else{
        this.presentToast(this.translate.instant("serverError"))
      }
    }
  }
  authSuccessCallback(data) {
    //localStorage.setItem('adftrmee', data.access_token)
    //this.mainService.categoriesService( this.helper.DeviceId, (data) => this.categoriesSuccessCallback(data), (data) => this.categoriesFailureCallback(data));
    if (navigator.onLine) {
      this.loginservice.activateUser(this.code, data.access_token,(data)=>this.activationSuccessCallback(data),(data)=>this.failureSuccessCallback(data))
    }
    else {
      this.presentToast(this.translate.instant("serverError"))
    }
   
  }
  authFailureCallback(data) {
    this.presentToast(this.translate.instant("cannotGetAccessToken"))
  }
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  changeActivationSuccessCallback(data){
    if(data.success == true){
        this.helper.presentCenterToast(this.translate.instant("telepUpdated"))
        this.helper.logout()
    }
    else{
      this.presentToast("كود التفعيل خطأ أو رقم الموبايل مستخدم بالفعل")
    }
  }
  activationSuccessCallback(data){
    if(data.success == true){
    this.storage.get("user_login_token").then((val) => {
      if(val.status == "1"){
        //this.helper.presentCenterToast(this.translate.instant(""))
        this.navCtrl.setRoot(TabsPage).catch((err)=> console.log("err "+ err))
      }
      else{
        this.navCtrl.setRoot('ConfirmsignPage',{type: this.type, service_id: this.service_id}).catch((err)=> console.log("err "+ err))
      }
    })
    }
    else{
      this.presentToast(this.translate.instant("invalidCode"))
    }
  }
  failureSuccessCallback(data){
    this.presentToast(this.translate.instant("serverError"))
    //this.navCtrl.setRoot('ConfirmsignPage').catch((err)=> console.log("err "+ err))
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CodepagePage');
  }
  resendActivationCode(){
    // this.storage.get("user_login_token").then((val)=>{
      if(navigator.onLine){
        this.loginservice.resendActivation(this.phoneToChange,(data)=>this.resendActivationSuccessCallback(data),(data)=>this.resendActivationFailureCallback(data))
      }
      else{
        this.presentToast(this.translate.instant("serverError"))
      }
   // })
  }
  resendActivationSuccessCallback(data){
    if(data.success){
      this.presentToast(this.translate.instant("codeSent"))
    }
  }
  resendActivationFailureCallback(data){
    this.presentToast(this.translate.instant("serverError"))
    
  }
}
