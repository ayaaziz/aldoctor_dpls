import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
//login service provider.
import { LoginServiceProvider } from '../../providers/login-service/login-service';
//helper class that contain shared variables.
import { HelperProvider } from '../../providers/helper/helper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordValidator,matchOtherValidator } from '../../validators/passwordValidator';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
  providers: [LoginServiceProvider],
})
export class ChangePasswordPage {
resetForm;
resetLoader;
submitAttempt = false;
oldpasswordTXT;
passTxt;
confirmTxt;
lang_direction= ""
  constructor(public translate: TranslateService, public loadingCtrl: LoadingController,public storage: Storage,
     public loginservice: LoginServiceProvider, public toastCtrl: ToastController, public formBuilder: FormBuilder,
      public helper: HelperProvider,public navCtrl: NavController, public navParams: NavParams) {
        this.lang_direction = helper.lang_direction
     this.resetForm = formBuilder.group({
      oldpassword: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(4), Validators.required])],
      confirmPassword: ['',Validators.compose([Validators.minLength(4), Validators.required,matchOtherValidator('password')])]
    }); 
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }
  changePassword() {
    this.submitAttempt = true;
    if(!navigator.onLine){
      this.helper.presentToast("لا يوجد اتصال بالأنترنت")
      return;
    }
       if (this.resetForm.valid) {
      if(this.oldpasswordTXT == this.passTxt){
      this.helper.presentToast("لا يجب ان تكون كلمة المرور الجديدة هي كلمة المرور الحالية")
      return;
    }
      //call login function from login service provider and send username and password , loginSuccessCallback function and loginFailureCallback function.
      this.storage.get("user_login_token").then((val)=>{
      this.loginservice.resetpassword(this.oldpasswordTXT, this.passTxt,this.confirmTxt,val.access_token, (data) => this.resetSuccessCallback(data), (data) => this.resetFailureCallback(data))
      })
    }
    else{
     // this.helper.presentToast("يجب ادخال كلمة المرور الحالية وكلمة المرور الجديد لا تقل عن أربعة حروف أو أرقام")
    }
  }
  resetSuccessCallback(data){
    if(data.success == true){
      this.presentToast(this.translate.instant("passwordChanged"))
      setTimeout(() => {
        this.helper.logout()
      }, 2000);
      
    }
    else{
      this.presentToast(this.translate.instant("wrongCurrentPassword"))
    }
    
   
    
  }
  resetFailureCallback(data){
    this.presentToast(this.translate.instant("serverError"))
  }
    private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  
}
