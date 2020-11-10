import { Component } from '@angular/core';
import { NavController, NavParams , ToastController,AlertController, LoadingController} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { HelperProvider } from '../../providers/helper/helper';
import { CenterOrderPage } from '../../pages/center-order/center-order';
import { NeworderPage } from '../../pages/neworder/neworder';
import { PharmacyOrderPage } from '../../pages/pharmacy-order/pharmacy-order';
import 'rxjs/add/operator/timeout';

// @IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  noData = false;
  langDirection;    
  data=[];
  from = "";
  to = "";
  rate=4;
  cancelTxt;
  doneTxt;
  accessToken;
  //SpecializationArray=[];
  color="grey";
  ordersArray=[];
  page=1;
  userTypeId;

  //ayaaaaaa
  customPickerOptions: any;



  orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
  "name":"","profile_pic":"","rate":"","patient_id":"",
"custom_date":"","date_id":"","patient_address":"","status":"","created_at":"","desc":"","service_id":"","serviceTitle":""};

  tostClass ;
  refresher;
  minDate
  constructor(public helper:HelperProvider, public service:LoginServiceProvider,
    public storage: Storage,  public alertCtrl: AlertController,public loadingCtrl: LoadingController,
    public translate: TranslateService, public navCtrl: NavController,
     public navParams: NavParams,public toastCtrl: ToastController) {

      this.langDirection = this.helper.lang_direction;
      this.minDate = new Date().toISOString()
      // if(this.langDirection == "rtl")
      //   this.tostClass = "toastRight";
      // else
      //   this.tostClass="toastLeft";

      
      //console.log("langdir:",this.langDirection);
      //this.translate.use(this.helper.currentLang);


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

  getYears() {
    return [1992,1993,1994,1995,1996,1997,1998,1999,2000];
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad contactPage');
  }
 
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom',
      cssClass: this.tostClass
    });
    toast.present();
  }

  getOrders(infiniteScroll?){
    this.storage.get("user_login_token").then(data=>{
      if(infiniteScroll){
        infiniteScroll.complete();
      }
      this.accessToken = data.access_token;
      if(navigator.onLine){
        let loader = this.loadingCtrl.create({
          content: "",
        });
         loader.present();
      this.service.getUserOrders(this.accessToken,this.page,this.helper.currentLang,1)
      .timeout(10000)
      .subscribe(
        resp=>{
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
         console.log("getUserOrders resp: ",resp);
         var ordersData =JSON.parse(JSON.stringify(resp)).orders;
        // this.ordersArray = [];
         //this.ordersArray = ordersData;
         if(ordersData.length > 0){
         console.log("orders: ",ordersData);
          for(var j=0;j<ordersData.length;j++){
            console.log("status ",ordersData[j].status );

            if(ordersData[j].status == "3"){
              ordersData[j].color = "red";
              ordersData[j].desc = this.translate.instant("no_respond")
             }
             else if(ordersData[j].status == "0" ){
              ordersData[j].color = "green";
              ordersData[j].desc = "متابعة"
             }
            else if(ordersData[j].status == "4"){
              ordersData[j].color = "red";
              ordersData[j].desc = this.translate.instant("patient_cancel")
             }
           else if(ordersData[j].status == "11" || ordersData[j].status == "10" ){
              ordersData[j].color = "red";
              ordersData[j].desc = this.translate.instant("canceled_order")
           } //canceled by doctor
            
           else if(ordersData[j].status == "5" || ordersData[j].status == "6") {
             ordersData[j].color="grey";
             ordersData[j].desc = this.translate.instant("finishing_order")
           }
             else if(ordersData[j].status == "1" || ordersData[j].status == "2" || ordersData[j].status == "7" || ordersData[j].status == "8" ||  ordersData[j].status == "13" || ordersData[j].status == "12")
             {
               ordersData[j].color="green";
               ordersData[j].desc = this.translate.instant("running_order")
             }

             //ayaaaaaaa

            //  else if(ordersData[j].status == "15") {
            //   // ordersData[j].color="orange";
            //   ordersData[j].desc = ordersData[j].entity_service_Name;
            // }

            //assigned to you from admin
             else if(ordersData[j].status == "16") {
              ordersData[j].color="green";
              ordersData[j].serviceTitle = ordersData[j].entity_service_Name;
              ordersData[j].desc = "متابعة";
            }
            //canceled by admin
            else if(ordersData[j].status == "18") {
              ordersData[j].color="red";
              ordersData[j].desc = "ملغي";
            }
             //rejected by admin
             else if(ordersData[j].status == "17") {
              ordersData[j].color="red";
              ordersData[j].desc = "مرفوض";
            }

             ////////////

            //  else if(ordersData[j].status == "12"){
            //   ordersData[j].color="yellow";
            //   ordersData[j].desc = this.translate.instant("waiting_order")
            //  }

            // if(ordersData[j].reorder == "1")
            //   ordersData[j].color = "green";
            
            // if(ordersData[j].rated == "0")
            //   ordersData[j].color = "yellow";
            var patient = ordersData[j].patient
            if(patient.user_info.address == "" || patient.user_info.address == "--"){
              this.orderobject.patient_address = patient.user_info.address_map
            }
            else{
              this.orderobject.patient_address = patient.user_info.address
            }
            if(ordersData[j].patient_address){
              this.orderobject.patient_address = ordersData[j].patient_address
            }
                  this.orderobject.name = patient.name;
                  this.orderobject.profile_pic = patient.profile_pic;
                  for(let m=0;m<ordersData[j].ratings.length;m ++){
                    if(ordersData[j].ratings[m].service_profile_id != this.helper.userId){
                      this.orderobject.rate = ordersData[j].ratings[m].rate
                    }
                  }
                  if(this.orderobject.rate == ""){
                    this.orderobject.rate = '0'
                  }
                  
                  this.orderobject.patient_id = patient.id;
                  this.orderobject.color = ordersData[j].color;
                  this.orderobject.desc = ordersData[j].desc;
                  this.orderobject.reorder = ordersData[j].reorder;
                  this.orderobject.rated = ordersData[j].rated;
                  this.orderobject.status = ordersData[j].status;
                  this.orderobject.orderId = ordersData[j].id;
                  this.orderobject.order_status = ordersData[j].status;
                  this.orderobject.created_at = ordersData[j].created_at_new
                  this.orderobject.service_id = ordersData[j].service_id
                  this.orderobject.serviceTitle = ordersData[j].serviceTitle


                  if(ordersData[j].reorder == "1")
                  {
                    this.orderobject.custom_date = ordersData[j].custom_date;
                    this.orderobject.date_id = ordersData[j].date_id;

                  } else{
                    this.orderobject.custom_date ="";
                    this.orderobject.date_id = "";

                  } 

                  this.data.push(this.orderobject);

                  this.orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
                  "name":"","profile_pic":"","rate":"","patient_id":"",
                  "custom_date":"","date_id":"","patient_address":"","status":"","created_at":"","desc":"","service_id":"","serviceTitle":""};
                  //  }

          //   }
          // }
          }
          if(this.data.length == 0)
          {
            this.presentToast(this.translate.instant("noOrders"));
          }

          if(this.refresher){
            this.refresher.complete();
            }
          }
          else{
            if(!infiniteScroll){
              this.noData = true
              
            }
            this.page = -1
          }
        },
        err=>{
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          this.helper.presentToast(this.translate.instant('serverError'))
        }
      );
    }
    else{
      this.helper.presentToast(this.translate.instant('serverError'))
    }
    });


  }
  dateFromChanged(event){
    if(this.from != "" && this.to != ""){
      if(Date.parse(this.to) < Date.parse(this.from) ){
        this.helper.presentToast("لا يجب ان يكون الفترة من أكبر من الفترة إلى")
        this.to = ""
        return
      }
    }
    this.page = 1
    this.data=[];
    console.log("to: ",this.to);
    console.log("from: ",this.from);
    this.service.filterOrder(this.from,this.to,this.accessToken,this.page,this.helper.currentLang).subscribe(
      resp=>{
        console.log("resp to filter resp",resp);

        console.log("getUserOrders resp: ",resp);
        var ordersData =JSON.parse(JSON.stringify(resp)).orders;
        if(ordersData.length > 0){
        this.ordersArray= [];
        this.ordersArray = ordersData;
        console.log("orders: ",ordersData);
         for(var j=0;j<ordersData.length;j++){
           console.log("status ",ordersData[j].status);
           if(ordersData[j].status == "3"){
            ordersData[j].color = "red";
            ordersData[j].desc = this.translate.instant("no_respond")
           }
           else if(ordersData[j].status == "0" ){
            ordersData[j].color = "green";
            ordersData[j].desc = "متابعة"
           }
          else if(ordersData[j].status == "4"){
            ordersData[j].color = "red";
            ordersData[j].desc = this.translate.instant("patient_cancel")
           }
         else if(ordersData[j].status == "11" || ordersData[j].status == "10" ){
            ordersData[j].color = "red";
            ordersData[j].desc = this.translate.instant("canceled_order")
         } //canceled by doctor
          
         else if(ordersData[j].status == "5" || ordersData[j].status == "6") {
           ordersData[j].color="grey";
           ordersData[j].desc = this.translate.instant("finishing_order")
         }
           else if(ordersData[j].status == "1" || ordersData[j].status == "2" || ordersData[j].status == "7" || ordersData[j].status == "8" ||  ordersData[j].status == "13")
           {
             ordersData[j].color="green";
             ordersData[j].desc = this.translate.instant("running_order")
           }
           else if(ordersData[j].status == "12"){
            ordersData[j].color="yellow";
            ordersData[j].desc = this.translate.instant("waiting_order")
           }

            console.log("order id:", ordersData[j].id);
            var patient = ordersData[j].patient
          
                  this.orderobject.name = patient.name;
                  if(patient.user_info.address == "" || patient.user_info.address == "--"){
                    this.orderobject.patient_address = patient.user_info.address_map
                  }
                  else{
                    this.orderobject.patient_address = patient.user_info.address
                  }
                  if(ordersData[j].patient_address){
                    this.orderobject.patient_address = ordersData[j].patient_address
                  }
                  this.orderobject.profile_pic = patient.profile_pic;
                  for(let m=0;m<ordersData[j].ratings.length;m ++){
                    if(ordersData[j].ratings[m].service_profile_id != this.helper.userId){
                      this.orderobject.rate = ordersData[j].ratings[m].rate
                    }
                  }
                  if(this.orderobject.rate == ""){
                    this.orderobject.rate = '0'
                  }
                  this.orderobject.color = ordersData[j].color;
                  this.orderobject.desc = ordersData[j].desc;
                  this.orderobject.reorder = ordersData[j].reorder;
                  this.orderobject.rated = ordersData[j].rated;
                  this.orderobject.status = ordersData[j].status;
                  this.orderobject.orderId = ordersData[j].id;
                  this.orderobject.order_status = ordersData[j].status;
                  this.orderobject.created_at = ordersData[j].created_at_new
                  this.data.push(this.orderobject);
                  this.orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
                  "name":"","profile_pic":"","rate":"","patient_id":"",
                  "custom_date":"","date_id":"","patient_address":"","status":"","created_at":"","desc":"","service_id":"","serviceTitle":""};
            //         }

            // }

         }
         if(this.data.length == 0)
         {
           this.presentToast(this.translate.instant("noOrders"));
         }
        }
        else{
            this.noData = true
            this.helper.presentToast("لا يوجد طلبات")
        }
      },err=>{
        console.log("resp from filter err",err);
      }
    );
  }
  dateToChanged(event){
    if(this.from != "" && this.to != ""){
      if(Date.parse(this.to) < Date.parse(this.from) ){
        this.helper.presentToast("لا يجب ان يكون الفترة من أكبر من الفترة إلى")
        this.to = ""
        return
      }
    }
    this.page = 1
    this.data=[];
    var currentDate = new Date().toLocaleDateString();
    console.log("current date",currentDate);
    console.log("to: ",this.to);
    console.log("from: ",this.from);
    this.service.filterOrder(this.from,this.to,this.accessToken,this.page,this.helper).subscribe(
      resp=>{
        console.log("resp to filter resp",resp);

        console.log("getUserOrders resp: ",resp);
        var ordersData =JSON.parse(JSON.stringify(resp)).orders;
        if(ordersData.length > 0){
        this.ordersArray= [];
        this.ordersArray = ordersData;
        console.log("orders: ",ordersData);
         for(var j=0;j<ordersData.length;j++){
           console.log("status ",ordersData[j].status);
           if(ordersData[j].status == "3"){
            ordersData[j].color = "red";
            ordersData[j].desc = this.translate.instant("no_respond")
           }
           else if(ordersData[j].status == "0" ){
            ordersData[j].color = "green";
            ordersData[j].desc = "متابعة"
           }
          else if(ordersData[j].status == "4"){
            ordersData[j].color = "red";
            ordersData[j].desc = this.translate.instant("patient_cancel")
           }
         else if(ordersData[j].status == "11" || ordersData[j].status == "10" ){
            ordersData[j].color = "red";
            ordersData[j].desc = this.translate.instant("canceled_order")
         } //canceled by doctor
          
         else if(ordersData[j].status == "5" || ordersData[j].status == "6") {
           ordersData[j].color="grey";
           ordersData[j].desc = this.translate.instant("finishing_order")
         }
           else if(ordersData[j].status == "1" || ordersData[j].status == "2" || ordersData[j].status == "7" || ordersData[j].status == "8" || ordersData[j].status == "13")
           {
             ordersData[j].color="green";
             ordersData[j].desc = this.translate.instant("running_order")
           }
           else if(ordersData[j].status == "12"){
            ordersData[j].color="yellow";
            ordersData[j].desc = this.translate.instant("waiting_order")
           }

            console.log("order id:", ordersData[j].id);
            var patient = ordersData[j].patient
          
                  this.orderobject.name = patient.name;
                  if(patient.user_info.address == "" || patient.user_info.address == "--"){
                    this.orderobject.patient_address = patient.user_info.address_map
                  }
                  else{
                    this.orderobject.patient_address = patient.user_info.address
                  }
                  if(ordersData[j].patient_address){
                    this.orderobject.patient_address = ordersData[j].patient_address
                  }
                  this.orderobject.profile_pic = patient.profile_pic;
                  for(let m=0;m<ordersData[j].ratings.length;m ++){
                    if(ordersData[j].ratings[m].service_profile_id != this.helper.userId){
                      this.orderobject.rate = ordersData[j].ratings[m].rate
                    }
                  }
                  if(this.orderobject.rate == ""){
                    this.orderobject.rate = '0'
                  }
                  this.orderobject.color = ordersData[j].color;
                  this.orderobject.desc = ordersData[j].desc;
                  this.orderobject.reorder = ordersData[j].reorder;
                  this.orderobject.rated = ordersData[j].rated;
                  this.orderobject.status = ordersData[j].status;
                  this.orderobject.orderId = ordersData[j].id;
                  this.orderobject.order_status = ordersData[j].status;
                  this.orderobject.created_at = ordersData[j].created_at_new
                  this.data.push(this.orderobject);
                  this.orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
                  "name":"","profile_pic":"","rate":"","patient_id":"",
                  "custom_date":"","date_id":"","patient_address":"","status":"","created_at":"","desc":"","service_id":"","serviceTitle":""};
            //         }

            // }

         }
         if(this.data.length == 0)
         {
           this.presentToast(this.translate.instant("noOrders"));
         }
        }
        else{
            this.noData = true
            this.helper.presentToast("لا يوجد طلبات")
        }
      },err=>{
        console.log("resp to filter err",err);
      }
    );
  }
  getFilteredOrders(infiniteScroll?){
    var currentDate = new Date().toLocaleDateString();
    console.log("current date",currentDate);
    console.log("to: ",this.to);
    console.log("from: ",this.from);
    if(infiniteScroll){
      infiniteScroll.complete();
    }
    this.service.filterOrder(this.from,this.to,this.accessToken,this.page,this.helper).subscribe(
      resp=>{
        console.log("resp to filter resp",resp);

        console.log("getUserOrders resp: ",resp);
        var ordersData =JSON.parse(JSON.stringify(resp)).orders;
        
        this.ordersArray= [];
        this.ordersArray = ordersData;
        console.log("orders: ",ordersData);
         for(var j=0;j<ordersData.length;j++){
           console.log("status ",ordersData[j].status);
           
           if(ordersData[j].status == "3"){
            ordersData[j].color = "red";
            ordersData[j].desc = this.translate.instant("no_respond")
           }
          else if(ordersData[j].status == "4"){
            ordersData[j].color = "red";
            ordersData[j].desc = this.translate.instant("patient_cancel")
           }
           else if(ordersData[j].status == "0" ){
            ordersData[j].color = "green";
            ordersData[j].desc = "متابعة"
           }
         else if(ordersData[j].status == "11" || ordersData[j].status == "10" ){
            ordersData[j].color = "red";
            ordersData[j].desc = this.translate.instant("canceled_order")
         } //canceled by doctor
          
         else if(ordersData[j].status == "5" || ordersData[j].status == "6") {
           ordersData[j].color="grey";
           ordersData[j].desc = this.translate.instant("finishing_order")
         }
           else if(ordersData[j].status == "1" || ordersData[j].status == "2" || ordersData[j].status == "7" || ordersData[j].status == "8"  || ordersData[j].status == "13")
           {
             ordersData[j].color="green";
             ordersData[j].desc = this.translate.instant("running_order")
           }
           else if(ordersData[j].status == "12"){
            ordersData[j].color="yellow";
            ordersData[j].desc = this.translate.instant("waiting_order")
           }
            console.log("order id:", ordersData[j].id);
                  var patient = ordersData[j].patient
                  this.orderobject.name = patient.name;
                  if(patient.user_info.address == "" || patient.user_info.address == "--"){
                    this.orderobject.patient_address = patient.user_info.address_map
                  }
                  else{
                    this.orderobject.patient_address = patient.user_info.address
                  }
                  if(ordersData[j].patient_address){
                    this.orderobject.patient_address = ordersData[j].patient_address
                  }
                  this.orderobject.profile_pic = patient.profile_pic;
                  for(let m=0;m<ordersData[j].ratings.length;m ++){
                    if(ordersData[j].ratings[m].service_profile_id != this.helper.userId){
                      this.orderobject.rate = ordersData[j].ratings[m].rate
                    }
                  }
                  if(this.orderobject.rate == ""){
                    this.orderobject.rate = '0'
                  }
                  
                  this.orderobject.color = ordersData[j].color;
                  this.orderobject.desc = ordersData[j].desc;
                  this.orderobject.reorder = ordersData[j].reorder;
                  this.orderobject.rated = ordersData[j].rated;
                  this.orderobject.status = ordersData[j].status;
                  this.orderobject.orderId = ordersData[j].id;
                  this.orderobject.order_status = ordersData[j].status;
                  this.orderobject.created_at = ordersData[j].created_at_new
                  this.data.push(this.orderobject);
                  this.orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
                  "name":"","profile_pic":"","rate":"","patient_id":"",
                  "custom_date":"","date_id":"","patient_address":"","status":"","created_at":"","desc":"","service_id":"","serviceTitle":""};
            //         }

            // }

         }
         if(this.data.length == 0)
         {
           this.presentToast(this.translate.instant("noOrders"));
         }
        
      },err=>{
        console.log("resp to filter err",err);
      }
    );
  }
  ionViewWillEnter() {
    console.log("will enter get orders")
    this.cancelTxt = this.translate.instant("canceltxt");
    this.doneTxt = this.translate.instant("doneTxt");
    this.data = []
    this.from = ""
    this.to = ""
    this.page = 1
    this.noData = false
    this.getOrders();


    this.storage.get('type').then(val => {
      this.userTypeId = val;
      console.log("type id: "+this.userTypeId);
    })

  }
  followOrder(item){
    console.log("follow item ",item);
    console.log("data length: ", this.data.length);
    console.log("ordersArray: ",this.ordersArray);
    /*
      1 started 
      2 accepted by doctor 
      0 cancelled by doctor
      3 no respond 
      5 finished
      6 finshed with reorder
      7 start detection
      8 move to paient 
    */
if(item.order_status == 13 ||item.order_status == 12 || item.order_status == 1 || item.order_status==8 || item.order_status ==7 || item.order_status == 2 || item.order_status == 0 || item.order_status == 16)
{
  //alert()
 // this.storage.set("recievedNotificat",item.orderId ).then(()=> {
  if(this.helper.userType == 0){
    this.helper.updateBusy(1)
  }
    this.storage.get('type').then(val => {
      if (val == 1) {
        this.navCtrl.push(PharmacyOrderPage, {recievedNotificat : item.orderId})
      }
      else if (val == 2) {
        this.navCtrl.push(CenterOrderPage, {recievedNotificat : item.orderId})
      }
      else if (val == 3) {
        this.navCtrl.push(CenterOrderPage, {recievedNotificat : item.orderId})
      }
      else if (val == 0) {
        this.navCtrl.push(NeworderPage, {recievedNotificat : item.orderId})
      }
      else if (val == 5) {

        //ayaaaa
        if(item.order_status != 16) {
          this.navCtrl.push("NursingOrderPage", {recievedNotificat : item.orderId})
        } else {
          console.log("new nursing page");
          this.navCtrl.push("LongTimeNursingOrderPage", {recievedNotificat : item.orderId});
        }
      }
    })
 // })
}
}
  doRefresh(ev){
    console.log("refresh",ev);
    ev.complete();
    this.refresher = ev;
    this.data = []
    this.noData = false
    this.page = 1
    if(this.from != "" || this.to != ""){
      this.getFilteredOrders()
    }
    else{
      this.getOrders();
    }
    
    
  }
  rateagain(item){
    console.log("item from rate function ",item);
    this.navCtrl.push("PatientreviewPage",{patient_id:item.patient_id,
      orderId:item.orderId});

  }
  reorder(item){
    console.log("item from reorder",item);
    this.presentConfirm(item);
  }

  presentConfirm(item) {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("confirmReorder"),
      message: this.translate.instant("confirmReorderMsg"),
      buttons: [
        {
          text: this.translate.instant("disagree"),
          role: 'cancel',
          handler: () => {
            console.log('disagree clicked');
          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('confirm reorder agree clicked');
            this.service.reorder(item.orderId,item.custom_date,item.date_id,this.accessToken).subscribe(
              resp=>{
                console.log("reorder resp",resp);
                this.presentToast( this.translate.instant("sendReorder"));
              },
              err=>{
                console.log("reorder err",err);
              }
            );            
          }
        }
      ]
    });
    alert.present();
  }
  loadMore(infiniteScroll) {
    setTimeout(() => {
    if(this.page > 0){
      this.page++;
      if(this.from != "" || this.to != ""){
        this.getFilteredOrders(infiniteScroll)
      }
      else{
        this.getOrders(infiniteScroll);
      }
    }
    else{
      this.helper.presentToast(this.translate.instant('noMoreData'))
      infiniteScroll.complete()
    }
    
  }, 500);
    // if (this.page == this.maximumPages) {
    //   infiniteScroll.enable(false);
    // }
  }


  sendReport(item){
    console.log("sendReport(item) : ",item)
// ReportForLabsOrCentersPage 

    this.navCtrl.push("ReportForLabsOrCentersPage", {recievedItem : item})
 
  }
}
