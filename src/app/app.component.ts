import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../providers/helper/helper';
import { Events, AlertController } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import * as firebase from 'firebase';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Market } from '@ionic-native/market';
import { CenterOrderPage } from '../pages/center-order/center-order';
import { NeworderPage } from '../pages/neworder/neworder';
import { PharmacyOrderPage } from '../pages/pharmacy-order/pharmacy-order';
var firebaseConfig  = {
  apiKey: "AIzaSyBPvbu83CtqeV67AihfGfwxKRzq4ExENNo",
  authDomain: "aldoctor-b33ed.firebaseapp.com",
  databaseURL: "https://aldoctor-b33ed.firebaseio.com",
  projectId: "aldoctor-b33ed",
  storageBucket: "aldoctor-b33ed.appspot.com",
  messagingSenderId: "381921023811"
};

@Component({
  templateUrl: 'app.html',
  providers: [Push, SocialSharing, Market]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any //= TabsPage; 
  langDirection: string;
  userLoged: boolean = false;
  userImageUrl: string = "assets/imgs/first.jpg";
  userName: string = "";
  reportStr = ""
  message_id
  constructor(public kawaeeb_service: LoginServiceProvider, public events: Events, public helper: HelperProvider, public platform: Platform, public storage: Storage,
    statusBar: StatusBar, splashScreen: SplashScreen, public push: Push, private alertCtrl: AlertController,private market: Market, 
    public translate: TranslateService, public socialSharing: SocialSharing) {
    firebase.initializeApp(firebaseConfig);
    
    events.subscribe('user:userLogedout', () => {
      this.userLoged = false;
      console.log("user loged out")
      this.storage.remove("user_login_token")
          this.storage.remove("user_login_info").then(() => {
            localStorage.removeItem('kdkvfkhggsso')
            localStorage.removeItem('reefdfdfvcvc')
            this.userLoged = false;
            this.nav.setRoot(LoginPage);
          })
    });
    events.subscribe('user:changeLang', () => {
      this.langDirection = this.helper.lang_direction;
      console.log("user changeLang")
    });
    events.subscribe('new_order', () => {
      this.nav.setRoot(TabsPage)
    });
    events.subscribe('user:userLoginSucceededPending', (userData) => {
      this.userLogged();
      console.log("userLoginSucceeded: " + JSON.stringify(userData))
       this.storage.get('type').then(type_val => {
          if(type_val == 0){
            this.reportStr = "تقرير مالي"
            this.userName = userData.nickname
            this.userImageUrl = userData.profile_pic
          }
          else{
            this.reportStr = "موعد الإشتراك"
            this.userName = userData.name
            this.userImageUrl = userData.profile_pic
          }
        })
    });
    //Register event that fired when user login successfully.
    events.subscribe('user:userLoginSucceeded', (userData) => {
      this.userLogged();
      console.log("userLoginSucceeded: " + JSON.stringify(userData))
      this.storage.get('type').then(type_val => {
        if(type_val == 0){
          this.reportStr = "تقرير مالي"
          this.userName = userData.nickname
          this.userImageUrl = userData.profile_pic
          this.nav.setRoot(TabsPage)
        }
        else{
          this.reportStr = "موعد الإشتراك"
          this.userName = userData.name
          this.userImageUrl = userData.profile_pic
          this.nav.setRoot(TabsPage)
        }
      })
      
      console.log("user data", JSON.stringify(userData))
    });


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString("#418f6a");
      splashScreen.hide();
      this.initializeApp();
    });
    this.storage.get("user_login_info").then((val) => {

      if (val != null) {
        this.storage.get('type').then(type_val => {
          if(type_val == 0){
            this.reportStr = "تقرير مالي"
            this.userName = val.nickname
            this.userImageUrl = val.profile_pic
          }
          else{
            this.reportStr = "موعد الإشتراك"
            this.userName = val.name
            this.userImageUrl = val.profile_pic
          }
        })
        
      
       
      }

    })
  }
  openHome() {
    this.nav.setRoot(TabsPage)
  }
  openAbout() {
    this.nav.setRoot('AboutAppPage')
  }
  openPrivacyPolicy() {
    this.nav.setRoot('PrivacyPolicyPage')
  }
  openSettings() {
    this.nav.setRoot('SettingsPage')
  }
  openContact() {
    this.nav.setRoot('ContacUsPage')
  }
  openNewOrder() {
    this.nav.push(CenterOrderPage)
  }
  openPayPolicy() {
    this.nav.setRoot('PaidPolicyPage')
  }
  openUseOfConditions() {
    this.nav.setRoot('UseConditionsPage')
  }
  userLogged() {
    this.userLoged = true;
  }
  //Logout function 
  Logout() {
    console.log("Logout");
    //this.helper.clientId = ""

    if (navigator.onLine) {
      this.helper.fireSignOut()
      this.storage.get("user_login_token").then((val) => {
       
        this.kawaeeb_service.updateNotification(0, val.access_token, (data) => {
          //this.events.publish('removeMap');
          this.storage.remove("user_login_token")
          this.storage.remove("user_login_info").then(() => {
            this.userLoged = false;
            this.nav.setRoot(LoginPage);
          })
          this.kawaeeb_service.logmeout(()=>{},()=>{})
        }, (data) => {
          this.helper.presentToast(this.translate.instant("serverError"))
        })
      })
    }

  }
  shareApp() {
    var shareLink;
    if (this.platform.is('ios')) {

      shareLink = "https://itunes.apple.com/us/app/dpls/id1440723867?ls=1&mt=8";
    } else {
      shareLink = "http://play.google.com/store/apps/details?id=net.ITRoots.AlDoctor";
    }

    // assets/imgs/dlogo.png
    this.socialSharing.share("DPLS Application store link", null, null, shareLink).then(() => {
      console.log("success")
    }).catch((err) => {
      console.log("not available : ",err)
    });
  }
  RateApp(){
    // set certain preferences
    //this.appRate.preferences.useLanguage = 'ar';
// this.appRate.preferences.storeAppURL = {
//   ios: '<app_id>',
//   android: 'market://details?id=net.ITRoots.AlDoctor',
// };

//this.appRate.promptForRating(true);
let market 
if (this.platform.is('ios')) {
//  market = "id1440723867"
market = "id1475922289"
}
else {
  market = "net.ITRoots.AlDoctor"
}
this.market.open(market);
  }
  initializeApp() {
    if (this.platform.is('ios')) {
      this.helper.device_type = "0"
    }
    else {
      this.helper.device_type = "1"
    }
    //get app language from offline data.
    //this.storage.set("LanguageApp",'ar')
    this.storage.set("LanguageApp",'ar').then(()=>{

    
    this.storage.get("LanguageApp").then((val) => {
      if (val == null) {
       
        // if offline lang value not saved get mobile language.
        var userLang = navigator.language.split('-')[0];
        // check if mobile lang is arabic.
        if (userLang == 'ar') {
          this.translate.use('ar');
          this.helper.currentLang = 'ar';
          this.translate.setDefaultLang('ar');
          this.helper.lang_direction = 'rtl';
          this.langDirection = "rtl";
          this.platform.setDir('rtl', true)
          //  this.menuDirection = "right";
          this.storage.set("LanguageApp", "ar");
        }
        else {
          // if mobile language isn't arabic then make application language is English.

          this.translate.setDefaultLang('en');
          this.translate.use('en');
          this.helper.currentLang = 'en';
          this.helper.lang_direction = 'ltr';
          this.langDirection = "ltr";
          this.platform.setDir('ltr', true)
          //   this.menuDirection = "left";
          this.storage.set("LanguageApp", "en");
        }
      }
      //If application language is saved offline and it is arabic.
      else if (val == 'ar') {
        this.translate.use('ar');
        this.helper.currentLang = 'ar';
        this.translate.setDefaultLang('ar');
        this.helper.lang_direction = 'rtl';
        this.langDirection = "rtl";
        this.platform.setDir('rtl', true)
        // this.menuDirection = "right";
      }
      //If application language is saved offline and it is English.
      else if (val == 'en') {
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        this.helper.currentLang = 'en';
        this.langDirection = "ltr";
        this.helper.lang_direction = 'ltr';
        this.platform.setDir('ltr', true)
        // this.menuDirection = "left";
      }
    });

    // Get offline user data to skip login.
    this.storage.get('user_login_info')
      .then((val) => {
        // user is previously logged and we have his data
        // we will let him access the app

        if (val) {
          this.userLogged();
          console.log("offline data ", JSON.stringify(val));
          // this.userName = val[0].CLIENT_NAME;
          // this.userImageUrl = val[0].CLIENT_IMAGE;
          // this.helper.clientId = val[0].CLIENT_ID
          //if app found saved user info then make root page for app is Home
          this.rootPage = TabsPage;
        }
        else {
          //if app not found saved user info then make root page for app is login view.
          this.rootPage = LoginPage;
        }
        
      });
    })
    //this.helper.notification_order_id = "3"
    this.pushnotification();
  }
  financialReport(){
    this.nav.setRoot('FinancialPage')
  }
  sendComplaint(){
    this.nav.setRoot('ComplaintsPage')
  }
  pushnotification() {
    let options: PushOptions
    options = {
      android: {
        icon: "icon"
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      }
    }
    this.push.createChannel({
      id: "doctorchannel1",
      description: "doctor channel",
      // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
      importance: 5,
      sound: "ambulance",
      // sound: "alarm_nice_sound",
    
      
     }).then(() => console.log('Channel created'));


    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      this.storage.get("user_login_token").then(data => {
        if(data){ 
      console.log("notification " + JSON.stringify(notification))
      if (this.platform.is('ios')) {

        if(this.message_id != notification.additionalData["gcm.message_id"]){
          if(! notification.additionalData["gcm.notification.OrderID"]){
            return;
          }
        this.message_id = notification.additionalData["gcm.message_id"]
          console.log(JSON.stringify(notification))
                  this.helper.notification_order_id = notification.additionalData["gcm.notification.OrderID"]
                  
                        this.storage.get('type').then(val => {
                          if (val == 1) {
                               this.nav.push(PharmacyOrderPage, {recievedNotificat : notification.additionalData["gcm.notification.OrderID"]})
                           
                          }
                          else if (val == 2) {
                              this.nav.push(CenterOrderPage , {recievedNotificat : notification.additionalData["gcm.notification.OrderID"]})
                         
                          }
                          else if (val == 3) {
                              this.nav.push(CenterOrderPage, {recievedNotificat : notification.additionalData["gcm.notification.OrderID"]})
                        
                          }
                          else if (val == 0) {
                              this.nav.push(NeworderPage, {recievedNotificat : notification.additionalData["gcm.notification.OrderID"]})
                          
                            
                          }
                        })

                      }

      }
      else {
        console.log("notification " + JSON.stringify(notification))
        if (notification.additionalData.foreground == true) {
          console.log(JSON.stringify(notification))
          if(!notification.additionalData.OrderID){
            return;
          }
                  this.helper.notification_order_id = notification.additionalData.OrderID
                  // this.storage.set("recievedNotificat", notification.additionalData.OrderID).then(() => {
                   // this.helper.updateBusy(1)
                    // this.storage.set("orderID", notification.additionalData.OrderID).then(() => {
                    //   this.storage.set("patient_id", notification.additionalData.patient_id).then(() => {
                        this.storage.get('type').then(val => {
                          if (val == 1) {
                            //this.nav.setRoot(TabsPage).then(()=>{
                              this.nav.push(PharmacyOrderPage, {recievedNotificat : notification.additionalData.OrderID})
                         // })
                          }
                          else if (val == 2) {
                            // this.nav.setRoot(TabsPage).then(()=>{
                              this.nav.push(CenterOrderPage, {recievedNotificat : notification.additionalData.OrderID})
                            // })
                            
                          }
                          else if (val == 3) {
                          //  this.nav.setRoot(TabsPage).then(()=>{
                              this.nav.push(CenterOrderPage, {recievedNotificat : notification.additionalData.OrderID})
                          //  })
                            
                          }
                          else if (val == 0) {
                          //  this.nav.setRoot(TabsPage).then(()=>{
                              this.nav.push(NeworderPage, {recievedNotificat : notification.additionalData.OrderID})
                           // })
                            
                          }
                        })
                  //     })
                  //   })

                  // })

        }
        else{
       // this.storage.set("recievedNotificat", notification.additionalData.OrderID).then(() => {
         if(!notification.additionalData.OrderID){
           return;
         }
          this.helper.notification_order_id = notification.additionalData.OrderID
          //this.helper.updateBusy(1)
          //this.storage.set("orderID", notification.additionalData.OrderID).then(() => {
          //  this.storage.set("patient_id", notification.additionalData.patient_id).then(() => {
              this.storage.get('type').then(val => {
                if (val == 1) {
                  this.nav.push(PharmacyOrderPage, {recievedNotificat : notification.additionalData.OrderID})
                }
                else if (val == 2) {
                  this.nav.push(CenterOrderPage, {recievedNotificat : notification.additionalData.OrderID})
                }
                else if (val == 3) {
                  this.nav.push(CenterOrderPage, {recievedNotificat : notification.additionalData.OrderID})
                }
                else if (val == 0) {
                  this.nav.push(NeworderPage, {recievedNotificat : notification.additionalData.OrderID})
                }
              })
           // })
        //  })

      //  })
      }
    }
  }
  else{
    this.helper.presentToast("يجب عليك تسجيل الدخول")
  }
    })
    });
    pushObject.on('registration').subscribe((registration: any) => {
      console.log("registrationId " + registration.registrationId)
      this.helper.registration = registration.registrationId;
      // if(localStorage.getItem("firebaseRegNoti")){
      //   if(localStorage.getItem("firebaseRegNoti") == registration.registrationId){
      //     localStorage.setItem("regChanged","0")
      //   }
      //   else{
      //     localStorage.setItem("regChanged","1")
      //     localStorage.setItem("firebaseRegNoti",registration.registrationId)
      //   }
      // }
      // else{
      //   localStorage.setItem("regChanged","1")
      // }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    
  }
}
