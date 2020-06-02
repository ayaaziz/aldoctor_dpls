import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { TranslateService } from '@ngx-translate/core';
import { CenterOrderPage } from '../../pages/center-order/center-order';
import { NeworderPage } from '../../pages/neworder/neworder';
import { PharmacyOrderPage } from '../../pages/pharmacy-order/pharmacy-order';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  lang_direction= ""
  page=1;
  maximumPages;
  noData = false;
  data = [];
  constructor(public service: LoginServiceProvider, public helper: HelperProvider, public navCtrl: NavController,
    public navParams: NavParams, public storage: Storage, public loadingCtrl: LoadingController,
    public translate: TranslateService, public events: Events) { 
    this.lang_direction = this.helper.lang_direction;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }
  ionViewDidEnter() {
    console.log('ionViewDidLoad NotificationPage');
    this.page = 1
    this.loadNotification();
  }
  doRefresh(ev){
    ev.complete();
    this.data = []
    this.page = 1
    this.loadNotification();
  }
  loadNotification(infiniteScroll?) {
    if (!infiniteScroll){
      this.data = []
    }
    if(navigator.onLine){
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
    this.storage.get("user_login_token").then(data=>{
    this.service.getNotifications(this.page, this.helper.currentLang ,data.access_token,
      resp=>{
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        var notificatoionResp = resp.notifications;
        this.maximumPages = notificatoionResp.last_page;
        var notificationsData = notificatoionResp.data;
        if(notificationsData.length > 0){
         
          this.noData = false
        for(var i=0;i<notificationsData.length;i++){
          if(notificationsData[i].serviceprofileid ){
            if(notificationsData[i].serviceprofileid != this.helper.userId){
              notificationsData[i].orderstatus = 20;
            }
            }
          this.data.push(notificationsData[i]);
        }
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      }
      else{
        if(this.data.length == 0)
        this.noData = true
        this.page = -1;
        if(!infiniteScroll){
          if(this.data.length == 0)
          this.noData = true
        }
      }
      this.service.readNotification(data.access_token , (data)=> {
        this.events.publish('lengthdata', 0)
      },
    (data)=>{})
      },
      err=>{
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        this.helper.presentToast(this.translate.instant('serverError'))
        console.log("err from getNotifications: ",err);
      }
    );
  });
}
else{
  this.helper.presentToast(this.translate.instant('serverError'))
}
  }
 
  openOrder(item){
    if(item.data.url){
      this.storage.get('type').then(val => {
        if (val == 1) {
          this.navCtrl.push(PharmacyOrderPage, {recievedNotificat : item.data.url})
        }
        else if (val == 2) {
          this.navCtrl.push(CenterOrderPage, {recievedNotificat : item.data.url})
        }
        else if (val == 3) {
          this.navCtrl.push(CenterOrderPage, {recievedNotificat : item.data.url})
        }
        else if (val == 0) {
          this.navCtrl.push(NeworderPage, {recievedNotificat : item.data.url})
        } else if (val == 5) {
          this.navCtrl.push("NursingOrderPage", {recievedNotificat : item.data.url})
        }

      })
    }
  }
  loadMore(infiniteScroll) {
    setTimeout(() => {
    infiniteScroll.complete()
    if(this.page > 0){
      this.page++;
      this.loadNotification(infiniteScroll);
    }
    else{
      
      this.helper.presentToast(this.translate.instant('noMoreData'))
    }
  }, 500);
  }
}
