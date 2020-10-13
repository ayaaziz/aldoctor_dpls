import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the RetimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-retime',
  templateUrl: 'retime.html',
})

export class RetimePage {
  returnTimes = []
  lang_direction= ""
  dayTime = "" 
  monthTime = ""
  yearTime = ""
  returnTimesSelected
  day
  month 
  year
  orderDate
  currentOrderID
  minDate
  reOrderDate = ""
  patient_id
  order_finished = 0
  maxYear

  customPickerOptions:any;

  constructor(public toastCtrl: ToastController, public doctor_service: LoginServiceProvider, public navCtrl: NavController, public helper: HelperProvider,
    public translate: TranslateService , public storage: Storage , public navParams: NavParams) {
    this.lang_direction = this.helper.lang_direction;
    let x = new Date()
    this.maxYear = x.getFullYear() + 1
    let d = x.getFullYear()+'-'+(x.getMonth()+1)+'-'+(x.getDate()+2)
    this.minDate = new Date().toISOString()
    this.currentOrderID = navParams.get("orderID")
    this.patient_id = navParams.get("patient_id")
    this.dayTime = translate.instant("day")
    this.monthTime = translate.instant("month")
    this.yearTime = translate.instant("year")
    this.reOrderDate = translate.instant("reOrderDate")
    this.storage.set("openReview",0)

    
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

  }
succ(data){
  
}
ionViewDidEnter(){
  if(this.order_finished == 1){
    this.navCtrl.pop()
  }
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad RetimePage');
    if(navigator.onLine){
      this.doctor_service.getReturnTime((data)=> {this.returnTimes = data
      } , (data)=> { })
    }
  }
  cancelReOrder(){
    this.navCtrl.pop();
  }
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  openReview(){
    this.navCtrl.push('PatientreviewPage')
  }
  saveOrder(){
    if(navigator.onLine){
      
    if(this.returnTimesSelected == "0"){
      if(this.orderDate){
      this.storage.get("user_login_token").then((val)=>{
     // let date = String(this.day) + '-' + String(this.month) + '-' + String(this.year)
      this.doctor_service.createReOrder(this.currentOrderID,"", this.orderDate , val.access_token, (data)=> {
        
        this.storage.set("reOrderOpened",0)
        this.presentToast(this.translate.instant("returnCreated"))
        this.storage.remove("recievedNotificat")
        this.helper.updateBusy(0)
        //this.helper.updateOrderStatus('6' , this.currentOrderID)
        //alert("review")
        this.order_finished = 1
        // this.storage.set("openReview", 1).then(()=>{
        //   this.navCtrl.pop().then(()=>{
            //if(this.helper.userType != 0){
              this.navCtrl.push('PatientreviewPage',{patient_id:this.patient_id,
              orderId:this.currentOrderID})
          //  }
        //   })
        // })
        
      } , (data)=> {
        this.presentToast(this.translate.instant("serverError"))
      } )
      })
    }
    else{
      this.presentToast(this.translate.instant("selectReOrderDate"))
    }
    }
    else{
      if(this.returnTimesSelected){
      this.storage.get("user_login_token").then((val)=>{
        this.doctor_service.createReOrder(this.currentOrderID, this.returnTimesSelected , "" , val.access_token, (data)=> {
          this.storage.set("reOrderOpened",0)
          this.presentToast(this.translate.instant("returnCreated"))
        this.storage.remove("recievedNotificat")
        this.helper.updateBusy(0)
        //this.helper.updateOrderStatus('6' , this.currentOrderID)
        this.storage.set("openReview", 1).then(()=>{
         // this.navCtrl.pop()
        })
        this.order_finished = 1
        //this.navCtrl.pop().then(()=>{
          this.navCtrl.push('PatientreviewPage',{patient_id:this.patient_id,
            orderId:this.currentOrderID})
       // })
        
        } , (data)=> {} )
        })
    }
    else{
      this.presentToast(this.translate.instant("selectReOrderDate"))
    }
  }
  }
  else{
    this.presentToast(this.translate.instant("serverError"))
  }
}
}
