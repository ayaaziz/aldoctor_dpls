import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/timeout';
import { TabsPage } from '../tabs/tabs';




@IonicPage({
  name: 'cancel-order'
})
@Component({
  selector: 'page-cancel-order',
  templateUrl: 'cancel-order.html',
})
export class CancelOrderPage {
  reasons = [];
  userReasons = [];
  orderId;
  accessToken;
  desc ="";
  langDirection;
  tostClass;
  orderStatus;

  disableCancelBtn:boolean = false;

  constructor(public storage: Storage, public helper: HelperProvider,
    public service: LoginServiceProvider, public translate: TranslateService,
    public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController) {
    this.orderId = this.navParams.get('orderId');
    this.orderStatus = this.navParams.get('status')
    this.langDirection = this.helper.lang_direction;
    if (this.langDirection == "rtl")
      this.tostClass = "toastRight";
    else
      this.tostClass = "toastLeft";
    //this.translate.use(this.helper.currentLang);
    console.log("orderId from cancel order: ", this.orderId);

     //ayaaa
     this.disableCancelBtn = false;
  
  }
  doRefresh(ev){
    ev.complete();
    this.reasons = []
    this.ionViewDidLoad()
  }
  ionViewDidLoad() {
    //this.helper.orderNoDRs(this.orderId)
    console.log('ionViewDidLoad CancelOrderPage');
    this.storage.get("user_login_token").then(data => {
      this.accessToken = data.access_token;
      this.service.cancelreasons(this.accessToken,this.helper.userType).timeout(10000).subscribe(
        resp => {
          this.reasons = []
          console.log("resp from cancelreasons: ", resp);
          var cancelationReasons = JSON.parse(JSON.stringify(resp));
          console.log("l = ", cancelationReasons.length);

          for (var i = 0; i < cancelationReasons.length; i++) {
            console.log("reasons ", cancelationReasons[i]);
            this.reasons.push(cancelationReasons[i]);
          }

        }, err => {
          console.log("error from cancelreasons: ", err);
        }

      );


    });
  }
  reasonChecked(item, event) {
    if (item.checked == true) {
      console.log("reason checked ", item);
      this.userReasons.push(item.id);
    }
    else {
      console.log("reason unchecked ", item);
      for (var i = 0; i < this.userReasons.length; i++) {
        if (item.id == this.userReasons[i])
          this.userReasons.splice(i, 1);
      }
    }

  }
  cancelOrder() {

    //ayaaa
    this.disableCancelBtn = true;
    ///

    console.log("user reasons", this.userReasons.join());
    console.log("desc: ", this.desc);
    console.log("order id from cancle: ", this.orderId);
    if (navigator.onLine) {
     //if(this.helper.listenOrderStatus != "0"){
        if(this.userReasons.length == 0){
        this.helper.presentToast(this.translate.instant("noResaonsSelected"))
        return;
        }
      this.service.cancelorder(this.orderId, this.userReasons.join(), this.desc, this.accessToken,this.helper.userType,this.orderStatus).timeout(10000).subscribe(
        resp => {
          console.log("cancel order resp: ", resp);
          localStorage.setItem("lastCanceled",this.orderId)
          if(this.helper.current_order_dr_no == 1){
           // this.helper.updateOrderStatus(this.orderStatus , this.orderId)
          }
          this.storage.remove("recievedNotificat").then(() => {
            if(this.helper.userType == 0){
              this.helper.updateBusy(0)
            }
            if(String(status) == "4"){
            }
            else{
              this.presentToast(this.translate.instant("orderCancled"));
            }
            
            this.navCtrl.pop()
          })
        },
        err => {
          this.helper.presentToast(this.translate.instant("serverError"));
        }
      );
    // }
    // else{
    //   this.helper.presentToast(this.translate.instant("upDR"))
    // }
    } else {
      this.helper.presentToast(this.translate.instant("serverError"));
    }
  }


  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom',
      cssClass: this.tostClass
    });
    toast.present();
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
