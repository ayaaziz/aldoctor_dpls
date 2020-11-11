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



@IonicPage()
@Component({
  selector: 'page-long-time-nursing-order',
  templateUrl: 'long-time-nursing-order.html',
  providers: [LaunchNavigator, DatePicker, Device]
})
export class LongTimeNursingOrderPage {

  ratingStatus = 4
  userName = ""
  userImageUrl = ""
  userAddress = ""
  lang_direction = ""
  arriveTime = "..."
  patient_forfit = 0
  interval;
  trackInterval;
  DoctorLat;
  DoctorLong;
  currentOrderID;
  patient_lat;
  patient_long;
  patient_id;
  user_availablity = "0"
  patient_tel
  type
  disablePrescription = true
  server_url
  order_type = ""
  order_date = ""
  order_remark = ""
  order_no
  androidIS42 = 0
  
  // shareStatus  = false
contactStatus = false

customPickerOptions:any;
customPickerOptionsHours:any;

status;

isCreatedByAdmin;

//////////

serviceName;
MonthDays;
DayHours;
DayNumbers; 
WeekDays;
TotalPrice;
priceByOnce;
PreferedTime;
PreferedGender;
pageLoaded:boolean = false;



constructor(public navCtrl: NavController, public navParams: NavParams, public loginservice: LoginServiceProvider, private alertCtrl: AlertController
  , public helper: HelperProvider, public toastCtrl: ToastController, public plt: Platform, public device: Device,
  public events: Events, private launchNavigator: LaunchNavigator, public translate: TranslateService, public storage: Storage) {


  this.lang_direction = helper.lang_direction;
  this.server_url = helper.serviceUrl;
  this.currentOrderID = navParams.get("recievedNotificat");


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

 }



ionViewDidLoad() {
  console.log('ionViewDidLoad LongTimeNursingOrderPage');
}

shareLoc() {
  console.log("this.patient_lat: "+this.patient_lat);
  console.log("this.patient_long: "+this.patient_long);

  window.open("http://maps.google.com/maps?q=loc:" + this.patient_lat + "," + this.patient_long, "_system", "location=yes");
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
  // this.ionViewDidEnter(1)
  this.ionViewWillEnter(1)
}

// ionViewDidEnter(refresh?) {
  ionViewWillEnter(refresh?) {


  this.pageLoaded = false;
  console.log("DidEnter")


  this.storage.get("user_avaial").then(val => {
    if (val) {
      this.user_availablity = val

    }
  })

  this.helper.notification_order_id = this.currentOrderID
  this.currentOrderID = this.currentOrderID
  this.storage.get("user_login_token").then((val) => {
    if (this.helper.userAvailable == 1) {

      this.loginservice.getCurrentOrder(this.currentOrderID, val.access_token, (data) => {

        if (data.success == true) {
          if (data.order.service_profile_id) {
            if (data.order.service_profile_id != this.helper.userId) {
              this.helper.presentToast(this.translate.instant("orderAssignedToAnotherNurse"));
              setTimeout(() => {
                this.navCtrl.pop()
              }, 3000);
            
            }
          }
      
          // let patient_loc = String(data.order.extra).split(',')

          let patient_loc = String(data.order.patientProfile.extraInfo.address_location).split(',');

          this.userImageUrl = data.order.patientProfile.profile_pic;
          this.userName = data.order.patientProfile.name;

          if(data.order.patient_address) {
            this.userAddress = data.order.patient_address
         
          } else if(data.order.patientProfile.extraInfo.address != "" && data.order.patientProfile.extraInfo.address != "--") {
            this.userAddress = data.order.patientProfile.extraInfo.address
          
          } else {
            this.userAddress = data.order.patientProfile.extraInfo.address_map
          }

          this.ratingStatus = data.order.patientProfile.rate;
          this.patient_forfit = data.order.patientProfile.forfiet;
          this.patient_lat = patient_loc[0];
          this.patient_long = patient_loc[1];
          let created_time = data.order.created_at;
          this.order_date = data.order.date ? data.order.date : "";
          this.order_remark = data.order.remark ? data.order.remark : "";
          this.order_no = data.order.id;
          this.order_type = data.order.entity_service_Name ? data.order.entity_service_Name : "";
          this.patient_tel = data.order.patientProfile.phone;
          this.patient_id = data.order.patient_id;
          this.serviceName = data.order.entity_service_Name;
          this.MonthDays = data.order.MonthDays;
          this.DayHours = data.order.DayHours;
          this.DayNumbers = data.order.DayNumbers;
          this.WeekDays = data.order.WeekDays;
          this.TotalPrice = data.order.TotalPrice;
          this.priceByOnce = data.order.priceByOnce;
          this.PreferedTime = data.order.PreferedTime;
          this.PreferedGender = data.order.PreferedGender;
          this.isCreatedByAdmin = data.order.createdByAdmin;

          this.pageLoaded = true;

          console.log("this.PreferedGender: "+ this.PreferedGender);
        }
          
      }, (data) => {
        this.navCtrl.pop()
      })
    }
    else {
      this.helper.presentToast(this.translate.instant("serverError"))
      this.navCtrl.pop()
    }
  })
}

callPatient() {
  window.open('tel:00' + this.patient_tel)
}

whatsAppPatient() {
  window.open("whatsapp://send?phone=" + this.patient_tel, "_system", "location=yes")
}




}

