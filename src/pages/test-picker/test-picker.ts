import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController, ToastController, Platform, Events } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { parseDate } from 'ionic-angular/util/datetime-util';
import { DatePipe } from '@angular/common';
import { checkNoChangesNode } from '@angular/core/src/view/view';

import { DatePicker } from '@ionic-native/date-picker';
import { HelperProvider } from '../../providers/helper/helper';
import { Content } from 'ionic-angular';

import * as Moment from 'moment';

/**
 * Generated class for the TestPickerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-picker',
  templateUrl: 'test-picker.html',
  providers:[DatePipe,DatePicker]
})
export class TestPickerPage {

  @ViewChild(Content) content: Content;

  lang_direction = "";

  sat_First_From = "";
  sat_First_To = "";
  sat_Second_From = "";
  sat_Second_To = "";


  sun_First_From = "";
  sun_First_To = "";
  sun_Second_From = "";
  sun_Second_To = "";

  mon_First_From = "";
  mon_First_To = "";
  mon_Second_From = "";
  mon_Second_To = "";

  tue_First_From = "";
  tue_First_To = "";
  tue_Second_From = "";
  tue_Second_To = "";

  wed_First_From = "";
  wed_First_To = "";
  wed_Second_From = "";
  wed_Second_To = "";

  thr_First_From = "";
  thr_First_To = "";
  thr_Second_From = "";
  thr_Second_To = "";

  fri_First_From = "";
  fri_First_To = "";
  fri_Second_From = "";
  fri_Second_To = "";


  satChecked = false
  sunChecked = false
  monChecked = false
  tueChecked = false
  wedChecked = false
  thrChecked = false
  friChecked = false


  objerr
  errTXt

  savebtnClicked = false

  ErrorExist = []
  errorFlag = false

  todayTime 

  @ViewChild('datePicker') datePicker2;
  dataInicial: Date;
  days = []
  day
  from
  to

  
  role_id: any;
  center_id: any;
  weekDays: any[] = [];
  numberOfHours:number = 2;

  mendata

  mindate

  MyCustomColor = "22";


  @ViewChild('changeTime') changeDateTime;

  constructor(private datePicker: DatePicker,public helper: HelperProvider,public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,
    public loginServiceProvider: LoginServiceProvider, public translate: TranslateService, public toastController: ToastController,
    public platform: Platform, public storage: Storage, public datepipe: DatePipe, public events: Events) {

      this.lang_direction = this.helper.lang_direction;
      this.todayTime  = new Date().toLocaleString()
      console.log("today : ",this.todayTime) 
this.mindate = new Date().toLocaleString()
       
console.log("myTime : ",new Date().getHours() + ":"+new Date().getMinutes())

      this.listWorkingDays()

 
// this.days = [
//   [{day:"السبت"},[this.sat_First_From ,  this.sat_First_To],[this.sat_Second_From,this.sat_Second_To]],
//   [{day:"الأحد"},[this.sun_First_From ,  this.sun_First_To],[this.sun_Second_From,this.sun_Second_To]],
//   [{day:"الأثنين"},[this.mon_First_From ,  this.mon_First_To],[this.mon_Second_From,this.mon_Second_To]],
//   [{day:"الثلاثاء"},[this.tue_First_From ,  this.tue_First_To],[this.tue_Second_From,this.tue_Second_To]],
//   [{day:"الأربعاء"},[this.wed_First_From ,  this.wed_First_To],[this.wed_Second_From,this.wed_Second_To]],
//   [{day:"الخميس"},[this.thr_First_From ,  this.thr_First_To],[this.thr_Second_From,this.thr_Second_To]],
//   [{day:"الجمعة"},[this.fri_First_From ,  this.fri_First_To],[this.fri_Second_From,this.fri_Second_To]]

//   ]
      
var offset = new Date().getTimezoneOffset();
      this.numberOfHours = offset/-60;
      console.log(offset + ' = ' + this.numberOfHours);
    this.center_id = this.navParams.get('centerid');
    this.storage.get("role_id").then((val) => {
      this.role_id = val;
    });
    //
    if (this.center_id) {
      // this.loginServiceProvider.getCenterWorkTimes(this.center_id,
      //   (data) => {
      //     console.log(data);
      //     this.weekDays = JSON.parse(data).data
      //     //
      //     console.log(this.weekDays);
      //     for (var i = 0; i < this.weekDays.length; i++) {
      //       if (parseInt(this.weekDays[i].open_status) == 1) {
      //         this.weekDays[i].open_status = false;
      //       }
      //       if (parseInt(this.weekDays[i].open_status) == 0) {
      //         this.weekDays[i].open_status = true;
      //       }
      //       //
      //       var dateIn = new Date().toISOString();
      //       //
      //       if (this.weekDays[i].open_in) {
      //         if (this.weekDays[i].open_in.indexOf(':') >= 0) {
      //           var arrTimesIn = this.weekDays[i].open_in.split(':');
      //           this.weekDays[i].open_in = arrTimesIn[0];
      //           this.weekDays[i].open_minute_in = arrTimesIn[1].split(' ')[0];
      //           //
      //           let checktime: number = parseInt(arrTimesIn[0]);
      //           console.log(arrTimesIn[1].split(' ')[1]);
      //           console.log(checktime);
      //           if(arrTimesIn[1].split(' ')[1] == 'PM')
      //           {
      //             if(checktime == 12){}
      //             else if(checktime == 0){
      //               checktime = 12;
      //             }
      //             else{
      //               checktime = checktime + 12;
      //             }
      //           }
      //           else{
      //             if(checktime == 12){
      //               checktime = 0;
      //             }
      //           }
      //           //
      //           checktime = checktime + this.numberOfHours;
      //           console.log(checktime);
      //           dateIn = new Date(2018, 7, 5, checktime, arrTimesIn[1].split(' ')[0]).toISOString();
      //         }
      //         else {
      //           this.weekDays[i].open_minute_in = '00';
      //           dateIn = new Date(2018, 7, 5, 9, 0).toISOString();
      //         }
      //       }
      //       //
      //       this.weekDays[i].open_in = dateIn;
      //       //
      //       var dateOut = new Date().toISOString();
      //       if (this.weekDays[i].open_out) {
      //         if (this.weekDays[i].open_out.indexOf(':') >= 0) {
      //           var arrTimesOut = this.weekDays[i].open_out.split(':');
      //           this.weekDays[i].open_out = arrTimesOut[0];
      //           this.weekDays[i].open_minute_out = arrTimesOut[1].split(' ')[0];
      //           //
      //           let checktime: number = parseInt(arrTimesOut[0]);
      //           console.log(arrTimesOut[1].split(' ')[1]);
      //           console.log(checktime);
      //           if(arrTimesOut[1].split(' ')[1] == 'PM')
      //           {
      //             if(checktime == 12){}
      //             else if(checktime == 0){
      //               checktime = 12;
      //             }
      //             else{
      //               checktime = checktime + 12;
      //             }
      //           }
      //           else{
      //             if(checktime == 12){
      //               checktime = 0;
      //             }
      //           }
      //           //
      //           checktime = checktime + this.numberOfHours;
      //           console.log(checktime);
      //           dateOut = new Date(2018, 7, 5, checktime, arrTimesOut[1].split(' ')[0]).toISOString();
      //         }
      //         else {
      //           this.weekDays[i].open_minute_out = '00';
      //           dateOut = new Date(2018, 7, 5, 19, 0).toISOString();
      //         }
      //       }
      //       //
      //       this.weekDays[i].open_out = dateOut;
      //       //
      //     }
      //     console.log(this.weekDays);
      //     //console.log(data);
      //     //console.log(JSON.parse(data).data);
      //   },
      //   (error) => {
      //     console.log(error);
      //     console.log(error.error);
      //   }
      // );
    }

    ///ayaaaaaaaa test picker
    // events.publish('pickerDisplayed', () => {
    //   var el = document.getElementsByClassName("picker-wrapper");
    //   if(el) {
    //     console.log("eleeeeement picker: "+el);
    //   }

    // });



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkingDaysPage');
    // this.changeDateTime.updateText = () => {};
  }

  selectedDate
  myDate
  date(){
    console.log("selected date......."+ Moment( this.selectedDate._d).locale('en').format('YYYY-MM-DD HH:mm:ss'))
    this.myDate= Moment( this.selectedDate._d).locale('en').format('YYYY-MM-DD HH:mm:ss')
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
  //
  updateWorkTimes() {
    //
    if (navigator.onLine) {
      var modifiedList = [];
      for (var i = 0; i < this.weekDays.length; i++) {
        //if (this.weekDays[i].open_status.toString() == 'true') {
        //  this.weekDays[i].open_status = 0;
        //}
        //if (this.weekDays[i].open_status.toString() == 'false') {
        //  this.weekDays[i].open_status = 1;
        //}
        if (!this.weekDays[i].open_minute_in) { this.weekDays[i].open_minute_in = '00'; }
        if (!this.weekDays[i].open_minute_out) { this.weekDays[i].open_minute_out = '00'; }
        //
        //if (parseInt(this.weekDays[i].open_minute_in) < 0 || parseInt(this.weekDays[i].open_minute_in) > 59 || parseInt(this.weekDays[i].open_minute_out) < 0 || parseInt(this.weekDays[i].open_minute_out) > 59) {
        //  const toast = this.toastController.create({
        //    message: this.translate.instant('msgMinutesLimit'),
        //    duration: 3000
        //  });
        //  toast.present();
        //  return;
        //}
        let inAmPm: string = "";
        let outAmPm: string = "";
        console.log('In: ' + parseInt(this.datepipe.transform(this.weekDays[i].open_in, 'HH')));
        if(parseInt(this.datepipe.transform(this.weekDays[i].open_in, 'HH')) - this.numberOfHours > 11){
          inAmPm = 'PM';
        }
        else{
          inAmPm = 'AM';
        }
        console.log('Out: ' + parseInt(this.datepipe.transform(this.weekDays[i].open_out, 'HH')));
        if(parseInt(this.datepipe.transform(this.weekDays[i].open_out, 'HH')) - this.numberOfHours > 11){
          outAmPm = 'PM';
        }
        else{
          outAmPm = 'AM';
        }
        //
        if(parseInt(this.datepipe.transform(this.weekDays[i].open_out, 'HH')) - this.numberOfHours < 0){
          outAmPm = 'PM';
        }
        if(parseInt(this.datepipe.transform(this.weekDays[i].open_in, 'HH')) - this.numberOfHours < 0){
          inAmPm = 'PM';
        }
        //
        let check12In:number=0;
        if((parseInt(this.datepipe.transform(this.weekDays[i].open_in, 'hh')) - this.numberOfHours) == -1){
          check12In = 11;
        }
        else if((parseInt(this.datepipe.transform(this.weekDays[i].open_in, 'hh')) - this.numberOfHours) == -2){
          check12In = 10;
        }
        else if((parseInt(this.datepipe.transform(this.weekDays[i].open_in, 'hh')) - this.numberOfHours) == 0){
          check12In = 12;
        }
        else{
          check12In = (parseInt(this.datepipe.transform(this.weekDays[i].open_in, 'hh')) - this.numberOfHours);
        }
        //
        let check12Out:number=0;
        if((parseInt(this.datepipe.transform(this.weekDays[i].open_out, 'hh')) - this.numberOfHours) == -1){
          check12Out = 11;
        }
        else if((parseInt(this.datepipe.transform(this.weekDays[i].open_out, 'hh')) - this.numberOfHours) == -2){
          check12Out = 10;
        }
        else if((parseInt(this.datepipe.transform(this.weekDays[i].open_out, 'hh')) - this.numberOfHours) == 0){
          check12Out = 12;
        }
        else{
          check12Out = (parseInt(this.datepipe.transform(this.weekDays[i].open_out, 'hh')) - this.numberOfHours);
        }
        //
        modifiedList.push(
          {
            "opening_day": this.weekDays[i].opening_day,
            "open_status": this.weekDays[i].open_status.toString() == 'true' ? 0 : 1,
            "open_in": check12In + ':' + this.datepipe.transform(this.weekDays[i].open_in, 'mm') + ' ' + inAmPm,  //+ ":" + this.weekDays[i].open_minute_in,
            "open_out": check12Out + ':' + this.datepipe.transform(this.weekDays[i].open_out, 'mm') + ' ' + outAmPm //this.weekDays[i].open_out + ":" + this.weekDays[i].open_minute_out
          });
      }
      //console.log(JSON.stringify(modifiedList));
      //

      // this.loginServiceProvider.updateCenterWorkTimes(this.center_id, this.role_id, JSON.stringify(modifiedList),
      //   (data) => {
      //     console.log(data);
      //     if (data.status == 1 || JSON.parse(data).status == 1) {
      //       this.dismiss();
      //       const toast = this.toastController.create({
      //         message: this.translate.instant('msgSaved'),
      //         duration: 3000
      //       });
      //       toast.present();
      //     }
      //   },
      //   (err) => {
      //     console.log(err);
      //     console.log(err.error);
      //   }
      // );
    }
    else {
      const toast = this.toastController.create({
        message: this.translate.instant('msgNoInternetConnection'),
        duration: 3000
      });
      toast.present();
    }
  }

  finderror = false

  save(){
    console.log("save ")
  
    this.ErrorExist = []
var errarray = []

for(var x=0;x<this.days.length;x++){
  var i = this.days[x]

  i[0].err = ""
}
// this.errTXt = ""
    // for(var i=0 ;i<.length;i++){
      for(var x=0;x<this.days.length;x++){
        var i = this.days[x]
        console.log("day i : ",i)
      // }
  // this.days.forEach( (i,index) => {
    // console.log("i = ",i ,"index : ",index)
    if(i[0].checked == true && i[1][0] && !i[1][1]){
      // this.helper.presentToast("الرجاء إدخال الوقت إلى")
      this.ErrorExist.push("err detect")
      this.errorFlag = true
      this.objerr = i 
      this.errTXt = "الرجاء إدخال الوقت إلى"
      console.log("11 i err : ",i , "error :الرجاء إدخال الفترة إلى" )
      // break;
      i[0].err = this.errTXt
      errarray.push(i)
    }
    else if(i[0].checked == true && i[1][1] && !i[1][0]  ){
      // this.helper.presentToast("الرجاء إدخال الوقت من")
      this.ErrorExist.push("err detect")
      this.errorFlag = true
      this.objerr = i 
      this.errTXt = "الرجاء إدخال الوقت من"
      // break;
      i[0].err = this.errTXt
      errarray.push(i)
    }
    else if( i[0].checked == true && i[1][0] && i[1][1] ){
      if(i[1][0] > i[1][1]){
        // this.helper.presentToast("الوقت من يجب أن لا يسبق الوقت إلى")
        this.ErrorExist.push("err detect")
        this.errorFlag = true
        this.objerr = i 
        this.errTXt = "الوقت من يجب أن لا يسبق الوقت إلى"
        // break;
        i[0].err = this.errTXt
        errarray.push(i)
      }
      else if(i[1][0] == i[1][1]){
        // this.helper.presentToast("الوقت من يجب أن لا يساوى الوقت إلى")
        this.ErrorExist.push("err detect")
        this.errorFlag = true
        this.objerr = i 
        this.errTXt = "الوقت من يجب أن لا يساوى الوقت إلى"
        // break;
        i[0].err = this.errTXt
        errarray.push(i)
      }
      else{
        this.ErrorExist.pop()
        this.errorFlag = false
        this.objerr = i 
        this.errTXt = ""
        // i[0].err = this.errTXt
      }
    }else{
      this.ErrorExist.pop()
      this.errorFlag = false
      this.objerr = i 
      this.errTXt = ""
      // i[0].err = this.errTXt
    }



      if(i[0].checked == true && i[2][0] && !i[2][1]){
        // this.helper.presentToast("الرجاء إدخال الوقت إلى")
        this.ErrorExist.push("err detect")
        this.errorFlag = true
        console.log("22 i err : ",i , "error :الرجاء إدخال الفترة إلى" )
        this.objerr = i 
        this.errTXt = "الرجاء إدخال الوقت إلى"
        // break;
        i[0].err = this.errTXt
        errarray.push(i)
      }
      else if(i[0].checked == true && i[2][1] && !i[2][0]  ){
        // this.helper.presentToast("الرجاء إدخال الوقت من")
        this.ErrorExist.push("err detect")
        this.errorFlag = true
        this.objerr = i 
        this.errTXt = "الرجاء إدخال الوقت من"
        // break;
        i[0].err = this.errTXt
        errarray.push(i)
      }
      else if(i[0].checked == true && i[2][0] && i[2][1] ){
        if(i[2][0] > i[2][1]){
          // this.helper.presentToast("الوقت من يجب أن لا يسبق الوقت إلى")
          this.ErrorExist.push("err detect")
          this.errorFlag = true
          this.objerr = i 
          this.errTXt = "الوقت من يجب أن لا يسبق الوقت إلى"
          // break;
          i[0].err = this.errTXt
          errarray.push(i)
        }
        else if(i[2][0] == i[2][1]){
          // this.helper.presentToast("الوقت من يجب أن لا يساوى الوقت إلى")
          this.ErrorExist.push("err detect")
          this.errorFlag = true
          this.objerr = i 
          this.errTXt = "الوقت من يجب أن لا يساوى الوقت إلى"
          // break;
          i[0].err = this.errTXt
          errarray.push(i)
        }
          else{
            this.ErrorExist.pop()
            this.errorFlag = false
            this.objerr = i 
            this.errTXt = ""
            // i[0].err = this.errTXt
          }
      }else{
        this.ErrorExist.pop()
        this.errorFlag = false
        this.objerr = i 
        this.errTXt = ""
        // i[0].err = this.errTXt
      }



    // })
  }

    // console.log("this.sat_First_From",this.sat_First_From)
    // if(this.sat_First_From && !this.sat_First_To)
    //   this.helper.presentToast("الرجاء إدخال الفترة إلى")
    // else if(this.sat_First_To && !this.sat_First_From  )
    //   this.helper.presentToast("الرجاء إدخال الفترة من")
    // else if(this.sat_First_From && this.sat_First_To )
    //   if(this.sat_First_From > this.sat_First_To)
    //     this.helper.presentToast("الفترة من يجب أن لا تسبق الفترة إلى")
    //   else if(this.sat_First_From == this.sat_First_To)
    //     this.helper.presentToast("الفترة من يجب أن لا تساوى الفترة إلى")
      
    // var daysArray = []
    // var satArray = []
    // satArray.push([this.sat_First_From,this.sat_First_To])
    // satArray.push([this.sat_Second_From,this.sat_Second_To])
    // daysArray.push(satArray)
    // console.log("days Array ", daysArray)
   

    this.finderror = false
if(this.errorFlag == true){
  console.log("if(this.errorFlag == true)")
  // this.objerr 
        // this.errTXt 
        for(var x=0;x<this.days.length;x++){
          var i = this.days[x]

          // console.log("error obj ",this.objerr )
          // console.log("i obj ",i )

          if (i[0].day == this.objerr[0].day){
            i[0].err = this.errTXt
            this.finderror = true
// break;
          }else{
            i[0].err = ""
          }
        }

}
console.log("errarray : ",errarray)
console.log("this.days : ",this.days)
    // if(this.ErrorExist.length == 0 ){
      // if(this.finderror == false){
        if(errarray.length <= 0){
      console.log("call api to save times")
      this.savebtnClicked = true
    
console.log("this.days : ",this.days)

this.storage.get("user_login_info").then((val) => {
  console.log("val from storage enter : ",val)
        if (val != null) {
          var xarray = []
          this.days.forEach( (i,index) => {
            console.log("i = ", i)
            if (i[0].checked == false)
            {
              i[1][0] = ""
              i[1][1]= ""
              i[2][0] =""
              i[2][1] = ""
            }
            xarray.push([[i[1][0],i[1][1]],[i[2][0],i[2][1]]])
          });
          console.log("xarray : ",xarray)
          this.loginServiceProvider.addWorkingDays(val.id,xarray).subscribe(
            resp=>{
              console.log("resp from addWorkingDays",resp);
          if(JSON.parse(JSON.stringify(resp)).success ==  true){
            this.helper.presentToast("تم الحفظ")
            this.navCtrl.pop()
          }else{
            this.helper.presentToast("حدث خطأ ما ")
          }
             
              
          
          
            },
            err=>{
              console.log("errfrom addWorkingDays",err);
            });
       
       

}
})

}else{
  console.log("scroll content")
  this.content.scrollToTop()
}


  }

  doRefresh(ev){
    ev.complete();
    this.listWorkingDays();
  }
listWorkingDays(){
  this.storage.get("user_login_info").then((val) => {
    console.log("val from storage enter : ",val)
          if (val != null) {

  this.loginServiceProvider.listWorkingDays(val.id).subscribe(resp=>{
    console.log("resp from listworkingdays : ",resp)
    var respdata =  JSON.parse(JSON.stringify(resp))
    if(respdata.workingDays )
    {
      console.log("working days : ",respdata.workingDays)

      
      var sunarr = respdata.workingDays[0]; //sunday
      console.log("sunarr[0][0] : ",sunarr[0][0])
      if(sunarr[0].length > 0){
        if(sunarr[0][0] != "00:00")
          this.sun_First_From = sunarr[0][0];
        if(sunarr[0][1] != "00:00")
          this.sun_First_To = sunarr[0][1];
      }else{
        console.log("sun from")
        this.sun_First_From = ""
        this.sun_First_To = "" 
      }
      if(sunarr[1].length > 0){
        if(sunarr[1][0] != "00:00")
          this.sun_Second_From = sunarr[1][0];
        if(sunarr[1][1] != "00:00")
          this.sun_Second_To = sunarr[1][1];}
      else{
        console.log("sun from2")
        this.sun_Second_From = "" 
        this.sun_Second_To = ""
      }

      if (this.sun_First_From == "" && this.sun_First_To == "" && this.sun_Second_From == "" && this.sun_Second_To == "") 
      {
        this.sunChecked = false
      }
      else{
        this.sunChecked = true
      }


      var monarr = respdata.workingDays[1];
      if(monarr[0].length > 0){
        if(monarr[0][0] != "00:00")
          this.mon_First_From = monarr[0][0]
        if(monarr[0][1] != "00:00")
          this.mon_First_To = monarr[0][1]
      }else{
        this.mon_First_From = ""
        this.mon_First_To = ""
      }
      if(monarr[1].length > 0){
         if(monarr[1][0] != "00:00")
      this.mon_Second_From = monarr[1][0]
       if(monarr[1][1] != "00:00")
      this.mon_Second_To = monarr[1][1]
      }else{
        this.mon_Second_From = ""
        this.mon_Second_To = ""
      }

      if (this.mon_First_From == "" && this.mon_First_To == "" && this.mon_Second_From == "" && this.mon_Second_To == "") 
      {
        this.monChecked = false
      }
      else{
        this.monChecked = true
      }


      var tuearr = respdata.workingDays[2];
      if(tuearr[0].length > 0){
         if(tuearr[0][0] != "00:00")
      this.tue_First_From = tuearr[0][0]
       if(tuearr[0][1] != "00:00")
      this.tue_First_To = tuearr[0][1]}else{
        this.tue_First_From = ""
      this.tue_First_To = ""
      }
      if(tuearr[1].length > 0){
          if(tuearr[1][0] != "00:00")
      this.tue_Second_From = tuearr[1][0]
        if(tuearr[1][1] != "00:00")
      this.tue_Second_To = tuearr[1][1]
      }else{
        this.tue_Second_From = ""
      this.tue_Second_To = ""
      }

      if (this.tue_First_From == "" && this.tue_First_To == "" && this.tue_Second_From == "" && this.tue_Second_To == "") 
      {
        this.tueChecked = false
      }
      else{
        this.tueChecked = true
      }


      var wedarr = respdata.workingDays[3];
      if(wedarr[0].length > 0){
        if(wedarr[0][0] != "00:00")
      this.wed_First_From = wedarr[0][0]
      if(wedarr[0][1] != "00:00")
      this.wed_First_To = wedarr[0][1]
      }else{
        this.wed_First_From = ""
        this.wed_First_To = ""
      }
      if(wedarr[1].length > 0){
        if(wedarr[1][0] != "00:00")
      this.wed_Second_From = wedarr[1][0]
      if(wedarr[1][1] != "00:00")
      this.wed_Second_To = wedarr[1][1]
      }else{
        this.wed_Second_From = ""
        this.wed_Second_To = ""
      }

      if (this.wed_First_From == "" && this.wed_First_To == "" && this.wed_Second_From == "" && this.wed_Second_To == "") 
      {
        this.wedChecked = false
      }
      else{
        this.wedChecked = true
      }


      var thrarr = respdata.workingDays[4];
      if(thrarr[0].length > 0){
         if(thrarr[0][0] != "00:00")
      this.thr_First_From = thrarr[0][0]
       if(thrarr[0][1] != "00:00")
      this.thr_First_To = thrarr[0][1]
      }else{
        this.thr_First_From = ""
        this.thr_First_To = ""
      }
      if(thrarr[1].length > 0){
           if(thrarr[1][0] != "00:00")
      this.thr_Second_From = thrarr[1][0]
         if(thrarr[1][1] != "00:00")
      this.thr_Second_To = thrarr[1][1]
      }else{
        this.thr_Second_From = ""
      this.thr_Second_To = ""
      }

      if (this.thr_First_From == "" && this.thr_First_To == "" && this.thr_Second_From == "" && this.thr_Second_To == "") 
      {
        this.thrChecked = false
      }
      else{
        this.thrChecked = true
      }

      var friarr = respdata.workingDays[5];
      if(friarr[0].length > 0){
        if(friarr[0][0] != "00:00")
      this.fri_First_From = friarr[0][0]
      if(friarr[0][1] != "00:00")
      this.fri_First_To = friarr[0][1]}else{
        this.fri_First_From = ""
      this.fri_First_To = ""
      }
      if(friarr[1].length > 0){
        if(friarr[1][0] != "00:00")
      this.fri_Second_From = friarr[1][0]
      if(friarr[1][1] != "00:00")
      this.fri_Second_To = friarr[1][1]}else{
        this.fri_Second_From = ""
        this.fri_Second_To = ""
      }

      if (this.fri_First_From == "" && this.fri_First_To == "" && this.fri_Second_From == "" && this.fri_Second_To == "") 
      {
        this.friChecked = false
      }
      else{
        this.friChecked = true
      }

      var satarr = respdata.workingDays[6];
      if(satarr[0].length > 0){
        if(satarr[0][0] != "00:00")
      this.sat_First_From = satarr[0][0];
      if(satarr[0][1] != "00:00")
      this.sat_First_To = satarr[0][1];
      }else{
        this.sat_First_From = ""
        this.sat_First_To = ""
      }
      if(satarr[1].length > 0){
        if(satarr[1][0] != "00:00")
      this.sat_Second_From = satarr[1][0];
      if(satarr[1][1] != "00:00")
      this.sat_Second_To = satarr[1][1];}else{
        this.sat_Second_From = ""
      this.sat_Second_To = ""
      }

      if (this.sat_First_From == "" && this.sat_First_To == "" && this.sat_Second_From == "" && this.sat_Second_To == "") 
      {
        this.satChecked = false
      }
      else{
        this.satChecked = true
      }

      this.days = [
     
        [{day:"الأحد",checked:this.sunChecked,err:""},[this.sun_First_From ,  this.sun_First_To],[this.sun_Second_From,this.sun_Second_To]],
        [{day:"الأثنين",checked:this.monChecked,err:""},[this.mon_First_From ,  this.mon_First_To],[this.mon_Second_From,this.mon_Second_To]],
        [{day:"الثلاثاء",checked:this.tueChecked,err:""},[this.tue_First_From ,  this.tue_First_To],[this.tue_Second_From,this.tue_Second_To]],
        [{day:"الأربعاء",checked:this.wedChecked,err:""},[this.wed_First_From ,  this.wed_First_To],[this.wed_Second_From,this.wed_Second_To]],
        [{day:"الخميس",checked:this.thrChecked,err:""},[this.thr_First_From ,  this.thr_First_To],[this.thr_Second_From,this.thr_Second_To]],
        [{day:"الجمعة",checked:this.friChecked,err:""},[this.fri_First_From ,  this.fri_First_To],[this.fri_Second_From,this.fri_Second_To]],
        [{day:"السبت",checked:this.satChecked,err:""},[this.sat_First_From ,  this.sat_First_To],[this.sat_Second_From,this.sat_Second_To]]
        ]
        console.log("this.days after list : ",this.days)
    }
  },err=>{
    console.log("err from listworkingdays : ",err)
  })
          }
        });
}

// open(x) {
//   console.log("open date picker : ",x)
//   if (!this.dataInicial) {
//       this.dataInicial =  new Date(new Date().toJSON().split('T')[0]);
//       setTimeout(() => {
//           this.datePicker.open();
//       }, 50)
//   } else {
//       this.datePicker.open();
//   }

// }
resetDay(day){
console.log("day from reset :",day)
   for(var x=0;x<this.days.length;x++){
        var i = this.days[x]
        if(i[0] == day[0])
        {
          
          i[1][0] = ""
           i[2][0] = ""
            i[1][1] = ""
             i[2][1] = ""
        }
        }
}

dateChanged(date){
  console.log("change date: ",date)

  let hourDesc = ""
  // let hours =new Date(date).getHours()
  let hours =date.split(":")[0]
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
  // this.mendata = hours + ':' + new Date(date).getMinutes() + " " + hourDesc
  this.mendata = hours + ':' + date.split(":")[1] + " " + hourDesc
console.log("time after : ",this.mendata)
}
chooseDate(i,x) {
console.log("choose date",JSON.stringify(i));
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
    localLang = 'ar_eg';
    nowTxt = 'اليوم';
    okTxt = 'تم';
    cancelTxt = 'إلغاء'
  }

  this.datePicker.show({
    date: new Date(),
    // mode: 'datetime',
    // mode: 'time',
    mode: 'date',
    minDate: minmDate,
    okText: okTxt,
    cancelText: cancelTxt,
    todayText: nowTxt,
    // locale: localLang,
    locale:'ar_eg',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
  }).then(
    date => {
      console.log("date "+date)
      if(!date){
        return
      }
      // if(new Date().valueOf() > new Date(date).valueOf()){
      //   this.helper.presentToast("من فضلك أختر تاريخ ووقت أكبر من التاريخ والوقت الحالي")
      //   return;
      // }
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
      // this.appointementDateFormated = new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getDate() + ' ' + hours + ':' + new Date(date).getMinutes() + " " + hourDesc
      // this.appointementDate = new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getDate() + ' ' + new Date(date).getHours() + ':' + new Date(date).getMinutes()
    this.mendata = hours + ':' + new Date(date).getMinutes() + " " + hourDesc

    //ayaaaaaa
    // var el = document.getElementById(i+x);
    // el.textContent = this.mendata;

    // console.log("el "+el)
    // console.log("textcontent "+el.textContent)

    
    },
    err => {
      console.log('Error occurred while getting date: ', err);

    }
  );
}
dayChecked(item){
  console.log("dayChecked : ",item)

}
handleChangeDate(changeDate: string,item) {
  console.log("item from handleChangeDate ", item)
  // this.changeDate = changeDate;
  this.changeDateTime._text = changeDate;
}





}
