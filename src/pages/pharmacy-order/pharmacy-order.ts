import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { AlertController } from 'ionic-angular';
import { isEmpty } from 'rxjs/operators';

/**
 * Generated class for the PharmacyOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-pharmacy-order',
  templateUrl: 'pharmacy-order.html',
  providers: [LaunchNavigator]
})
export class PharmacyOrderPage {

  ratingStatus = 4
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
  patient_forfit
  order_no;
  patient_lat;
  patient_long;
  patient_id;
  user_availablity = "0"
  patient_tel
  timer;
  files = []
  audio: any;
  disablePrescription = true
  server_url
  showReview = false
  anotherOneAccepted = false

  moveToPatientStatus = false
  cancelDetectionStatus = false
  endDetectionStatus = false
  


  thanksAlert = true;
  opacityOfAllContent = 1;
  LE
  PT
  shareStatus  = false
contactStatus = false
totalPrice;



  constructor(public navCtrl: NavController, public navParams: NavParams, public loginservice: LoginServiceProvider
    , public helper: HelperProvider, public toastCtrl: ToastController, private alertCtrl: AlertController,
    public events: Events, private launchNavigator: LaunchNavigator, 
    public translate: TranslateService, public storage: Storage) {
      this.currentOrderID = navParams.get("recievedNotificat")     
      this.server_url = helper.serviceUrl
      this.lang_direction = helper.lang_direction
      this.audio = new Audio();
      this.audio.src = 'assets/mp3/alarm_nice_sound.mp3';
      this.audio.load();

      events.subscribe('clearTimout', (id) => {
       // this.storage.remove('recievedNotificat')
        if(this.interval){
          clearInterval(this.interval)
        }
        if(this.timer){
          clearTimeout(this.timer)
        }
        if(this.audio){
          this.stopAudio()
        }
        if(String(id) == String(this.currentOrderID)){
          navCtrl.pop()
        }
      });
      
    }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad NeworderPage');
    this.orderAccepted = false;
    this.newOrder = false;
    this.noOrder = true;
    console.log('ionViewDidLoad NotificationPage');
    //alert("here")
    
  }
  doRefresh(ev){
    ev.complete();
    if(this.interval){
      clearInterval(this.interval)
    }
    if(this.timer){
      clearTimeout(this.timer)
    }
    if(this.audio){
      this.stopAudio()
    }
    this.ionViewDidEnter(1)
  }
  ionViewDidLeave(){
    this.stopAudio()
    clearInterval(this.interval)
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

      //alert("recieved 1")
      //if (this.helper.notification_order_id) {
      //this.orderUpdateStatus(3);
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
    if(this.helper.userAvailable == 1){
    clearInterval(this.interval)
    clearTimeout(this.timer)
   if(status == "10" || status == "11"){
    this.navCtrl.push('cancel-order', { orderId: this.currentOrderID, status: status });
   }
    else{
      if (navigator.onLine) {
        this.storage.get("user_login_token").then((val) => {
          // alert("here")

if(status == 8 ){

  
  this.moveToPatientStatus = true
  this.cancelDetectionStatus = true
  this.shareStatus  = true
  this.contactStatus = true

this.thanksAlert = false;
this.opacityOfAllContent = 0.1;


}else{



          this.loginservice.updateCurrentOrder(this.currentOrderID, status,this.helper.userType,0,val.access_token, (data) => {
            if(data.status == -2){
              this.helper.presentToast("لا يمكنك إستقبال المزيد من الطلبات حتى يتم إنهاء الطلبات الحالية")
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
              //|| data.order.status == "3"
              if ( data.order.status == "0" || data.order.status == "3" || data.order.status == "6" || data.order.status == "10") {
              
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
              else if (data.order.status == "6") {
              }
              else if (data.order.status == "8") {


                // this.moveToPatientStatus = true
                // this.cancelDetectionStatus = true
                // this.endDetectionStatus = false

//s


this.thanksAlert = false;
this.opacityOfAllContent = 0.1;



                // if (this.patient_lat && this.patient_long) {
                //   this.launchNavigator.navigate([this.patient_lat, this.patient_long])
                //     .then(
                //       success => console.log('Launched navigator'),
                //       error => console.log('Error launching navigator', error)
                //     );
                // }
              }
              else if (data.order.status == "7") {
               
              }
              else if (data.order.status == "4") {
                this.helper.presentToast(this.translate.instant('patientCanceledOrder'))
                //  this.storage.remove("recievedNotificat")
                this.orderAccepted = false
                this.newOrder = false;
                this.noOrder = true

                this.events.publish('clearTimout', this.currentOrderID)

              }
              else if (data.order.status == "2") {
                this.helper.updateServiceProfile(this.currentOrderID)
                this.orderAccepted = true
                this.newOrder = false;
                this.noOrder = false
                this.moveToPatientStatus = false
                this.cancelDetectionStatus = false
                this.endDetectionStatus = true
              }
              else if (data.order.status == "5") {
             //   this.storage.remove("recievedNotificat")
                this.orderAccepted = false
                this.newOrder = false;
                this.noOrder = true;
                this.navCtrl.push('PatientreviewPage', {
                  patient_id: this.patient_id,
                  orderId: this.currentOrderID
                })
                // this.navCtrl.pop().then(()=>{
                //   this.openReview();
                // })
                //   })
                // })
              }
              else if (data.order.status == "3") {
               // this.storage.remove("recievedNotificat")
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
               // this.storage.remove("recievedNotificat")
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

        }

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
  shareLoc(){
    let urlDecoded = decodeURIComponent("http://maps.google.com/maps?q=loc:"+this.patient_lat+","+this.patient_long)
    window.open("whatsapp://send?text="+urlDecoded,"_system","location=yes")
  }
  openPrescription(){
    if(this.files.length > 0){
      this.navCtrl.push('ShowPrescriptionPage',{files: this.files})
   }
  }
  openReview() {

    this.navCtrl.push('PatientreviewPage',{patient_id:this.patient_id,
      orderId:this.currentOrderID})
  }
  ionViewDidEnter(refresh?) {
    if(localStorage.getItem("lastCanceled") == this.currentOrderID){
      this.navCtrl.pop()
    }
    if(refresh){
      this.noOrder = false
    this.newOrder = false;
    this.orderAccepted = false;
    }
    else{
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
    
    //this.noOrder = false
    if (navigator.onLine) {
      //this.storage.get("recievedNotificat").then(val => {
        if (this.currentOrderID) {
          //alert("1 "+ val)
          this.helper.notification_order_id = this.currentOrderID
          this.currentOrderID = this.currentOrderID
          this.storage.get("user_login_token").then((val) => {
            if(this.helper.userAvailable == 1){
            this.loginservice.getCurrentOrder(this.currentOrderID, val.access_token, (data) => {
              // alert("1 "+ typeof(data.order.status))
              if (data.success == true) {
                if (data.order.service_profile_id) {
                  if (data.order.service_profile_id != this.helper.userId) {
                    // this.storage.remove("recievedNotificat")
                    // this.storage.remove("orderID").then(() => {
                    // })
                    // this.orderAccepted = false
                    // this.newOrder = false;
                    // this.noOrder = true
                    this.anotherOneAccepted = true
                    this.helper.presentToast(this.translate.instant("orderAcceptedByCenter"))

                    this.orderAccepted = false
                    this.newOrder = false;
                    this.noOrder = true
                    setTimeout(() => {
                      this.navCtrl.pop()
                    }, 3000);
                    
                    
                   // return;
                  }
                }
               // this.helper.updateOrderStatus(data.order.status, data.order.id)
                this.files = data.order.files
                if(this.files.length > 0){
                  this.disablePrescription = false
                }
                let patient_loc = String(data.order.extra).split(',')
                this.userImageUrl = data.order.patientProfile.profile_pic
                this.patient_forfit = data.order.patientProfile.forfiet
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
                this.order_no = data.order.id
                this.ratingStatus = data.order.patientProfile.rate
                this.patient_lat = patient_loc[0]
                this.patient_long = patient_loc[1]
                let created_time = data.order.created_at
                var t1 = new Date(String(data.currentdate.date).replace(' ','T'));
                var t2 = new Date(String(created_time).replace(' ','T'));
                var dif = t1.getTime() - t2.getTime();
                var Seconds_from_T1_to_T2 = (dif / 1000);
                console.log('Seconds_from_T1_to_T2 ' + Seconds_from_T1_to_T2)
                let time_left
                if(this.files.length > 0){
                   time_left = 180 - Seconds_from_T1_to_T2
                }
                else{
                  time_left = 180 - Seconds_from_T1_to_T2
                }
                console.log('Seconds_from_T1_to_T2 ' + Seconds_from_T1_to_T2 + "created_at " + created_time + "t2 "+ t2 + " t1 "+ t1 )
                this.remaining_time = time_left

                // if (this.helper.inspectorLat != 0.0 && this.helper.inspectorLong != 0.0) {
                //   this.loginservice.getTime(this.helper.inspectorLat, this.helper.inspectorLong, this.patient_lat, this.patient_long, (data) => {
                //     this.arriveTime = data
                //   },
                //     (data) => { })
                // }
                this.patient_tel = data.order.patientProfile.phone
                this.patient_id = data.order.patient_id
               // this.storage.set("patient_id", data.order.patient_id)
               // this.storage.set("orderID", data.order.id)
                let order_stat = String(data.order.status)
                console.log(order_stat + " tet 12 = " + typeof (order_stat))
                //this.helper.listenOrder(data.order.id)
                // if (order_stat == "0") {
                //   this.startTimer();
                //   this.noOrder = false
                //   this.newOrder = true;
                //   this.orderAccepted = false;
                // }
                // else 
                if (data.order.status == "0" || (data.order.status == "10" && !data.order.service_profile_id)) {
                
                  if(this.files.length > 0){
                   if(time_left <= 0){
                     this.helper.presentToast(this.translate.instant('orderTimeOut'))
                     this.orderUpdateStatus(3)
                     this.navCtrl.pop()

                   }
                   else{
                    this.startTimer();
                    this.noOrder = false
                    this.newOrder = true;
                    this.orderAccepted = false;
                   }
                  }
                  else{
                    if(time_left <= 0){
                      this.helper.presentToast(this.translate.instant('orderTimeOut'))
                      this.orderUpdateStatus(3)
                      this.navCtrl.pop()
                    }
                    else{
                      this.startTimer();
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
                  this.endDetectionStatus = false
                }
                else if (data.order.status == "7") {
                  this.orderAccepted = true
                  this.newOrder = false;
                  this.noOrder = false
                
                }
                else if (data.order.status == "2") {
                  this.helper.updateServiceProfile(this.currentOrderID)
                  
                  this.orderAccepted = true
                  this.newOrder = false;
                  this.noOrder = false
                  this.moveToPatientStatus = false
                this.cancelDetectionStatus = false
                this.endDetectionStatus = true
                }
                else if (data.order.status == "5") {
                 // alert("data.order.status "+ data.order.status)
                 // this.storage.remove("recievedNotificat")
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true;
                //   this.navCtrl.push('PatientreviewPage', {
                //     patient_id: this.patient_id,
                //     orderId: this.currentOrderID
                //   }).then(()=>{
                //    //this.navCtrl.pop()
                //  })
                  if(data.order.rated == 0){
                    this.presentConfirm()
                  }
                  else{
                    this.navCtrl.pop()
                   }
                 
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
                  //this.storage.remove("recievedNotificat")
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  //setTimeout(() => {
                    this.events.publish('clearTimout', this.currentOrderID)
                 // }, 500);
                  
                }
                else {
                  ///this.storage.remove("recievedNotificat")
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  this.navCtrl.pop()
                }

              }
              else{
              //  this.storage.remove("recievedNotificat")
                  this.orderAccepted = false
                  this.newOrder = false;
                  this.noOrder = true
                  this.navCtrl.pop()
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
        }
     // })
    }
    else {
      this.helper.presentToast(this.translate.instant("serverError"))
      this.noOrder = true
      this.newOrder = false;
      this.orderAccepted = false;
      this.navCtrl.pop()
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
    window.open("whatsapp://send?phone=" + this.patient_tel,"_system","location=yes")
  }
  playAudio() { 
    if(this.audio){
      this.audio.play();
    this.audio.loop = true;
    }
    
   }
   closeOrder(){
    this.navCtrl.pop()
  }
  stopAudio() {
    this.audio.pause(); 
  }
   
  ngOnDestroy() {
    if(this.audio) {
      this.audio.pause();
      this.audio = null;   
    }
  }
  
  closePopup(){
    this.thanksAlert = true;
    this.opacityOfAllContent = 1;

    this.moveToPatientStatus = false
    this.cancelDetectionStatus = false
    this.shareStatus  = false
    this.contactStatus = false

  }
  sendPrice(){

    if(this.LE){

      // this.moveToPatientStatus = true
      // this.cancelDetectionStatus = true
      // this.endDetectionStatus = false
  
      console.log("call api to send price")
      // this.LE , this.PT

      this.totalPrice = this.LE +"."+this.PT;

      this.storage.get("user_login_token").then((val) => {
       
      this.loginservice.updateCurrentOrder(this.currentOrderID, 8 ,this.helper.userType,this.totalPrice, val.access_token, (data) => {


        this.shareStatus  = false
        this.contactStatus = false

     this.moveToPatientStatus = true
      this.cancelDetectionStatus = true
      this.endDetectionStatus = false
      this.thanksAlert = true;
      this.opacityOfAllContent = 1;


      },(err)=>{});
      })




    }else{
      console.log("le empty")
  
      this.helper.presentToast("الرجاء إدخال سعر الدواء")
  
    }



  }




}
