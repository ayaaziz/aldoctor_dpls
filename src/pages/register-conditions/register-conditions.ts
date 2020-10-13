import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the RegisterConditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-conditions',
  templateUrl: 'register-conditions.html',
})
export class RegisterConditionsPage {
  lang_direction= ""
  conditions_data;
  constructor(public storage: Storage, public helper: HelperProvider, public navCtrl: NavController, 
    public service: LoginServiceProvider,  public translate: TranslateService, 
    public navParams: NavParams) {
      this.lang_direction = this.helper.lang_direction;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterConditionsPage');
    this.storage.get("access_token").then(data=>{
      
      //alert(this.accessToken)
      if (navigator.onLine) {
      this.service.terms(data, this.helper.currentLang,
        resp=>{
          console.log("resp from about-app : ",resp);
          this.conditions_data = resp[0].value;
          console.log("val from about app",this.conditions_data);
        },err=>{
          console.log("error from about-app : ",err);
          this.helper.presentToast(this.translate.instant("serverError"));
        }
      );
    }else{
      this.helper.presentToast(this.translate.instant("serverError"));
    }
    });
  }

}
