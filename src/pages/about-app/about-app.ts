import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { LoginServiceProvider } from '../../providers/login-service/login-service';

/**
 * Generated class for the AboutAppPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-app',
  templateUrl: 'about-app.html',
})
export class AboutAppPage {
  lang_direction= ""
  aboutdata

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
    public service: LoginServiceProvider, public helper: HelperProvider, public translate: TranslateService,) {
    this.lang_direction = helper.lang_direction
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutAppPage');
    this.storage.get("access_token").then(data=>{
      
      if (navigator.onLine) {
      this.service.AboutApplication(data,
        resp=>{
          console.log("resp from about-app : ",resp);
          this.aboutdata = resp[0].value;
          console.log("val from about app",this.aboutdata);
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

