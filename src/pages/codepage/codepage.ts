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


timer;
time=60;


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


    this.enableTimer();
    
    //storage.set("test","abc") 
  }

  login(){
    this.submitAttempt = true;
   
    if(this.activationForm.valid){
      if(navigator.onLine){
        //this.loginservice.getAccessToken((data) => this.authSuccessCallback(data), (data) => this.authFailureCallback(data));

        //Change Phone
        if(this.changePhone == 1){
          this.storage.get("user_login_token").then((val)=> {
            this.loginservice.activateChangePhone(this.code,this.phoneToChange, val.access_token ,(data)=>this.changeActivationSuccessCallback(data),(data)=>this.failureSuccessCallback(data))
          })
        }

        //Forget Password
        else if(this.changePhone == 2){
          this.loginservice.UserForgetPassword(this.code,this.phoneToChange, (data) => {
            if(data.success){

              //ayaaaaaa 
              localStorage.removeItem("dplsPwd");


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

        //SignUp / Login
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
      this.helper.presentCenterToast(this.translate.instant("telepUpdated"));

      //ayaaaaaa 
      localStorage.removeItem("dplsPhone");

      this.helper.logout();

    }
    else{
      this.presentToast("كود التفعيل خطأ أو رقم الموبايل مستخدم بالفعل")
    }
  }
  activationSuccessCallback(data){
    if(data.success == true){


      

    this.storage.get("user_login_token").then((val) => {

      //ayaaaaaa 
      localStorage.removeItem("dplsPhone");
      localStorage.removeItem("dplsPwd");
      ///////////

      //activated
      if(val.status == "1"){
        //this.helper.presentCenterToast(this.translate.instant(""))
        this.navCtrl.setRoot(TabsPage).catch((err)=> console.log("err "+ err))
      }
      //pending
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
      console.log("resend code ")

      if(navigator.onLine){

        if(this.time>0){
          this.presentToast("الرجاء الانتظار "+ this.time + " ثانية ")
          }else if(this.time == 0){
            this.time = 60;
            this.enableTimer(); 

        this.loginservice.resendActivation(this.phoneToChange,(data)=>this.resendActivationSuccessCallback(data),(data)=>this.resendActivationFailureCallback(data))
          }
      
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



  enableTimer(){
  this.timer =setInterval(()=>{
    this.time--;
      if(this.time <= 0){
        console.log("timer off");
     
        clearTimeout(this.timer);
      }
  },1000);
}


changeTxt(){
  console.log("code...",this.code);
  this.code = this.textArabicNumbersReplacment(this.code);
  console.log("code after replacement: ",this.code); 

}

textArabicNumbersReplacment(strText) { 
  var strTextFiltered = strText.trim();
  strTextFiltered = strText;

  strTextFiltered = strTextFiltered.replace(/[\٩]/g, '9');
  strTextFiltered = strTextFiltered.replace(/[\٨]/g, '8');
  strTextFiltered = strTextFiltered.replace(/[\٧]/g, '7');
  strTextFiltered = strTextFiltered.replace(/[\٦]/g, '6');
  strTextFiltered = strTextFiltered.replace(/[\٥]/g, '5');
  strTextFiltered = strTextFiltered.replace(/[\٤]/g, '4');
  strTextFiltered = strTextFiltered.replace(/[\٣]/g, '3');
  strTextFiltered = strTextFiltered.replace(/[\٢]/g, '2');
  strTextFiltered = strTextFiltered.replace(/[\١]/g, '1');
  strTextFiltered = strTextFiltered.replace(/[\٠]/g, '0');
  
  return strTextFiltered;
}

}
