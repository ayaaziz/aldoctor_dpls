import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { LoginServiceProvider } from '../../providers/login-service/login-service';

/**
 * Generated class for the UseConditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-use-conditions',
  templateUrl: 'use-conditions.html',
})
export class UseConditionsPage {
  lang_direction= ""
  conditions_data
  constructor(public storage: Storage, public helper: HelperProvider, public navCtrl: NavController, 
    public service: LoginServiceProvider,  public translate: TranslateService, 
    public navParams: NavParams) {
    this.lang_direction = this.helper.lang_direction;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UseConditionsPage');
    this.storage.get("access_token").then(data=>{
      
      //alert(this.accessToken)
      if (navigator.onLine) {
        this.storage.get('type').then(val=>{
          this.service.ConditionsForAllServices(data,val ,this.helper.currentLang,
            resp=>{
            console.log("resp from about-app : ",resp);
            if(JSON.parse(JSON.stringify(resp)))
              this.conditions_data = resp[0].value;
            // console.log("val from about app",this.conditions_data);
            },err=>{
            console.log("error from about-app : ",err);
            this.helper.presentToast(this.translate.instant("serverError"));
          }
        );

        })
        
      // this.service.Conditions(data, this.helper.currentLang,
      //   resp=>{
      //     console.log("resp from about-app : ",resp);
      //     this.conditions_data = resp[0].value;
      //     console.log("val from about app",this.conditions_data);
      //   },err=>{
      //     console.log("error from about-app : ",err);
      //     this.helper.presentToast(this.translate.instant("serverError"));
      //   }
      // );
    }else{
      this.helper.presentToast(this.translate.instant("serverError"));
    }
    });
  }

}
