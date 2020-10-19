import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, Platform } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { TabsPage } from '../tabs/tabs';
import { DatePicker } from '@ionic-native/date-picker';
import { AlertController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { ContactPage } from '../contact/contact';


/**
 * Generated class for the NursingOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nursing-order',
  templateUrl: 'nursing-order.html',
  providers: [LaunchNavigator, DatePicker, Device]
})
export class NursingOrderPage {

  ratingStatus = 4
  orderAccepted = false;
  userName = ""
  userImageUrl = ""
  userAddress = ""
  lang_direction = ""
  arriveTime = "..."
  patient_forfit = 0
  newOrder = false;
  noOrder = false;
  timeLeft: number = 45;
  remaining_time = 1
  interval;
  trackInterval;
  DoctorLat;
  DoctorLong;
  currentOrderID;
  appointmentNotesModel = ""

  patient_lat;
  patient_long;
  patient_id;
  user_availablity = "0"
  patient_tel
  timer;
  newAppointment = true;

  appointement = false
  type
  appointementDate
  files = []
  disablePrescription = true
  audio: any;
  server_url
  moveToPatientStatus = false
  cancelDetectionStatus = false
  endDetectionStatus = false
  patientApproved = false

  minDate
  maxDate
  order_type = ""
  order_date = ""
  order_remark = ""
  order_no
  showReview = false
  appointementDateFormated
  order_canceled = 0
  anotherOneAccepted = false
  androidIS42 = 0
  maxYear


  myDate;
  // myTime="15:07"
  myTime
  
  // myTime = new Date().getHours() + ":"+new Date().getMinutes()
  mystartdate
  date



  thanksAlert = true;
  opacityOfAllContent = 1;
  LE
  PT
  shareStatus  = false
contactStatus = false

customPickerOptions:any;
customPickerOptionsHours:any;

status;
startDetectionStatus:boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, public loginservice: LoginServiceProvider, private alertCtrl: AlertController
    , public helper: HelperProvider, public toastCtrl: ToastController, private datePicker: DatePicker, public plt: Platform, public device: Device,
    public events: Events, private launchNavigator: LaunchNavigator, public translate: TranslateService, public storage: Storage) {
 
 
 
      this.date=new Date().toISOString();
      console.log("date : ",this.date)
      this.myTime = new Date().getHours() + ":"+new Date().getMinutes()
      console.log("myTime : ",this.myTime)



    this.lang_direction = helper.lang_direction
    let x = new Date()
    this.maxYear = x.getFullYear()+ 1
    let d = x.getFullYear() + '-' + (x.getMonth() + 1) + '-' + (x.getDate() + 1) + " 00:00:00.000z"
    let v = (x.getFullYear() + 1) + '-' + (x.getMonth() + 1) + '-' + (x.getDate() + 1) + " 00:00:00.000z"

    this.minDate = new Date().toISOString()
    this.maxDate = new Date().toISOString()
    this.server_url = helper.serviceUrl
    this.audio = new Audio();
    this.audio.src = 'assets/mp3/alarm_nice_sound.mp3';
    this.audio.load();
    this.currentOrderID = navParams.get("recievedNotificat")


    plt.ready().then(()=> {
      let androidVer = device.version
      
      if( androidVer == '4.4.2' || androidVer == '4.4.4') {
        this.androidIS42 = 1
      }
   })
    storage.get('type').then(val => {
      if (val == 2) {
        //ashe3a
        this.type = 2
      }
      else if (val == 3) {
        this.type = 3
      }
      else if (val == 0) {
        this.type = 0
      }
      else if (val == 1) {
        this.type = 1
      }else if (val == 5) {
        this.type = 5
      }
    })


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

     //ayaaaaaaaaaaaaaaaaa
     this.customPickerOptions = {
      buttons: [{
        text: 'يوم',
        handler: () => {
          return false;
        }      
      }, {
        text: 'شهر',
        handler: () => {
          return false;
        }
      },{
        text: 'سنة',
        handler: () => {
          return false;
        }
      }]
    }

    this.customPickerOptionsHours = {
      buttons: [{
        text: 'ساعة',
        handler: () => {
          return false;
        }      
      }, {
        text: 'دقيقة',
        handler: () => {
          return false;
        }
      },{
        text: 'صباحاً/مساءًا',
        handler: () => {
          return false;
        }
      }]
    }
    }

    openAppointment() {
      this.appointement = true
    }
    chooseDate() {
  
      var minmDate;
      var maxDate;
      let userLang = this.helper.currentLang;
      // let x = new Date()
      // let d = x.getFullYear() + '-' + (x.getMonth() + 1) + '-' + (x.geminDatetDate()) + " 00:00:00.000z"
      // let v = (x.getFullYear() + 1) + '-' + (x.getMonth() + 1) + '-' + (x.getDate() + 1) + "T00:00:00.000z"
      // if (this.plt.is('ios')) {
      //   minmDate = new Date().toISOString()
      //   //maxDate = new Date(v).toISOString()
      // }
      // else {
        minmDate = new Date().valueOf()
        //maxDate = new Date(v).valueOf()
      //}
      let localLang = 'en_us';
      let nowTxt = 'Today';
      let okTxt = 'Done';
      let cancelTxt = 'Cancel';
      if (userLang == 'ar') {
        // localLang = 'ar_eg';
        nowTxt = 'اليوم';
        okTxt = 'تم';
        cancelTxt = 'إلغاء'
      }
  console.log("new Date() : ,",new Date())
  console.log("new Date() local ar : ",new Date().toLocaleString('ar'));
  
  
      this.datePicker.show({
        date: new Date(),
        mode: 'datetime',
        minDate: minmDate,
        okText: okTxt,
        cancelText: cancelTxt,
        todayText: nowTxt,
        locale: 'en_us',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
      }).then(
        date => {
       alert("choose date ,, datetime picker  "+date)
          if(!date){
            return
          }
          if(new Date().valueOf() > new Date(date).valueOf()){
            this.helper.presentToast("من فضلك أختر تاريخ ووقت أكبر من التاريخ والوقت الحالي")
            return;
          }
          let hourDesc = ""
          let hours =new Date(date).getHours()
          if (hours >= 12) {
            hours -= 12;
            if(hours == 0)
            hours = 12;
            hourDesc = "مساءاً"
          } else if (hours === 0) {
            hours = 12;
            hourDesc = "صباحاً"
          }
          else{
            hourDesc = "صباحاً"
          }
          //alert(date + " " + typeof(date) + " test " + new Date(date).getFullYear())
          this.appointementDateFormated = new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getDate() + ' ' + hours + ':' + new Date(date).getMinutes() + " " + hourDesc
          this.appointementDate = new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getDate() + ' ' + new Date(date).getHours() + ':' + new Date(date).getMinutes()
       alert("this.appointementDate  : "+this.appointementDate)
       
        },
        err => {
          console.log('Error occurred while getting date: ', err);
  
        }
      );
    }
    ionViewDidLeave(){
      this.stopAudio()
      clearInterval(this.interval)
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NursingOrderPage');
    this.orderAccepted = false;
    this.newOrder = false;
    this.noOrder = true;

  }


  startTimer() {
    this.timeLeft = Math.round(this.remaining_time)
    this.playAudio();
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 45;
        this.stopAudio();
      }
    }, 1000)
    this.timer = setTimeout(() => {

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
  cancelAppointment() {
    this.appointement = false
    this.appointmentNotesModel = ""
    this.appointementDate = null
  }

  sendAppointment() {

    this.appointementDate = this.mystartdate + " "+ this.myTime ;

    console.log("this.mystartdate : ,",this.mystartdate)
    if (this.appointementDate.split(" ")[0] == "undefined"){
      if (this.type == 2) {
        this.helper.presentToast(this.translate.instant("enterAppointmentXrayData"))
      }
      else {
        this.helper.presentToast(this.translate.instant("enterAppointmentLabData"))
      }

      // this.helper.presentToast(this.translate.instant("enterAppointmentdoctorData"))       
      return
    }
    if(this.appointementDate == "undefined undefined"  )
    {
      if (this.type == 2) {
        this.helper.presentToast(this.translate.instant("enterAppointmentXrayData"))
      }
      else {
        this.helper.presentToast(this.translate.instant("enterAppointmentLabData"))
      }

      // this.helper.presentToast(this.translate.instant("enterAppointmentdoctorData"))       
      return
    }

    
    var current2=Date.parse(new Date().toString());
    console.log("current : ",current2)
    var JobStartTime=Date.parse(this.appointementDate);
    console.log("JobStartTime : ",JobStartTime)
    if(current2 > JobStartTime){
      console.log("current2 > started")
      this.helper.presentToast("من فضلك أختر تاريخ ووقت أكبر من التاريخ والوقت الحالي")
      return
    }

    if (this.appointementDate) {
      if (navigator.onLine) {
        this.storage.get("user_login_token").then((val) => {
          let d = new Date(this.appointementDate).getFullYear() + '-' + (new Date(this.appointementDate).getMonth() + 1) + '-' + new Date(this.appointementDate).getDate() + ' ' + new Date(this.appointementDate).getUTCHours() + ':' + new Date(this.appointementDate).getMinutes()
          if(this.androidIS42 == 1){
            this.appointementDate = d
          }
          this.loginservice.setOrderDate(val.access_token, this.currentOrderID, this.appointementDate, this.appointmentNotesModel, this.helper.userType,
            (data) => {
              if (data.success == true) {
                this.helper.presentToast(this.translate.instant("appointementCreatedsuccess"))
                this.navCtrl.pop()
              }
              else {
                this.helper.presentToast(this.translate.instant("serverError"))
              }
            },
            (data) => {
              this.helper.presentToast(this.translate.instant("serverError"))
            })
        })
      }
      else {
        this.helper.presentToast(this.translate.instant("serverError"))
      }
    }
    else {
      if (this.type == 2) {
        this.helper.presentToast(this.translate.instant("enterAppointmentXrayData"))
      }
      else {
        this.helper.presentToast(this.translate.instant("enterAppointmentLabData"))
      }

    }
  }

  orderUpdateStatus(status) {
    this.stopAudio()
    if (this.helper.userAvailable == 1) {
      clearInterval(this.interval)
      clearTimeout(this.timer)
      if (status == "10" || status == "11") {
        this.navCtrl.push('cancel-order', { orderId: this.currentOrderID, status: status });
      }
      else {
        if (navigator.onLine) {
          this.storage.get("user_login_token").then((val) => {


            // if(status == 8 ){

  
            //   this.moveToPatientStatus = true
            //   this.cancelDetectionStatus = true
            //   this.shareStatus  = true
            //   this.contactStatus = true
            
            // this.thanksAlert = false;
            // this.opacityOfAllContent = 0.1;
            
            
            // }else{

            


            this.loginservice.updateCurrentOrder(this.currentOrderID, status, this.helper.userType,0, val.access_token, (data) => {
              if(data.status == -2){
                this.helper.presentToast("لا يمكنك استقبال المزيد من الطلبات حتى يتم إنهاء الطلبات الحالية")
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

                  }
                }
                this.endDetectionStatus = true
                //this.helper.listenOrder(data.order.id)
                //this.helper.updateOrderStatus(data.order.status, data.order.id)
                if (data.order.status == "0" || data.order.status == "3" || data.order.status == "6" || data.order.status == "10") {
                  // this.storage.remove("orderID")
                  //  this.storage.remove("recievedNotificat")
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  this.navCtrl.pop()
                }
                if (data.order.status == "1") {
                  this.orderAccepted = true
                  this.newOrder = false;
                  this.noOrder = false
                  this.moveToPatientStatus = false
                  this.cancelDetectionStatus = false
                  this.endDetectionStatus = true
                }
                else if (data.order.status == "12") {
                  this.orderAccepted = true
                  this.newOrder = false;
                  this.noOrder = false
                  this.newAppointment = false
                  this.endDetectionStatus = true
                  // this.moveToPatientStatus = true
                }
                else if (data.order.status == "4") {
                  this.helper.presentToast(this.translate.instant('patientCanceledOrder'))
                  //  this.storage.remove("recievedNotificat")
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
  
                  this.events.publish('clearTimout', this.currentOrderID)
  
                }
                else if (data.order.status == "13") {
                  this.orderAccepted = true
                  this.patientApproved = true
                  this.newOrder = false;
                  this.noOrder = false
                  this.newAppointment = false
                  this.endDetectionStatus = true
                  this.moveToPatientStatus = false
                }
                else if (data.order.status == "6") {
                }
                else if (data.order.status == "8") {
                  this.moveToPatientStatus = true
                  this.cancelDetectionStatus = true
                  this.endDetectionStatus = true;
                  this.newAppointment = false



//s


// this.thanksAlert = false;
// this.opacityOfAllContent = 0.1;


                  // if (this.patient_lat && this.patient_long) {
                  //   this.launchNavigator.navigate([this.patient_lat, this.patient_long])
                  //     .then(
                  //       success => console.log('Launched navigator'),
                  //       error => console.log('Error launching navigator', error)
                  //     );
                  // }
                }
                //ayaaaaaa
                else if (data.order.status == "7") {
                  this.helper.updateBusy(1)
                  this.moveToPatientStatus = true
                  this.startDetectionStatus = true
                  this.endDetectionStatus = false;
                  this.cancelDetectionStatus = true;
                }
                ////////////


                else if (data.order.status == "2") {
                  //this.helper.updateServiceProfile(this.currentOrderID)
                  this.orderAccepted = true
                  this.newOrder = false;
                  this.noOrder = false
                  this.moveToPatientStatus = false
                  this.cancelDetectionStatus = false
                  this.endDetectionStatus = true
                }
                else if (data.order.status == "5") {
                  //  this.storage.remove("recievedNotificat")
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true;
                  this.navCtrl.push('PatientreviewPage', {
                    patient_id: this.patient_id,
                    orderId: this.currentOrderID
                  })
                  // this.navCtrl.pop().then(() => {
                  //   this.openReview();
                  // })

                  //   })
                  // })
                }
                else if (data.order.status == "3") {
                  //  this.storage.remove("recievedNotificat")
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  this.navCtrl.pop()
                }
                else if (data.order.status == "0") {
                  // this.storage.remove("recievedNotificat")
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  this.navCtrl.pop()
                }
                else {
                  //  this.storage.remove("recievedNotificat")
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  this.navCtrl.pop()
                }
              }
              else {
                if (data.status = -1) {
                  // this.helper.presentToast(this.translate.instant("orderAcceptedByCenter"))
                  //  this.storage.remove("recievedNotificat")
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
                else {
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  this.navCtrl.pop()
                }
              }
            }, (data) => {
              this.helper.presentToast(this.translate.instant("serverError"))
            })
          // }

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
  shareLoc() {
    let urlDecoded = decodeURIComponent("http://maps.google.com/maps?q=loc:" + this.patient_lat + "," + this.patient_long)
    window.open("whatsapp://send?text=" + urlDecoded, "_system", "location=yes")

  }
  openPrescription() {
    if (this.files.length > 0) {
      this.navCtrl.push('ShowPrescriptionPage', { files: this.files })
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

    console.log("DidEnter")
    // this.storage.get("openReview").then(val => {
    //   if (val == 1) {
    //     this.openReview()
    //   }
    // })
    this.storage.get("user_avaial").then(val => {
      if (val) {
        this.user_availablity = val

      }
    })
    if (navigator.onLine) {
      //  this.storage.get("recievedNotificat").then(val => {
      //   if (val) {

      this.helper.notification_order_id = this.currentOrderID
      this.currentOrderID = this.currentOrderID
      this.storage.get("user_login_token").then((val) => {
        if (this.helper.userAvailable == 1) {

          this.loginservice.getCurrentOrder(this.currentOrderID, val.access_token, (data) => {

            this.endDetectionStatus = true
            if (data.success == true) {
              if (data.order.service_profile_id) {
                if (data.order.service_profile_id != this.helper.userId) {
                  //  this.storage.remove("recievedNotificat")
                  //  this.storage.remove("orderID").then(() => {
                  //  })
                  this.anotherOneAccepted = true
                  this.helper.presentToast(this.translate.instant("orderAcceptedByCenter"))
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
              this.files = data.order.files
              if (this.files.length > 0) {
                this.disablePrescription = false
              }
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
              this.ratingStatus = data.order.patientProfile.rate
              this.patient_forfit = data.order.patientProfile.forfiet
              this.patient_lat = patient_loc[0]
              this.patient_long = patient_loc[1]
              let created_time = data.order.created_at
              this.order_date = data.order.date ? data.order.date : ""
              this.order_remark = data.order.remark ? data.order.remark : ""
              this.order_no = data.order.id
              this.order_type = data.order.entity_service_Name ? data.order.entity_service_Name : ""
              var t1 = new Date(String(data.currentdate.date).replace(' ','T'));
              var t2 = new Date(String(created_time).replace(' ','T'));
              var dif = t1.getTime() - t2.getTime();
              var Seconds_from_T1_to_T2 = (dif / 1000)
              console.log('Seconds_from_T1_to_T2 ' + Seconds_from_T1_to_T2)
              let time_left
              if (this.files.length > 0) {
                time_left = 180 - Seconds_from_T1_to_T2
              }
              else {
                time_left = 180 - Seconds_from_T1_to_T2
              }
              console.log('Seconds_from_T1_to_T2 ' + Seconds_from_T1_to_T2 + " t1 " + t1 + " t2 " + t2)
              this.remaining_time = time_left

              // if (this.helper.inspectorLat != 0.0 && this.helper.inspectorLong != 0.0) {
              //   this.loginservice.getTime(this.helper.inspectorLat, this.helper.inspectorLong, this.patient_lat, this.patient_long, (data) => {
              //     this.arriveTime = data
              //   },
              //     (data) => { })
              // }
              this.patient_tel = data.order.patientProfile.phone
              this.patient_id = data.order.patient_id
              //  this.storage.set("patient_id", data.order.patient_id)
              //  this.storage.set("orderID", data.order.id)
              //let order_stat = String(data.order.status)
              //console.log(order_stat + " tet 12 = " + typeof (order_stat))
              //this.helper.listenOrder(data.order.id)
              // if (order_stat == "0") {
                
              //   this.noOrder = false
              //   this.newOrder = true;
              //   this.orderAccepted = false;
              // }
              // else 
              if (data.order.status == "0" || (data.order.status == "10" && !data.order.service_profile_id)) {
                if (localStorage.getItem("lastCanceled") != this.currentOrderID) {
                  this.startTimer();
                }
                if (this.files.length > 0) {
                  if (time_left <= 0) {
                    this.helper.presentToast(this.translate.instant('orderTimeOut'))
                    this.orderUpdateStatus(3)
                    this.navCtrl.pop()
                  }
                  else{
                    this.noOrder = false
                    this.newOrder = true;
                    this.orderAccepted = false;
                  }
                }
                else {
                  if (time_left <= 0) {
                    this.helper.presentToast(this.translate.instant('orderTimeOut'))
                    this.orderUpdateStatus(3)
                    this.navCtrl.pop()
                  }
                  else{
                    this.noOrder = false
                    this.newOrder = true;
                    this.orderAccepted = false;
                  }
                }
                
                
              }
              else if (data.order.status == "1") {

                this.orderAccepted = true
                this.newOrder = false;
                this.noOrder = false
                this.moveToPatientStatus = false
                this.cancelDetectionStatus = false
                this.endDetectionStatus = true
              }
              else if (data.order.status == "6") {
                this.navCtrl.pop()
              }
              else if (data.order.status == "8") {
                this.orderAccepted = true
                this.newOrder = false;
                this.noOrder = false
                this.moveToPatientStatus = true
                this.cancelDetectionStatus = true
                this.endDetectionStatus = true;
                this.newAppointment = false
              }
              else if (data.order.status == "7") {
                this.orderAccepted = true
                this.newOrder = false;
                this.noOrder = false

                // ayaaaaa
                this.moveToPatientStatus = true;
                this.cancelDetectionStatus = true;
                this.endDetectionStatus = false;
                this.newAppointment = false;
                this.startDetectionStatus = true;
                ///////

              }
              else if (data.order.status == "12") {
                this.orderAccepted = true
                this.newOrder = false;
                this.noOrder = false
                this.newAppointment = false
                this.endDetectionStatus = true
                // this.moveToPatientStatus = true
              }
              else if (data.order.status == "13") {
                this.orderAccepted = true
                this.patientApproved = true
                this.newOrder = false;
                this.noOrder = false
                this.newAppointment = false
                this.endDetectionStatus = true
                this.moveToPatientStatus = false
              }
              else if (data.order.status == "2") {
                //this.helper.updateServiceProfile(this.currentOrderID)
                //this.storage.remove("recievedNotificat")
                this.orderAccepted = true
                this.newOrder = false;
                this.noOrder = false
                this.moveToPatientStatus = false
                this.cancelDetectionStatus = false
                this.endDetectionStatus = true
              }
              else if (data.order.status == "5") {
                //  this.storage.remove("recievedNotificat")
                this.orderAccepted = false
                this.newOrder = false;
                this.noOrder = true;
                if (data.order.rated == 0) {
                  this.presentConfirm()
                }
                else {
                  this.navCtrl.pop()
                }
                // this.navCtrl.push('PatientreviewPage', {
                //   patient_id: this.patient_id,
                //   orderId: this.currentOrderID
                // }).then(()=>{
                //  this.navCtrl.pop()
                //})

                //   })
                // })

              }
              else if (data.order.status == "3") {
                //  this.storage.remove("recievedNotificat")
                this.orderAccepted = false
                this.newOrder = false;
                this.noOrder = true
                this.navCtrl.pop()
              }
              else if (data.order.status == "4") {
                this.helper.presentToast(this.translate.instant('patientCanceledOrder'))
                //  this.storage.remove("recievedNotificat")
                this.orderAccepted = false
                this.newOrder = false;
                this.noOrder = true

                this.events.publish('clearTimout', this.currentOrderID)

              }
              else {
                //  this.storage.remove("recievedNotificat")
                this.orderAccepted = false
                this.newOrder = false;
                this.noOrder = true
                //this.navCtrl.pop()
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
      //  }
      //  })
    }
    else {
      this.helper.presentToast(this.translate.instant("serverError"))
      this.noOrder = true
      this.newOrder = false;
      this.orderAccepted = false;
      this.navCtrl.pop()
    }
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
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'تقييم الطلب',
      message: 'لقد تم إنهاء الطلب، يمكنك تقييم الطلب الآن',
      buttons: [
        {
          text: 'رجوع',
          handler: () => {
            console.log('Cancel clicked');

            //ayaaaaaaa
            // this.navCtrl.pop();
            this.navCtrl.setRoot(ContactPage);
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





  change(datePicker){
    console.log("date",this.myDate);
    console.log("datePicker",datePicker);
   
    datePicker.open();
    
  }
  changeTime(){
    console.log("myDate : ",this.myDate)
    console.log("myTime : ",this.myTime)
    this.mystartdate = this.myDate;
    this.myDate = ""
  }


  closePopup(){
    this.thanksAlert = true;
    this.opacityOfAllContent = 1;
    this.newAppointment = false
    this.moveToPatientStatus = false
    this.cancelDetectionStatus = false
    this.shareStatus  = false
    this.contactStatus = false

  }
  sendPrice(){

    if(!this.LE) {
      this.helper.presentToast("الرجاء إدخال سعر التحاليل");
      return;
    } 

    if(!this.PT) {
      this.PT = "00";
    }

    let poundsArr = this.LE.split(".");
    let pTArr = this.PT.split(".");

    console.log("arrrrr: "+poundsArr);
    console.log("arrrrr2: "+pTArr);

    if(poundsArr.length > 1 || pTArr.length > 1) {
      this.helper.presentToast("الرجاء إدخال أرقام فقط");
      return;
    }

    if(this.LE.length > 6) {
      this.helper.presentToast("الرجاء إدخال في خانة الجنيه عدد أرقام لا يتجاوز ٦ أرقام");
      return;
    }

    if(this.PT.length > 2) {
      this.helper.presentToast("الرجاء إدخال في خانة القروش عدد أرقام لا يتجاوز رقمين");
      return;
    }

    if(this.LE == "0" || this.LE == "00" || this.LE == "000" || this.LE == "0000" || this.LE == "00000" || this.LE == "000000") {
      this.helper.presentToast("الرجاء إدخال سعر أكبر من صفر");
      return;
    }

      // this.moveToPatientStatus = true
      // this.cancelDetectionStatus = true
      // this.endDetectionStatus = false
  
      console.log("call api to send price")
      // this.LE , this.PT

      this.storage.get("user_login_token").then((val) => {
       
      this.loginservice.updateCurrentOrder(this.currentOrderID, 8 ,this.helper.userType,0, val.access_token, (data) => {



        this.shareStatus  = false
        this.contactStatus = false

     this.moveToPatientStatus = true
      this.cancelDetectionStatus = true
      this.endDetectionStatus = false
      this.newAppointment = false

      this.thanksAlert = true;
      this.opacityOfAllContent = 1;


      },(err)=>{});
      })





  }

  chooseDate22() {
 console.log("chooseDate22")
    var minmDate;
    var maxDate;
    let userLang = this.helper.currentLang;
    if (this.plt.is('ios')) {
      minmDate = "Tue Nov 15 2016 00:00:00 GMT+0200 (EET)";//Moment("2016-11-15T10:00:00").format('DD-MM-YYYY');
      maxDate = String(new Date());
    }
    else {
      minmDate = (new Date("2016-11-15")).valueOf();//Moment("2016-11-15T10:00:00").format('DD-MM-YYYY');
      maxDate = (new Date()).valueOf();
    }
    let localLang = 'en_us';
    let nowTxt = 'Today';
    let okTxt = 'Done';
    let cancelTxt = 'Cancel';
    if (userLang == 'ar') {
      localLang = 'ar_eg';
      nowTxt = 'اليوم';
      okTxt = 'تم';
      cancelTxt = 'إلغاء'
    }
    
    this.datePicker.show({
      date: new Date(),
      mode: 'time',
      minDate: minmDate,
      maxDate: maxDate,
      okText: okTxt,
      cancelText: cancelTxt,
      todayText: nowTxt,
      locale: localLang,
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        
        alert("date from picker:  \n "+date)
       
        //  if (this.lang == "en") {
        //    this.DateObj.DateEN = Moment(date).locale('en-ca').format('DD-MM-YYYY');
        //    this.DateObj.Date = this.DateObj.DateEN;
        //    this.DateObj.DateAR = Moment(date).locale('ar').format('DD-MM-YYYY');
        //  }
        //  else {
        //    this.DateObj.DateAR = Moment(date).locale('ar').format('DD-MM-YYYY');
        //    this.DateObj.Date = this.DateObj.DateAR;
        //   this.DateObj.DateEN = Moment(date).locale('en-ca').format('DD-MM-YYYY');
        //  }
        //  this.LastUpdate = this.DateObj.Date;
       
        // this.DateObj.day = String(date.getDate());
        // this.DateObj.month = String(date.getMonth() + 1);
        // this.DateObj.year = String(date.getFullYear());
        // this.DateObj.hour = null;
        // this.DateObj.min = null;

        // this.storage.set('DateObj', this.DateObj);
        
        // this.loadData();
      },
      err => {
       alert('Error occurred while getting date: '+ err); 
       
      }     
      );
  }





}
