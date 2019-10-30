import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { LoginPage } from '../../pages/login/login';


/**
 * Generated class for the ConfirmsignPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirmsign',
  templateUrl: 'confirmsign.html'
})
export class ConfirmsignPage {
  lang_direction= ""
  tools = []
  service_id
  type
  constructor(public navCtrl: NavController, public navParams: NavParams,public translate: TranslateService
    , public helper: HelperProvider, public loginservice: LoginServiceProvider) {
    this.lang_direction = this.helper.lang_direction;
    this.type = navParams.get('type')
      this.service_id = navParams.get('service_id')
  }
  goToLogin(){
    this.navCtrl.setRoot(LoginPage)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmsignPage');
    if(this.type == 0 && this.service_id){
      this.loginservice.getTools(this.helper.currentLang,this.type,this.service_id, (data)=>{
        this.tools = data
      }, 
      (data)=>{

      })
    }
    
  }

}
