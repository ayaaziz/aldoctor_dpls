import { Component } from '@angular/core';
import { NavController, MenuController, ToastController, Events } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase/app';
import { CenterOrderPage } from '../../pages/center-order/center-order';
import { NeworderPage } from '../../pages/neworder/neworder';
import { PharmacyOrderPage } from '../../pages/pharmacy-order/pharmacy-order';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [LaunchNavigator]
})
export class HomePage {
  ratingStatus = 0.2
  orderAccepted = false;
  userName = ""
  userImageUrl = ""
  userAddress = ""
  lang_direction = ""
  arriveTime = "..."
  newOrder = false;
  noOrder = false;
  timeLeft: number = 45;
  remaining_time = 1
  interval;
  trackInterval;
  DoctorLat;
  DoctorLong;
  currentOrderID;
  //appInBackground = 0
  moveToPatientStatus = true
  startDetectionStatus = true
  requestReturnStatus = true
  terminateStatus = true
  patient_lat;
  patient_long;
  patient_id;
  patient_tel;
  user_availablity = true
  timer;
  busyUser = false
  busyStatus = 0
  currentOrders = []
  page = 1

  constructor(public navCtrl: NavController, public menu: MenuController, public loginservice: LoginServiceProvider
    , public helper: HelperProvider, public toastCtrl: ToastController, public translate: TranslateService,
    private launchNavigator: LaunchNavigator, public storage: Storage, public events: Events) {
    this.lang_direction = this.helper.lang_direction;
    events.subscribe('user:userLoginSucceededHome', (userData) => {
      console.log("userLoginSucceeded: " + JSON.stringify(userData))
      this.storage.get('type').then(type_val => {
        if (type_val == 0) {
          this.userName = userData.nickname
          this.userImageUrl = userData.profile_pic
        }
        else {
          this.userName = userData.name
          this.userImageUrl = userData.profile_pic
        }
      })
    });
    events.subscribe('changeOnline', (data) => {

      if (data == 1) {
        this.storage.get('user_avaial').then(val => {

          if (val == '1') {
            this.user_availablity = true
            this.helper.updateStatus(1)
          }
          else {
            this.user_availablity = false
            this.helper.updateStatus(0)
          }
        })

      }
      else {

        this.user_availablity = false
        this.helper.updateStatus(0)
      }
    });
    events.subscribe('clearTimout', () => {
      this.storage.remove('recievedNotificat')
      if (this.interval) {
        clearInterval(this.interval)
      }
      if (this.trackInterval) {
        clearInterval(this.trackInterval)
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
    });

    document.addEventListener('pause', () => {
      console.log("pause")
      this.helper.appInBackground = 1;
    });
    document.addEventListener('resume', () => {
      this.helper.appInBackground = 0;
    });
    this.trackDoctor()
  }
  // unBusyUser(){

  //   this.helper.updateBusy(0)
  //   this.busyUser = false;
  // }
  openReview() {

    this.navCtrl.push('PatientreviewPage', {
      patient_id: this.patient_id,
      orderId: this.currentOrderID
    })
  }
  cancelorder() {
    this.navCtrl.push('cancel-order', { orderId: this.currentOrderID });
  }
  changeAvailablity() {
    if (navigator.onLine) {
      if (this.helper.userAvailable == 1) {
        this.storage.get("user_avaial").then(val => {
          if (val == "0") {
            this.storage.get("user_login_token").then((val) => {
              this.loginservice.changeAvailability("1", val.access_token, (data) => {
                this.user_availablity = true
                //this.helper.updateBusy(0)
                this.storage.set("user_avaial", "1")
                this.helper.updateStatus(1)
                if (this.noOrder && this.helper.userAvailable == 1)
                  this.presentToast(this.translate.instant('connected'))
              }, (data) => {
                this.user_availablity = !this.user_availablity
                this.helper.presentToast(this.translate.instant("serverError"))
              })
            })
          }
          else {
            this.storage.get("user_login_token").then((val) => {
              this.loginservice.changeAvailability("0", val.access_token, (data) => {
                //this.helper.updateBusy(1)
                this.user_availablity = false
                this.helper.updateStatus(0)
                this.storage.set("user_avaial", "0")
                this.presentToast(this.translate.instant('disconnected'))
              }, (data) => {
                this.user_availablity = !this.user_availablity
                this.helper.presentToast(this.translate.instant("serverError"))
              })
            })
          }
        })

      }
    }
    else {
      this.helper.presentToast(this.translate.instant("serverError"))
    }
  }
  trackDoctor() {
    if (this.helper.userAvailable == 1) {
      this.storage.get("user_login_token").then((val) => {
        if (val) {
          console.log("track doctor")
          this.storage.get('type').then(type_val => {
            if (type_val == 0) {
              this.helper.geoLoc(data => this.getCurrentLoc(data));
            }
          })
          this.loginservice.getCountOfNotifications(val.access_token,
            resp => {
              if (resp.success == true) {
                this.events.publish('lengthdata', resp.count)
                if (resp.user_status != "1") {
                  this.helper.presentToast("يجب عليك تسجيل الدخول لأستخدام التطبيق")
                  this.events.publish('user:userLogedout')
                }
              }
            }, err => {
            }
          );
        }
      })
      this.storage.get('type').then(type_val => {
        if (type_val == 0) {
          this.interval = setInterval(() => {
            this.storage.get("user_login_token").then((val) => {
              if (val) {
                console.log("track doctor")
                this.helper.geoLoc(data => this.getCurrentLoc(data));
              }
            })
          }, 300000)
        }
      })
      this.trackInterval = setInterval(() => {
        //if (this.appInBackground == 1) {
        this.storage.get("user_login_token").then((val) => {
          if (val) {
            this.loginservice.getCountOfNotifications(val.access_token,
              resp => {
                if (resp.success == true) {
                  this.events.publish('lengthdata', resp.count)
                  if (resp.user_status != "1") {
                    this.helper.presentToast("يجب عليك تسجيل الدخول لأستخدام التطبيق")
                    this.events.publish('user:userLogedout')
                  }
                }
              }, err => {
              }
            );
          }
        })
        //}
      }, 20000)
    }
  }

  getCurrentLoc(loc) {

    //console.log("witting loc " + JSON.stringify(loc))
    if (loc == "-1") {
      //this.presentToast(this.translate.instant("locFailed"))
    }
    else {
      this.DoctorLat = loc.inspectorLat;
      this.DoctorLong = loc.inspectorLong;
      this.helper.updateUserLoc(loc.inspectorLat + ',' + loc.inspectorLong)

    }
  }
  reorder() {
    this.navCtrl.push('RetimePage', { orderID: this.currentOrderID })
  }
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  ionViewWillLeave() {
    console.log("cleared")
    clearInterval(this.interval)
    clearTimeout(this.timer)
  }
  loadMore(infiniteScroll) {
    setTimeout(() => {
      infiniteScroll.complete()
      if (this.page > 0) {
        this.page++;
        this.storage.get("user_login_token").then((val) => {
          this.loginservice.getUserOrders(val.access_token, this.page, this.helper.currentLang, 0).subscribe(
            resp => {
              let currentOrders = JSON.parse(JSON.stringify(resp)).orders;

              if (currentOrders.length > 0) {
                for (let i = 0; i < currentOrders.length; i++) {

                  if (currentOrders[i].patient.extraInfo.address == "" || currentOrders[i].patient.extraInfo.address == "--") {
                    currentOrders[i].patient.extraInfo.address = currentOrders[i].patient.extraInfo.address_map
                  }
                  this.currentOrders.push(currentOrders[i])
                }
              }
              else {
                this.page = -1
                infiniteScroll.enable(false)
                this.helper.presentToast(this.translate.instant('noMoreData'))
              }
            },
            err => {
              this.helper.presentToast(this.translate.instant('serverError'))
            }
          );
        })
      }
      else {
        this.helper.presentToast(this.translate.instant('noMoreData'))
      }
    }, 500);
  }
  getUserData() {
    if (navigator.onLine) {
      this.storage.get("user_login_token").then((val) => {
        this.loginservice.getUserData(val.access_token, (data) => this.getUserDataSuccessCallback(data), (data) => this.getUserDataFailureCallback(data))
      })
    }
  }
  getUserDataSuccessCallback(data) {
    data = JSON.parse(data)
    this.storage.set('user_login_info', data).then(() => {
      this.storage.get("user_login_info").then((val) => {

        if (val != null) {
          this.storage.get('type').then(type_val => {
            if (type_val == 0) {
              this.userName = val.nickname
              this.userImageUrl = val.profile_pic
              this.userAddress = val.doctor.address
              this.ratingStatus = val.rate
              if (this.ratingStatus == 0) {
                this.ratingStatus = 5
              }
            }
            else {
              this.userName = val.name
              this.userImageUrl = val.profile_pic
              this.userAddress = val.entity.address
              this.ratingStatus = val.rate
              if (this.ratingStatus == 0) {
                this.ratingStatus = 5
              }
            }
          })
        }
      })
    })
  }
  getUserDataFailureCallback(data) {
  }
  ionViewDidLoad() {
    this.storage.get("user_login_info").then(val => {
      this.helper.userId = val.id
      console.log("firebase " + firebase)

    })
    this.storage.get("type").then(val => {
      this.helper.userType = val
      console.log("firebase " + firebase)

    })
    this.storage.get("user_login_info").then((val) => {

      if (val != null) {
        this.storage.get('type').then(type_val => {
          if (type_val == 0) {
            this.userName = val.nickname
            this.userImageUrl = val.profile_pic
            this.userAddress = val.doctor.address
            this.ratingStatus = val.rate
            if (this.ratingStatus == 0) {
              this.ratingStatus = 5
            }
          }
          else {
            this.userName = val.name
            this.userImageUrl = val.profile_pic
            this.userAddress = val.entity.address
            this.ratingStatus = val.rate
            if (this.ratingStatus == 0) {
              this.ratingStatus = 5
            }
          }
        })



      }

    })

  }
  openOrder(order_id, Patient_id) {
    // this.storage.set("recievedNotificat", order_id).then(() => {
    //    this.storage.set("patient_id", Patient_id).then(() => {
    this.storage.get('type').then(val => {
      if (val == 1) {
        this.navCtrl.push(PharmacyOrderPage, { recievedNotificat: order_id })
      }
      else if (val == 2) {
        this.navCtrl.push(CenterOrderPage, { recievedNotificat: order_id })
      }
      else if (val == 3) {
        this.navCtrl.push(CenterOrderPage, { recievedNotificat: order_id })
      }
      else if (val == 0) {
        this.navCtrl.push(NeworderPage, { recievedNotificat: order_id })
      }
    })
    //  })
    //  })
  }
  getCurrentOrders() {
    this.storage.get("user_login_token").then((val) => {
      this.loginservice.getUserOrders(val.access_token, 0, this.helper.currentLang, 0).subscribe(
        resp => {
          this.currentOrders = []
          this.currentOrders = JSON.parse(JSON.stringify(resp)).orders;
          if (this.currentOrders.length > 0) {
            this.noOrder = false
            for (let i = 0; i < this.currentOrders.length; i++) {
              if (this.currentOrders[i].patient.extraInfo.address == "" || this.currentOrders[i].patient.extraInfo.address == "--") {
                this.currentOrders[i].patient.extraInfo.address = this.currentOrders[i].patient.extraInfo.address_map
              }
            }
            if (this.helper.userType == 0) {
              this.helper.updateBusy(1)
            }

          }
          else {
            this.noOrder = true
            if (this.helper.userType == 0) {
              this.helper.updateBusy(0)
            }
          }
        },
        err => {
          this.helper.presentToast(this.translate.instant('serverError'))
        }
      );
    })
  }
  doRefresh(ev) {
    ev.complete();
    this.ionViewDidEnter()
  }
  ionViewDidEnter() {
    this.storage.get('type').then(val => {
      this.helper.userType = val
    })
    this.noOrder = true
    this.getUserData()
    this.page = 1
    this.currentOrders = []
    this.getCurrentOrders()
    this.helper.intializeFirebase();
    //if(localStorage.getItem("regChanged") == "1"){
    console.log("reggg " + this.helper.registration)
    this.loginservice.registerFirebase(this.helper.registration, "")
    //}
    // console.log("DidEnter")
    // if(this.helper.userType != 0){
    //   this.storage.get("openReview").then(val => {
    //   if (val == 1) {
    //     this.openReview()
    //   }
    // })
    // }

    this.storage.get("user_avaial").then(val => {
      if (val) {
        //this.user_availablity = val
        if (val == "0") {
          this.presentToast(this.translate.instant('disconnected'))
          this.user_availablity = false
          this.helper.updateStatus(0)
        }
        else {
          if (this.noOrder && this.helper.userAvailable == 1) {
            this.user_availablity = true
            this.presentToast(this.translate.instant('connected'))
            this.helper.updateStatus(1)
          }

        }
      }
    })
    this.storage.get("user_login_info").then((val) => {

      if (val != null) {
        this.storage.get('type').then(type_val => {
          if (type_val == 0) {
            this.userName = val.nickname
            this.userImageUrl = val.profile_pic
            this.userAddress = val.doctor.address
            this.ratingStatus = val.rate
            if (this.ratingStatus == 0) {
              this.ratingStatus = 5
            }
          }
          else {
            this.userName = val.name
            this.userImageUrl = val.profile_pic
            this.userAddress = val.entity.address
            this.ratingStatus = val.rate
            if (this.ratingStatus == 0) {
              this.ratingStatus = 5
            }
          }
        })
      }
    })



  }
  callPatient() {
    window.open('tel:00' + this.patient_tel)
  }
  whatsAppPatient() {
    window.open("https://api.whatsapp.com/send?phone=" + this.patient_tel)
  }
}
