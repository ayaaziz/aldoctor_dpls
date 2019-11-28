import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';

import { HelperProvider } from '../../providers/helper/helper';

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  accessToken;
  helpersArr=[];
  from
  title

  constructor(public viewCtrl : ViewController,public service:LoginServiceProvider,
    public navCtrl: NavController, public navParams: NavParams,
    public helper: HelperProvider) {
      
      // this.helper.view = "pop";
      this.accessToken = localStorage.getItem('kdkvfkhggsso');

      this.from = this.navParams.get("from")
      console.log("modal from : ",this.from)
      // specialization , 
      if(this.from == "specialization")
        this.title = "استشارات طبية"
      else if(this.from == "medicalConsultant")
        this.title = "استشارات طبية"
      else if(this.from == "customerService")
        this.title = "خدمة عملاء"
        
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
   if (this.from == "customerService")
      this.customerService()
  }

  closeModal(){
    this.viewCtrl.dismiss();  
  }


  customerService(){
    // this.service.getuserProfile(this.accessToken).subscribe(
    //   resp=>{
    //     console.log("resp from getuserProfile ",resp);
    //     console.log("city_id",JSON.parse(JSON.stringify(resp)).extraInfo.city_id);
        this.service.getCustomerService("null",this.accessToken).subscribe(
          resp=>{
            console.log("resp from getHelperTelephones from modal",resp);
            this.helpersArr = JSON.parse(JSON.stringify(resp))[0].value.split(",");
      
            for(var i=0;i<this.helpersArr.length;i++){
              console.log("this.helpersArr[i].length : ",this.helpersArr[i].length)
              if(this.helpersArr[i].length == 11)
                this.helpersArr[i] = "2"+this.helpersArr[i]
                // else if(this.helpersArr[i].length == 12)
                // this.helpersArr[i] = "+"+this.helpersArr[i]
                if(this.helpersArr[i].length > 12){
                  if(this.helpersArr[i].charAt(0) == "+")
                    this.helpersArr[i] = this.helpersArr[i].substr(1)
                }

            }
      
      
      
          },
          err=>{
            console.log("errfrom getHelperTelephones",err);
          });
   
          
      // }
      // ,err=>{
      //   console.log("can't getuserProfile ",err);
      // });
   
  }



  
}
