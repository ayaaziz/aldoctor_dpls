import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { TabsPage } from '../tabs/tabs';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the NeworderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-neworder',
  templateUrl: 'neworder.html',
  providers: [LaunchNavigator]
})
export class NeworderPage {
  ratingStatus = 4
  orderAccepted = false;
  userName = ""
  userImageUrl = ""
  userAddress = ""
  langDirection = ""
  arriveTime
  newOrder = false;
  noOrder = false;
  timeLeft: number = 120;
  remaining_time = 1
  interval;
  trackInterval;
  DoctorLat;
  DoctorLong;
  currentOrderID;
  patient_forfit
  coupon
  //appInBackground = 0
  moveToPatientStatus = true
  startDetectionStatus = true
  requestReturnStatus = true
  terminateStatus = true
  cancelOrder = true
  patient_lat;
  patient_long;
  patient_id;
  user_availablity = "0"
  patient_tel
  timer;
  busyUser = false
  busyStatus = 0
  audio: any;
  order_re_no;

  order_no
  showReview = false
  anotherOneAccepted = false
  constructor(public navCtrl: NavController, public navParams: NavParams, public loginservice: LoginServiceProvider
    , public helper: HelperProvider, public toastCtrl: ToastController, private alertCtrl: AlertController,
    public events: Events, private launchNavigator: LaunchNavigator,
    public translate: TranslateService, public storage: Storage) {
    this.langDirection = helper.lang_direction
    this.audio = new Audio();
    this.audio.src = 'assets/mp3/alarm_nice_sound.mp3';
    this.audio.load();
    this.currentOrderID = navParams.get("recievedNotificat")

    events.subscribe('user:userLoginSucceededHome', (userData) => {
      console.log("userLoginSucceeded: " + JSON.stringify(userData))
      this.userName = userData.nickname
      this.userImageUrl = userData.profile_pic
    });
    events.subscribe('clearTimout', (id) => {
      // this.storage.remove('recievedNotificat')
      if (this.interval) {
        clearInterval(this.interval)
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (this.audio) {
        this.stopAudio()
      }
      if (String(id) == String(this.currentOrderID)) {
        navCtrl.pop()
      }
    });
    events.subscribe('user:busy', (busy) => {
      console.log("userStatusbusy: " + JSON.stringify(busy))
      if (busy == 1) {
        this.busyUser = busy == 1 ? true : false
        this.busyStatus = busy
      }
    });
  }
  // 
  ionViewDidLoad() {
    console.log('ionViewDidLoad NeworderPage');
    this.orderAccepted = false;
    this.newOrder = false;
    this.noOrder = true;
    console.log('ionViewDidLoad NotificationPage');
    //alert("here")
    this.storage.get("user_login_info").then((val) => {
      if (val != null) {
        this.userName = val.nickname
        this.userImageUrl = val.profile_pic
        this.userAddress = val.doctor.address
        this.ratingStatus = val.rate
      }
    })
  }
  startTimer() {
    this.timeLeft = Math.round(this.remaining_time)
    this.playAudio();
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 120;
        this.stopAudio();
      }
    }, 1000)
    this.timer = setTimeout(() => {

      //alert("recieved 1")
      //if (this.helper.notification_order_id) {
      // this.orderUpdateStatus(3);
      this.orderAccepted = false
      this.newOrder = false;
      this.noOrder = true
      this.stopAudio();
      this.navCtrl.pop()
      clearInterval(this.interval)
      //}

    }, this.timeLeft * 1000);
  }
  orderUpdateStatus(status) {
    this.stopAudio()
    // if (status == 2 || status == 10) {
    //   if (String(this.helper.userBusy) == "1") {
    //     alert("لا يمكنك استقبال المزيد من الطلبات حتى يتم انهاء الطلب الحالي")
    //     this.navCtrl.pop()
    //   }
    // }
    if (this.helper.userAvailable == 1) {
      clearInterval(this.interval)
      clearTimeout(this.timer)
      if (status == "6") {
        //this.storage.set("reOrderOpened", 1)
        this.navCtrl.push('RetimePage', { orderID: this.currentOrderID, patient_id: this.patient_id })
      }
      else if (status == "10" || status == "11") {
        // if (this.helper.listenOrderStatus != "0") {
        this.navCtrl.push('cancel-order', { orderId: this.currentOrderID, status: status });
        // }
        // else {
        //   this.helper.presentToast(this.translate.instant("orderAcceptedByDR"))
        //   this.navCtrl.pop()
        // }

      }
      else {
        if (navigator.onLine) {
          this.storage.get("user_login_token").then((val) => {
            // alert("here")
            this.loginservice.updateCurrentOrder(this.currentOrderID, status, this.helper.userType, val.access_token, (data) => {
             
               if(data.status == -2){
                 this.helper.presentToast("لا يمكنك إستقبال المزيد من الطلبات حتى يتم إنهاء الطلب الحالي")
                 this.navCtrl.pop()
               }
             
             else if (data.success == true) {
                if (data.order.service_profile_id) {
                  if (data.order.service_profile_id != this.helper.userId) {
                    //  this.storage.remove("recievedNotificat")
                    ////  this.storage.remove("orderID").then(() => {
                    //  })
                    this.helper.presentToast(this.translate.instant("orderAcceptedByCenter"))
                    this.helper.updateBusy(0)
                    this.orderAccepted = false
                    this.newOrder = false;
                    this.noOrder = true
                    setTimeout(() => {
                      this.navCtrl.pop()
                    }, 3000);
                    //return;
                  }
                }
                //this.helper.listenOrder(data.order.id)
                //this.helper.updateOrderStatus(data.order.status, data.order.id)
                if (data.order.status == "0" || data.order.status == "3" || data.order.status == "10") {
                  //  this.storage.remove("orderID")
                  //  this.storage.remove("recievedNotificat")
                  this.helper.updateBusy(0)
                  this.stopAudio()
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  this.navCtrl.pop()
                }
                if (data.order.status == "6") {
                  // if(data.order.rated == 0){
                  // this.openReview();
                  // }
                  // else{
                  //  this.navCtrl.pop()
                  // }
                }
                if (data.order.status == "1") {
                  this.helper.updateBusy(1)
                  this.orderAccepted = true
                  this.newOrder = false;
                  this.noOrder = false
                  this.moveToPatientStatus = false
                  this.startDetectionStatus = true
                  this.requestReturnStatus = true
                  this.terminateStatus = true
                  this.cancelOrder = false
                }
                else if (data.order.status == "6") {
                  this.helper.updateBusy(0)
                  if (data.order.rated == 0) {
                    this.openReview();
                  }
                  else {
                    this.navCtrl.pop()
                  }
                }
                else if (data.order.status == "8") {
                  this.helper.updateBusy(1)
                  this.moveToPatientStatus = true
                  this.startDetectionStatus = false
                  this.requestReturnStatus = true
                  this.terminateStatus = true
                  this.cancelOrder = true
                  if (this.patient_lat && this.patient_long) {
                    this.launchNavigator.navigate([this.patient_lat, this.patient_long])
                      .then(
                        success => console.log('Launched navigator'),
                        error => console.log('Error launching navigator', error)
                      );
                  }
                }
                else if (data.order.status == "4") {
                  this.helper.presentToast(this.translate.instant('patientCanceledOrder'))
                  //  this.storage.remove("recievedNotificat")
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
  
                  this.events.publish('clearTimout', this.currentOrderID)
  
                }
                else if (data.order.status == "7") {
                  this.helper.updateBusy(1)
                  this.moveToPatientStatus = true
                  this.startDetectionStatus = true
                  this.requestReturnStatus = false
                  this.terminateStatus = false
                  this.cancelOrder = true
                }
                else if (data.order.status == "2") {
                  //this.helper.updateServiceProfile(this.currentOrderID)
                  // this.storage.remove("recievedNotificat")
                  this.helper.updateBusy(1)
                  this.orderAccepted = true
                  this.newOrder = false;
                  this.noOrder = false
                  this.moveToPatientStatus = false
                  this.startDetectionStatus = true
                  this.requestReturnStatus = true
                  this.terminateStatus = true
                  this.cancelOrder = false
                }
                else if (data.order.status == "5") {
                  //  this.storage.remove("recievedNotificat")
                  this.helper.updateBusy(0)
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true;
                  // this.navCtrl.pop().then(()=>{})
                  this.navCtrl.push('PatientreviewPage', {
                    patient_id: this.patient_id,
                    orderId: this.currentOrderID
                  })
                  // this.storage.set("patient_id",data.order.patient_id).then(()=>{
                  //   this.storage.set("orderID",data.order.id).then(()=>{
                  // this.navCtrl.pop().then(()=>{
                  //   this.openReview();
                  // })
                  //   })
                  // })
                }
                else if (data.order.status == "3") {
                  //  this.storage.remove("recievedNotificat")
                  this.helper.updateBusy(0)
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  this.navCtrl.pop()
                }
                else if (data.order.status == "0") {
                  //  this.storage.remove("recievedNotificat")
                  this.helper.updateBusy(0)
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  this.navCtrl.pop()
                }
                else {
                  //  this.storage.remove("recievedNotificat")
                  this.helper.updateBusy(0)
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  this.navCtrl.pop()
                }
              }
              else {
                if (data.status = -1) {
                  // this.helper.presentToast(this.translate.instant("orderAcceptedByDR"))
                  //  this.storage.remove("recievedNotificat")
                  this.helper.updateBusy(0)
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  if (data.order.service_profile_id) {
                    if (data.order.service_profile_id != this.helper.userId) {
                      //  this.storage.remove("recievedNotificat")
                      ////  this.storage.remove("orderID").then(() => {
                      //  })
                      this.helper.presentToast(this.translate.instant("orderAcceptedByCenter"))
                      this.helper.updateBusy(0)
                      this.orderAccepted = false
                      this.newOrder = false;
                      this.noOrder = true
                      setTimeout(() => {
                        this.navCtrl.pop()
                      }, 3000);
                      //return;
                    }
                  }
                }
              }
              //this.newOrder = false;
            }, (data) => {
              this.helper.presentToast(this.translate.instant("serverError"))
            })
          })
        }
        else {
          this.helper.presentToast(this.translate.instant("serverError"))
        }
      }
    }
    else {
      this.helper.presentToast(this.translate.instant("serverError"))
      this.navCtrl.pop()
    }
  }
  openReview() {

    this.navCtrl.push('PatientreviewPage', {
      patient_id: this.patient_id,
      orderId: this.currentOrderID
    })
  }
  doRefresh(ev) {
    ev.complete();
    if (this.interval) {
      clearInterval(this.interval)
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
    if (this.audio) {
      this.stopAudio()
    }
    this.ionViewDidEnter(1)
  }
  ionViewDidLeave(){
    this.stopAudio()
    clearInterval(this.interval)
  }
  ionViewDidEnter(refresh?) {
    if (localStorage.getItem("lastCanceled") == this.currentOrderID) {
      this.navCtrl.pop()
    }
    if (refresh) {
      this.noOrder = false
      this.newOrder = false;
      this.orderAccepted = false;
    }
    else {
      this.noOrder = true
      this.newOrder = false;
      this.orderAccepted = false;
    }
    this.storage.get("user_login_info").then((val) => {
      if (val != null) {
        this.userName = val.nickname
        this.userImageUrl = val.profile_pic
        this.userAddress = val.doctor.address
        this.ratingStatus = val.rate
      }
    })
    //this.helper.intializeFirebase();
    console.log("DidEnter")
    this.storage.get("user_avaial").then(val => {
      if (val) {
        this.user_availablity = val

      }
    })
    if (navigator.onLine) {
      // this.storage.get("recievedNotificat").then(val => {
      // if (val) {
      //alert("1 "+ val)
      this.helper.notification_order_id = this.currentOrderID
      this.currentOrderID = this.currentOrderID
      this.storage.get("user_login_token").then((val) => {
        if (this.helper.userAvailable == 1) {
          this.loginservice.getCurrentOrder(this.currentOrderID, val.access_token, (data) => {
            // alert("1 "+ typeof(data.order.status))
            if (data.success == true) {
              if (data.order.service_profile_id) {
                if (data.order.service_profile_id != this.helper.userId) {
                  //  this.storage.remove("recievedNotificat")
                  ////  this.storage.remove("orderID").then(() => {
                  //  })
                  this.anotherOneAccepted = true
                  this.helper.presentToast(this.translate.instant("orderAcceptedByCenter"))
                  this.helper.updateBusy(0)
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  setTimeout(() => {
                    this.navCtrl.pop()
                  }, 3000);
                  //return;
                }
              }

              //this.helper.updateOrderStatus(data.order.status, data.order.id)
              let patient_loc = String(data.order.extra).split(',')
              this.userImageUrl = data.order.patientProfile.profile_pic
              this.userName = data.order.patientProfile.name
              if(data.order.patient_address){
                this.userAddress = data.order.patient_address
              }
              else if(data.order.patientProfile.extraInfo.address != "" && data.order.patientProfile.extraInfo.address != "--"){
                this.userAddress = data.order.patientProfile.extraInfo.address
                }
                else
                {
                  this.userAddress = data.order.patientProfile.extraInfo.address_map
                }
              this.patient_forfit = data.order.patientProfile.forfiet
              this.coupon = data.order.coupon
              this.ratingStatus = data.order.patientProfile.rate
              this.order_no = data.order.id
              if(data.order.reorder_id != 0){
                this.order_re_no = data.order.reorder_id
              }
              this.patient_lat = patient_loc[0]
              this.patient_long = patient_loc[1]
              let created_time = data.order.created_at

              var t1 = new Date(String(data.currentdate.date).replace(' ','T'));
              var t2 = new Date(String(created_time).replace(' ','T'));
              var dif = t1.getTime() - t2.getTime();
              var Seconds_from_T1_to_T2 = (dif / 1000)
              let time_left = 180 - Seconds_from_T1_to_T2
              console.log('Seconds_from_T1_to_T2 ' + Seconds_from_T1_to_T2 + " t1 " + t1 + " t2 " + t2)
              this.remaining_time = time_left

              if (this.helper.inspectorLat != 0.0 && this.helper.inspectorLong != 0.0) {
                
                /*change time  */
                this.storage.get("user_login_token").then((val) => {
                this.loginservice.getTime(val.access_token,this.helper.inspectorLat, this.helper.inspectorLong, this.patient_lat, this.patient_long, (data) => {
                  this.arriveTime = data
                },
                  (data) => { })

              });
              

              }
              this.patient_tel = data.order.patientProfile.phone
              this.patient_id = data.order.patient_id
              this.storage.set("patient_id", data.order.patient_id)
              this.storage.set("orderID", data.order.id)
              //let order_stat = String(data.order.status)
             // console.log(order_stat + " tet 12 = " + typeof (order_stat))
              // this.helper.listenOrder(data.order.id)
              // if (order_stat == "0") {
              //   this.startTimer();
              //   this.noOrder = false
              //   this.newOrder = true;
              //   this.orderAccepted = false;
              //   this.helper.updateBusy(0)
              // }
              // else 
              if (data.order.status == "0" || (data.order.status == "10" && !data.order.service_profile_id)) {
               // alert(time_left)
                if (time_left <= 0) {
                  this.orderUpdateStatus(3)
                  this.helper.presentToast(this.translate.instant('orderTimeOut'))
                  this.navCtrl.pop()
                  //return;
                }
                else{
                  
                this.startTimer();
                this.noOrder = false
                this.newOrder = true;
                this.orderAccepted = false;
                this.helper.updateBusy(0)
                }
              }
              else if (data.order.status == "1") {

                this.orderAccepted = true
                this.newOrder = false;
                this.noOrder = false
                this.moveToPatientStatus = false
                this.startDetectionStatus = true
                this.requestReturnStatus = true
                this.terminateStatus = true
                this.cancelOrder = false
                this.helper.updateBusy(1)
              }
              else if (data.order.status == "6") {

                this.helper.updateBusy(0)
                this.storage.get("user_login_info").then((val) => {
                  if (val != null) {
                    this.userName = val.nickname
                    this.userImageUrl = val.profile_pic
                    this.userAddress = val.doctor.address
                    this.ratingStatus = val.rate
                  }
                })
                this.requestReturnStatus = true
                if (data.order.rated == 0) {
                  this.presentConfirm()
                }
                else {
                  this.navCtrl.pop()
                }

              }
              else if (data.order.status == "8") {
                this.helper.updateBusy(1)
                this.orderAccepted = true
                this.newOrder = false;
                this.noOrder = false
                this.moveToPatientStatus = true
                this.startDetectionStatus = false
                this.requestReturnStatus = true
                this.terminateStatus = true
                this.cancelOrder = true
              }
              else if (data.order.status == "7") {
                this.helper.updateBusy(1)
                this.orderAccepted = true
                this.newOrder = false;
                this.noOrder = false
                this.moveToPatientStatus = true
                this.startDetectionStatus = true
                this.requestReturnStatus = false
                this.terminateStatus = false
                this.cancelOrder = true
              }
              else if (data.order.status == "2") {
                //this.helper.updateServiceProfile(this.currentOrderID)
                this.helper.updateBusy(1)
                //this.storage.remove("recievedNotificat")
                this.orderAccepted = true
                this.newOrder = false;
                this.noOrder = false
                this.moveToPatientStatus = false
                this.startDetectionStatus = true
                this.requestReturnStatus = true
                this.terminateStatus = true
                this.cancelOrder = false
              }
              else if (data.order.status == "5") {
                //  this.storage.remove("recievedNotificat")
                this.helper.updateBusy(0)
                this.orderAccepted = false
                this.newOrder = false;
                this.noOrder = true;
                // this.navCtrl.push('PatientreviewPage', {
                //   patient_id: this.patient_id,
                //   orderId: this.currentOrderID
                // })
                if (data.order.rated == 0) {
                  this.presentConfirm()
                }
                else {
                  this.navCtrl.pop()
                }

              }
              else if (data.order.status == "3") {
                //  this.storage.remove("recievedNotificat")
                this.helper.updateBusy(0)
                this.orderAccepted = false
                this.newOrder = false;
                this.noOrder = true
                this.navCtrl.pop()
              }
              else if (data.order.status == "4") {
                this.helper.presentToast(this.translate.instant('patientCanceledOrder'))
                //  this.storage.remove("recievedNotificat")
                this.helper.updateBusy(0)
                this.orderAccepted = false
                this.newOrder = false;
                this.noOrder = true
                // setTimeout(() => {
                this.events.publish('clearTimout', this.currentOrderID)
                //}, 500);
              }
              else {
                //alert("here")
                //  this.storage.remove("recievedNotificat")
                this.helper.updateBusy(0)
                this.orderAccepted = false
                this.newOrder = false;
                this.noOrder = true
                // this.navCtrl.pop()
              }

            }
          }, (data) => {
            this.noOrder = true
            this.newOrder = false;
            this.orderAccepted = false;
            this.navCtrl.pop()
          })
        }
        else {
          this.helper.presentToast(this.translate.instant("serverError"))
          this.navCtrl.pop()
        }
      })
      //   }
      // })
    }
    else {
      this.helper.presentToast(this.translate.instant("serverError"))
      this.noOrder = true
      this.newOrder = false;
      this.orderAccepted = false;
      this.storage.get("user_login_info").then((val) => {
        if (val != null) {
          this.userName = val.nickname
          this.userImageUrl = val.profile_pic
          this.userAddress = val.doctor.address
          this.ratingStatus = val.rate
        }
      })
    }
  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'تقييم الطلب',
      message: 'لقد تم إنهاء الطلب، يمكنك تقييم الطلب الآن',
      buttons: [
        {
          text: 'رجوع',
          handler: () => {
            console.log('Cancel clicked');
            this.navCtrl.pop()
          }
        },
        {
          text: 'تقييم الطلب',
          handler: () => {
            this.navCtrl.push('PatientreviewPage', {
              patient_id: this.patient_id,
              orderId: this.currentOrderID
            })
          }
        }
      ]
    });
    alert.present();
  }
  callPatient() {
    window.open('tel:00' + this.patient_tel)
  }
  whatsAppPatient() {
    window.open("whatsapp://send?phone=" + this.patient_tel, "_system", "location=yes")
  }
  playAudio() {
    if(this.audio){
      this.audio.play();
    this.audio.loop = true;
    }
    
  }

  stopAudio() {
    this.audio.pause();
  }
  closeOrder() {
    this.navCtrl.pop()
  }
  ngOnDestroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }

}
