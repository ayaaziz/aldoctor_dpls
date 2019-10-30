import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { LoginServiceProvider } from '../../providers/login-service/login-service';



/**
 * Generated class for the FinancialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-financial',
  templateUrl: 'financial.html',
})
export class FinancialPage {
  monthTxt
  yearTxt
  year
  month
  noData = false
  order_count
  orders_done
  payment
  forfeit_patient
  forfeit_for_doctor
  aldoctor_app_percent
  doctor_money
  app_money
  reportStr
  userType = 0
  subscribtion_date = ""
  loaded = false
  paid
  paid_to_app_status
  forfiet_deserved
  coupon
  subscribe_date_str
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public service: LoginServiceProvider, public storage: Storage,
    public helper: HelperProvider, public translate: TranslateService) {
      this.monthTxt = (new Date()).toISOString();
      this.month = (new Date()).getMonth()+1
      this.yearTxt = (new Date()).toISOString();
      this.year = (new Date()).getFullYear()
      let cur_date = new Date()
      let subscribe_date =  cur_date.getTime() + (86400000 * 30)
      this.subscribe_date_str = new Date(subscribe_date)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinancialPage');
    this.storage.get("user_login_info").then((val) => {
      let sup_date = val.date_of_subscription
      let date_day = (new Date(sup_date)).getDate()
      this.subscribe_date_str = sup_date //(new Date().getFullYear()) + "-" + (new Date().getMonth() + 2) + "-" + date_day
    })
    this.storage.get('type').then(type_val => {
      if(type_val == 0){
        this.userType = 0
        this.reportStr = "تقرير مالي"
        this.loadFinancialData()
      }
      else{
        this.userType = 1
        this.reportStr = "موعد الإشتراك"
      }
    })
    
  }
  doRefresh(e){
    e.complete();
    this.loadFinancialData();
  }
  loadFinancialData(){
    if(navigator.onLine){
      this.service.getFinancial(this.month,this.year,(data)=>{
        this.loaded = true
        if(data.data.length > 0){
          this.noData = false
          this.order_count = data.data[0].orders
          this.orders_done = data.data[0].order_finished
          this.payment = data.data[0].payment + " جنيه"
          this.forfeit_patient = data.data[0].forfiet_obtain + " جنيه"
          this.forfeit_for_doctor = data.data[0].net_forfiet + " جنيه"
          this.forfiet_deserved = data.data[0].forfiet_for_other_doctor + " جنيه"
          this.aldoctor_app_percent = data.data[0].app_percent + " جنيه"
          this.app_money = data.data[0].total_app_percent + " جنيه"
          this.paid = data.data[0].payment_status
          this.paid_to_app_status = data.data[0].status
          this.doctor_money = data.data[0].total_payment + " جنيه"
          this.coupon = data.data[0].coupon + " جنيه"
        }
        else{
          this.noData = true
        }
      },
      ()=> {

      })
    }
  }
  monthChanged(e){
    console.log(this.monthTxt)
    this.month = (new Date(this.monthTxt)).getMonth() + 1
    this.loadFinancialData()
  }
  yearChanged(e){
    console.log(this.year)
    this.year = (new Date(this.yearTxt)).getFullYear()
    this.loadFinancialData()
  }

}
