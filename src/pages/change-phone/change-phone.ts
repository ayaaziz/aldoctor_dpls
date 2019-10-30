import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { CodepagePage } from '../../pages/codepage/codepage';


/**
 * Generated class for the ChangePhonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-phone',
  templateUrl: 'change-phone.html',
})
export class ChangePhonePage {
  phoneForm;
  submitAttempt = false;
  phone;
  lang_direction = "";
  forgotpass;
  title = ""
  constructor(public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public storage: Storage,
    public formBuilder: FormBuilder, public helper: HelperProvider, public loginservice: LoginServiceProvider) {
    this.lang_direction = this.helper.lang_direction;
    this.forgotpass = navParams.get('forgotpass')
    if(this.forgotpass){
      this.title = translate.instant("forgotPassword")
    }
    else{
      this.title = translate.instant("resetPhone")
    }
    this.phoneForm = formBuilder.group({
      phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required])]
    })
  }

  ionViewDidLoad() {
    //this.loginservice.getgovernerates((data) => { }, (data) => { })
    console.log('ionViewDidLoad ChangePhonePage');
  }
  changePhone() {
    this.submitAttempt = true
    if (navigator.onLine) {
      if (this.forgotpass) {
        if (this.phoneForm.valid) {
          this.loginservice.UserForgetPasswordSendPhone('2' + this.phone, (data) => {
            if(data.success){
            this.presentToast("لقد تم إرسال كود التحقق بنجاح")
            // this.navCtrl.setRoot(LoginPage)
            let tel = "2" + this.phone
            this.navCtrl.push(CodepagePage, { changePhone: 2, phoneToChange: tel })
            }
            else{
              this.helper.presentToast("رقم الموبايل المستخدم غير موجود")
            }
          }, (data) => {
            this.presentToast(this.translate.instant("serverError"))
          })
        }
      }
      else {
        if (this.phoneForm.valid) {
          this.storage.get("user_login_info").then(user => {
            let tel = "2" + this.phone
            if (user.phone != tel) {
              this.storage.get("user_login_token").then((val) => {
                this.loginservice.changePhone(tel, val.access_token, (data) => {
                  if (data.success == true) {
                    this.changeAvailablity()
                    this.navCtrl.push(CodepagePage, { changePhone: 1, phoneToChange: tel })
                  }
                  else {
                    this.presentToast(this.translate.instant("phoneExists"))
                  }
                }, (data) => {
                  this.presentToast(this.translate.instant("serverError"))
                })
              })
            }
            else {
              this.presentToast(this.translate.instant("oldestMobile"))
            }
          })

        }
      }
    }
    else {
      this.presentToast(this.translate.instant("serverError"))
    }

  }
  changeAvailablity() {
    if (navigator.onLine) {
      this.loginservice.changeAvailability("0", localStorage.getItem("user_token"), (data) => {
        this.helper.updateStatus(0)
        this.storage.set("user_avaial", "0")
        this.presentToast(this.translate.instant('disconnected'))
      }, (data) => {
        this.helper.presentToast(this.translate.instant("serverError"))
      })

    }
    else {
      this.helper.presentToast(this.translate.instant("serverError"))
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
}
