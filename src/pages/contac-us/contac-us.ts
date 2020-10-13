import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ContacUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contac-us',
  templateUrl: 'contac-us.html',
})
export class ContacUsPage {
  lang_direction= ""
  email
  phone_one
  phone_two
  constructor(public navCtrl: NavController, public navParams: NavParams, public helper: HelperProvider
    ,public loginservice: LoginServiceProvider, public storage: Storage, public toastCtrl: ToastController
    ,public translate: TranslateService,) {
    this.lang_direction = this.helper.lang_direction;
  }
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'center'
    });
    toast.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ContacUsPage');
    if(navigator.onLine){
    this.storage.get("user_login_token").then((val)=>{
    this.loginservice.ContactUsEmail(val.access_token, (data)=> {
      //alert(data[0].decoded_value)
      this.email = data[0].decoded_value
    },
  (data)=>{
    this.presentToast(this.translate.instant("serverError"))
  })
  this.loginservice.ContactUsPhone(val.access_token, (data)=> {
    //alert(data[0].decoded_value)
    this.phone_two = data[0].decoded_value
  },
(data)=>{
  this.presentToast(this.translate.instant("serverError"))
})
this.loginservice.ContactUsMobile(val.access_token, (data)=> {
  //alert(data[0].decoded_value)
  this.phone_one = data[0].decoded_value
},
(data)=>{
this.presentToast(this.translate.instant("serverError"))
})
    })
  }
  else{
    this.presentToast(this.translate.instant("serverError"))
  }
  }
}
