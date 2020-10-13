import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { TabsPage } from '../tabs/tabs';


/**
 * Generated class for the ComplaintsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complaints',
  templateUrl: 'complaints.html',
})
export class ComplaintsPage {

  complaintTxt = ""
  constructor(public navCtrl: NavController, public navParams: NavParams, public service: LoginServiceProvider, 
    public helper: HelperProvider, public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintsPage');
  }
  sendComplaint(){
    if(!this.complaintTxt){
      this.helper.presentToast("الرجاء إدخال رسالتك")
      return;
    }
    if(navigator.onLine){
      this.service.sendCmplaint(this.complaintTxt , (data)=>{
        if(data.success){
          this.helper.presentToast("تم إرسال رسالتك بنجاح")
          setTimeout(() => {
            this.navCtrl.setRoot(TabsPage)
          }, 2000);
        }
        else{
          this.helper.presentToast(this.translate.instant("serverError"));

        }
      },
      ()=>{
        this.helper.presentToast(this.translate.instant("serverError"));
      })
    }
    else{
      this.helper.presentToast(this.translate.instant("serverError"));

    }
  }

}
