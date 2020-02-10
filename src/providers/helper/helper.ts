import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import php from 'php-serialize';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
// import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { TranslateService } from '@ngx-translate/core';
import { Platform, AlertController, ToastController, Events } from 'ionic-angular';
import { App } from "ionic-angular";
import { TabsPage } from '../../pages/tabs/tabs';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer';
import { Storage } from '@ionic/storage';
declare var Buffer: any;

declare function require(name: string);
var crypto = require('crypto');

@Injectable()
export class HelperProvider {
  DeviceId: any; badge: any;
  registration: any;
  numberOfItemsPerPage = 4
  BASE_64_PREFIX = 'base64:';
  public lang_direction = "ltr";
  public notification_order_id
  public currentLang = 'en';
  public trackID = 'UA-115298557-1';
  public moveToPatient = 0
  public clientId: string = "";
  public AndroidAppVersion = ''
  public time: any;
  public appAccess: string = "";
  public selectedIDCat = 0
  public userTabAll = false
  public device_type;
  public userBusy = 0;
  appInBackground = 0
  public userType = 0
  public inspectorLat: number = 0.0;
  public inspectorLong: number = 0.0;
  public key =  "AIzaSyCqLKTRbSzlXV86rXciYGUPF7fNdVPsgnA";
  public inspectorLocAccuracy;
  public userAvailable = 1
  newOrder = -1
  userId: string;
  trackInterval
  lastFireOrderID
  locAlert = 0
  listenOrderStatus;
  current_order_dr_no = 1
  logoutMsgStatus = 0
  toastHelper 
  public serviceUrl: string = "http://aldoctor-app.com/aldoctor/public/";
   //last api for testing
  //  public serviceUrl: string = "http://aldoctor-app.com/aldoctorfinaltest/public/";


 // public serviceUrl: string = "http://aldoctor-app.com/aldoctor3/public/";
  public apiKey = 'base64:IsXQGEGmL6DRd1O4sdFqdKxIk5VV1njIy/rxbkrVVuo=';


  public googleApiKey = "AIzaSyCqLKTRbSzlXV86rXciYGUPF7fNdVPsgnA";
  public serviceAddress;
  public type_id;

  // <name>ALDOCTOR Partner</name> ios
  // <name>DPLS</name> andoid
  // D-Partner 

  // net.ITRoots.dpls    ios
  // net.ITRoots.AlDoctor     android

  
  constructor(public platform: Platform, public toastCtrl: ToastController, public alertCtrl: AlertController,
    public http: HttpClient, public diagnostic: Diagnostic, public locationAccuracy: LocationAccuracy,
    public app: App, public translate: TranslateService, private geolocation: Geolocation,
    public events: Events, public storage: Storage) {
  }

  

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  // private updateOnDisconnect() {
  //   // clearInterval(this.trackInterval)
  //   firebase.database().ref().child(`user/${this.userId}/availablity/online`)
  //     .onDisconnect()
  //     .update({ status: 0 })
  // }
  // public orderNoDRs(order_id){
  //   firebase.database().ref(`orders/${order_id}/doctorsNo`).on('value', (snap) => {
  //     //alert("String(snap.val())" + String(snap.val()))
  //     if(snap.val()){
  //    this.current_order_dr_no = snap.val()      
  //   }
  //   })
  // }
  // public listenOrder(order_id) {
  //   if (navigator.onLine) {
  //     firebase.database().ref(`orders/${order_id}/orderStatus`).on('child_changed', (snap) => {
  //       console.log("newOrder 1" + snap.val())
  //       this.listenOrderStatus = String(snap.val())
  //       //this.storage.set("recievedNotificat", snap.val()).then(() => {
  //       if (String(snap.val()) == "4") {
  //         console.log("orderStatus " + snap.val())
  //         // this.storage.remove("recievedNotificat").then(() => {
  //         //   this.updateBusy(0)
  //         //   this.events.publish('clearTimout')
  //         //   let nav = this.app.getActiveNav();
  //         //   nav.setRoot(TabsPage)
  //         // })
  //       }
  //       //})

  //     })
  //     // firebase.database().ref(`user/${this.userId}/availablity/busy`).on('child_changed', (snap) => {

  //     //   if (snap.val()) {
  //     //     this.events.publish('user:busy', snap.val())
  //     //   }
  //     // })
  //     firebase.database().ref(`orders/${order_id}/serviceProfileId`).on('value', (snap) => {
  //       if(snap.val()){
          
  //       if (String(snap.val()) != String(this.userId)) {
  //         //alert("firebase "+String(snap.val()) + " " +String(this.userId))
  //        // this.updateBusy(0)
  //        // this.events.publish('clearTimout',order_id)
  //        // console.log("clearTimout")
  //           // let nav = this.app.getActiveNav();
  //           // nav.setRoot(TabsPage)
  //       }
  //     }
  //     })
  //   }

  // }

  intializeFirebase() {
    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value",  (snap) => {
      if (snap.val() === true) {
       // this.userAvailable = 1
        if(this.toastHelper){
          this.toastHelper.dismiss()
        }
        if(this.appInBackground == 0){
        //this.presentToast(this.translate.instant("firebaseConnected"))
        }
       // this.events.publish('changeOnline',1)
      } else {
       // this.userAvailable = 0
       // this.events.publish('changeOnline',0)
        if(this.appInBackground == 0){
        //this.presentCenterToast(this.translate.instant("cannotGetAccessToken"))
        }
      }
    });
    // if (navigator.onLine) {
    //   firebase.database().ref(`user/${this.userId}/order`).on('child_changed', (snap) => {
    //     console.log("newOrder 1" + snap.val())
    //     // this.storage.get("recievedNotificat").then(val => {
    //     if (String(snap.val()) != "0") {
    //       this.storage.set("recievedNotificat", snap.val()).then(() => {
    //         this.updateBusy(1)
    //         if (snap.val() != this.lastFireOrderID) {
    //           console.log("newOrder " + snap.val())
    //           // if (this.appInBackground == 0) {
    //           this.lastFireOrderID = snap.val()
    //           let nav = this.app.getActiveNav();
    //           nav.push('NeworderPage')
    //           // }
    //         }
    //       })
    //     }
    //   })
    //   this.updateOnConnect()
    // }
    //ççç}, 10000)
    //this.updateOnConnect()
    //this.updateOnDisconnect()

      //   firebase.database().ref(`orders/${this.userId}/availablity/online/status`).on('value', (snap) => {
      //   if(snap.val()){
      //     //alert("busy "+snap.val())
      //     this.userBusy = snap.val()
      // }
      // })

    // })


  }
  // updateOrderStatus(status, order_id) {
  //   if (!this.userId) return
  //   firebase.database().ref().child(`orders/${order_id}/orderStatus`).update({ status: status })
  // }
  updateUserLoc(loc: string) {
    if (!this.userId) return
    firebase.database().ref().child(`user/${this.userId}/location`).update({ loc: loc })
  }

  getDoctorlocation(userId){
    firebase.database().ref(`user/${userId}/location/loc`).on('value',(snap)=>{
      //alert("newOrder "+ snap.val())
      console.log("get doctor location "+snap.val());
     var xx =  snap.val()
    // var xx =  ""
    if (xx){
      console.log("doctor has loc")
    }else{
      console.log("doctor hasn't loc")
      this.geoLoc(data => this.getCurrentLocforHelper(data));
    }
      
  
    });
  }

  getCurrentLocforHelper(loc) {

    //console.log("witting loc " + JSON.stringify(loc))
    if (loc == "-1") {
      //this.presentToast(this.translate.instant("locFailed"))
    }
    else {
      // this.DoctorLat = loc.inspectorLat;
      // this.DoctorLong = loc.inspectorLong;
      this.updateUserLoc(loc.inspectorLat + ',' + loc.inspectorLong)

    }
  }

  public updateBusy(status) {
    if (!this.userId) return
    if (this.userType != 0) {status= 0}
    firebase.database().ref().child(`user/${this.userId}/availablity/busy`).update({ status: status })
  }
  public updateServiceProfile(order_id) {
    // if (!this.userId) return
    // firebase.database().ref().child(`orders/${order_id}`).update({ serviceProfileId: this.userId })
  }
  public updateStatus(status) {
    if (!this.userId) return
    //firebase.database().ref().child(`user/${this.userId}/availablity/online`).update({ status: status })
    let time = Date.now()
    firebase.database().ref().child(`user/${this.userId}/availablity`).update({ updated: time })
    firebase.database().ref().child(`user/${this.userId}/order`).update({ new_order: 0 })
  }
  /// Updates status when connection to Firebase starts
  private updateOnConnect() {
    firebase.database().ref('.info/connected').on('value', snapshot => {
      console.log(snapshot.numChildren())
      console.log(snapshot.val());
      let status = snapshot.val() == true ? 1 : 0
      this.updateStatus(status)
    })

  }
  encrypt(value) {
    if (typeof this.apiKey === 'string' && this.apiKey.startsWith(this.BASE_64_PREFIX)) {
      this.apiKey = Buffer.from(this.apiKey.replace(this.BASE_64_PREFIX, ''), 'base64');
    }

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('AES-256-CBC', this.apiKey, iv);
    let payloadValue = cipher.update(php.serialize(value), 'utf8', 'base64');
    payloadValue += cipher.final('base64');

    const ivStr = new Buffer(iv).toString('base64');
    const hmac = crypto.createHmac('sha256', this.apiKey);

    const mac = hmac.update(ivStr + payloadValue).digest('hex');

    return new Buffer(JSON.stringify({
      iv: ivStr,
      value: payloadValue,
      mac: mac
    })).toString('base64');
  }
  decrypt(encryptedValue) {
    if (typeof this.apiKey === 'string' && this.apiKey.startsWith(this.BASE_64_PREFIX)) {
      this.apiKey = Buffer.from(this.apiKey.replace(this.BASE_64_PREFIX, ''), 'base64');
    }

    const main = JSON.parse(Buffer.from(encryptedValue, 'base64'));
    const iv = Buffer.from(main.iv, 'base64');
    const decipher = crypto.createDecipheriv('AES-256-CBC', this.apiKey, iv);
    let payloadValue = decipher.update(main.value, 'base64', 'utf8');
    payloadValue += decipher.final('utf8');

    return php.unserialize(payloadValue);
  }
  geolocationStarted() {

    // let toast = this.toastCtrl.create({
    //   message: this.translate.instant("locLoading"),
    //   duration: 3000,
    //   position: 'bottom',
    //   cssClass: 'waittingToast'
    // });
    // toast.present();
    // console.log("after toast ")
  }
 
  fireSignOut() {
    this.newOrder = null
    clearInterval(this.trackInterval)
    this.updateStatus(0)

  }
  public presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  public logout(){
    //if(this.logoutMsgStatus == 0){
      //this.presentToast("لقد أنتهت صلاحية الجلسة الخاصة بك، يجب عليك تسجيل الدخول")
     // this.logoutMsgStatus = 1
    //}
    this.events.publish('clearTimout')
    this.events.publish('user:userLogedout')
  }
  public presentCenterToast(text) {
    this.toastHelper = this.toastCtrl.create({
      message: text,
      showCloseButton : true,
      duration: 4000,
      closeButtonText : this.translate.instant('close'),
      position: 'bottom'
    });
    this.toastHelper.present();
  }
  geoLoc(success) {

    let LocationAuthorizedsuccessCallback = (isAvailable) => {
      //console.log('Is available? ' + isAvailable);
      if (isAvailable) {
        // this.locAlert = 0
        if (this.platform.is('android')) {
          this.diagnostic.getLocationMode().then((status) => {
            if (!(status == "high_accuracy")) {
              this.requestOpenGPS(success)
            }
            else {
              this.GPSOpened(success);
            }
          })
        }
        else {
          this.requestOpenGPS(success);
        }

      }
      else {
        this.requestOpenGPS(success);
      }
    };
    let LocationAuthorizederrorCallback = (e) => {
      console.error(e)
      this.requestOpenGPS(success);
    }
      ;
    this.diagnostic.isLocationAvailable().then(LocationAuthorizedsuccessCallback).catch(LocationAuthorizederrorCallback);

  }
  GPSOpened(success) {
    let optionsLoc = {}
    optionsLoc = { timeout: 30000, enableHighAccuracy: true, maximumAge: 3600 };
    this.geolocation.getCurrentPosition(optionsLoc).then((resp) => {
      //this.events.publish("locationEnabled")
      this.inspectorLat = resp.coords.latitude;
      this.inspectorLong = resp.coords.longitude;
      this.inspectorLocAccuracy = resp.coords.accuracy;
      let data = {
        inspectorLat: resp.coords.latitude,
        inspectorLong: resp.coords.longitude,
        inspectorLocAccuracy: resp.coords.accuracy
      }
      success(data);
    }
    ).catch((error) => {
      success("-1");
    });


  }
  requestOpenGPS(success) {
    if (this.platform.is('ios')) {
      this.diagnostic.isLocationEnabled().then(enabled => {
        if(enabled){
          this.diagnostic.getLocationAuthorizationStatus().then(status => {
            if (status == this.diagnostic.permissionStatus.NOT_REQUESTED) {
              this.diagnostic.requestLocationAuthorization().then(status => {
                if (status == this.diagnostic.permissionStatus.NOT_REQUESTED) {
                  this.locationAccuracy.canRequest().then(requested => {
                    if (requested) {
                      this.requestOpenGPS(success)
                    }
                    else {
                      success("-1")
                    }
  
                  }).catch(err => success("-1"))
                }
                else if (status == this.diagnostic.permissionStatus.GRANTED || status == this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
                  this.GPSOpened(success);
                }
                else{
                  success("-1")
                }
              })
            }
            else if (status == this.diagnostic.permissionStatus.DENIED) {
              success("-1")
            }
            else if (status == this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
              this.GPSOpened(success);
            }
          });
        }
        else{
          this.diagnostic.requestLocationAuthorization().then(val => {
            if (val == "GRANTED") {
              this.requestOpenGPS(success)
            }
            else {
              success("-1")
            }
          })
        }
      })
    }
    else {
      this.diagnostic.isLocationAuthorized().then(authorized => {
        if (authorized) {
          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {
                  console.log('Request successful')

                  this.GPSOpened(success);
                },
                error => {
                  console.log('Error requesting location permissions', error);

                  success("-1")
                }
              );
            }

            else {
              console.log('Error requesting location permissions');

              success("-1")
          
            }
          });
        }
        else {
          this.diagnostic.requestLocationAuthorization().then(val => {
            if (val == "GRANTED") {
              this.requestOpenGPS(success)
            }
            else {
              success("-1")
            }
          })
        }
      })
    }

  }
}
