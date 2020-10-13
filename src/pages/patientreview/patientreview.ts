import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController} from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the PatientreviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-patientreview',
  templateUrl: 'patientreview.html',
})
export class PatientreviewPage {
  lang_direction= "";
  ratingStatus;
  userImageUrl;
  userName;
  userAddress;
  accessToken;
  rateArray=[];
  rateDesc = ""
  rate;
  review;
  moreReview = "";
  patient_id;
  orderID;
  ratingStatrs = []
  selectedIDs = []
  showEnhance = false
  note=this.translate.instant("notes");

  constructor(public toastCtrl: ToastController, public loginservice: LoginServiceProvider, 
    public navCtrl: NavController, public navParams: NavParams, public helper: HelperProvider,
    public storage: Storage, public translate: TranslateService) {
     this.orderID = navParams.get('orderId')
     this.patient_id = navParams.get('patient_id')
      this.lang_direction = this.helper.lang_direction;
      this.storage.get('user_login_token').then(data=>{
        this.accessToken = data.access_token;
        console.log("access token",this.accessToken);

      });
      this.storage.set("openReview",0)    
  }

  ratePatient(item){
    this.showEnhance = true
    this.ratingStatus = item.ratingStatus;
    console.log("rate ",JSON.stringify(item));
    this.rate = item.ratingStatus;
    if(item.ratingStatus == "5"){
      this.note=this.translate.instant("thanks");
    }else{
      this.note=this.translate.instant("notes");
    }
    // if(this.lang_direction == 'ltr'){
      this.rateDesc = item.value
    // }
    // else{
    //   this.rateDesc = item.translation.value
    // }
    this.loginservice.rateCriteriea(item.id,this.accessToken,this.helper.userType).subscribe(
      resp=>{
        console.log("res from rate ",resp);
        var rateCriteriea = JSON.parse(JSON.stringify(resp));
        
        this.rateArray=[];
        for(var i=0;i<rateCriteriea.length;i++){
          // if(this.lang_direction === 'ltr'){ 
           
            this.rateArray.push({id:rateCriteriea[i].id,value:rateCriteriea[i].value,status:0});
          // }
          // else{
            
          //   this.rateArray.push({value:rateCriteriea[i].translation.value,status:0});
          // }
          
        }
      },
      err=>{
        console.log("err from rate ",err);
      });
  }

  reviewClicked(event,item){
   
    // this.review += " ";
    // if( event.target.innerText){
    // this.review += event.target.innerText;
    // }
    if(item.status == 0)
    {
      event.target.classList.remove('unselected');
      event.target.classList.add('selected');
      item.status = 1 ;
    }else{
      event.target.classList.remove('selected');
      event.target.classList.add('unselected');
      item.status = 0;
    }
  }

  sendRate(){
    console.log("rateArray " + JSON.stringify(this.rateArray))
    let selectedObj = this.rateArray
    selectedObj = selectedObj.filter((item) => {
      return (item.status == 1);
    })
    console.log(JSON.stringify(selectedObj))
    let selectedIDs = []
    selectedObj.forEach(element => {
      selectedIDs.push(element.id)
    });
    console.log("selectedIDs "+selectedIDs.toString())
    var myid
    this.storage.get('user_login_info').then(data=>{
      myid = data.id;
      
      
    this.review = this.moreReview;
    if(!this.rate){
      this.helper.presentToast(this.translate.instant("selectReview"))
      return;
    }
    
    this.loginservice.rateUser(this.patient_id,this.rate,this.review,myid,this.orderID, selectedIDs,this.accessToken).subscribe(
      resp=>{
        console.log("resp from rate :",resp); 
        this.storage.remove("orderID")
        this.storage.remove("recievedNotificat").then(()=> {
          if(this.helper.userType == 0){
          this.helper.updateBusy(0)
          }
          this.presentToast(this.translate.instant("reviewSent"));
        this.navCtrl.setRoot(TabsPage);
        })
      },err=>{
        console.log("err from rate: ",err);
        this.presentToast(this.translate.instant("serverError"))
      }
    );
    
    
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientreviewPage');
    if(navigator.onLine){
     // alert(this.patient_id)
     this.storage.get('type').then(val => {
       this.loginservice.getRate(this.helper.currentLang,val,(data)=>{
       if(data.length > 0){
         for(let x=0;x< data.length;x++){
           data[x].ratingStatus = x+1
         }
       }
       this.ratingStatrs = data
     }, (data)=>{})
    
     })
     
      if(navigator.onLine){
      this.loginservice.getUser(this.patient_id, (data)=>{
        console.log(JSON.stringify(data))
        let userData = JSON.parse(JSON.stringify(data)).user;
        this.userImageUrl = userData.profile_pic;
        this.userName = userData.name;
        if(userData.extraInfo.address != "" && userData.extraInfo.address != "--"){
        this.userAddress = userData.extraInfo.address;
        }
        else{
          this.userAddress = userData.extraInfo.address_map
        }
      } , (data)=> {
        console.log("err from getUser",data);
      })
    }
    else{
      this.presentToast(this.translate.instant("serverError"))
    }
    }
    else{
      this.presentToast(this.translate.instant("serverError"))
    }
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

}
