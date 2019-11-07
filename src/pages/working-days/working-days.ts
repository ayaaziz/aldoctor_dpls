import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController, ToastController, Platform } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { parseDate } from 'ionic-angular/util/datetime-util';
import { DatePipe } from '@angular/common';
import { checkNoChangesNode } from '@angular/core/src/view/view';


import { HelperProvider } from '../../providers/helper/helper';


@IonicPage()
@Component({
  selector: 'page-working-days',
  templateUrl: 'working-days.html',
  providers:[DatePipe]
})
export class WorkingDaysPage {

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


  ErrorExist = []


  days = []
  day
  from
  to

  
  role_id: any;
  center_id: any;
  weekDays: any[] = [];
  numberOfHours:number = 2;

  constructor(public helper: HelperProvider,public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,
    public loginServiceProvider: LoginServiceProvider, public translate: TranslateService, public toastController: ToastController,
    public platform: Platform, public storage: Storage, public datepipe: DatePipe) {

      this.lang_direction = this.helper.lang_direction;

this.days = [
  [{day:"السبت"},[this.sat_First_From ,  this.sat_First_To],[this.sat_Second_From,this.sat_Second_To]],
  [{day:"الأحد"},[this.sun_First_From ,  this.sun_First_To],[this.sun_Second_From,this.sun_Second_To]],
  [{day:"الأثنين"},[this.mon_First_From ,  this.mon_First_To],[this.mon_Second_From,this.mon_Second_To]],
  [{day:"الثلاثاء"},[this.tue_First_From ,  this.tue_First_To],[this.tue_Second_From,this.tue_Second_To]],
  [{day:"الأربعاء"},[this.wed_First_From ,  this.wed_First_To],[this.wed_Second_From,this.wed_Second_To]],
  [{day:"الخميس"},[this.thr_First_From ,  this.thr_First_To],[this.thr_Second_From,this.thr_Second_To]],
  [{day:"الجمعة"},[this.fri_First_From ,  this.fri_First_To],[this.fri_Second_From,this.fri_Second_To]]

  ]
      
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



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkingDaysPage');
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


  save(){
    console.log("save ")
    

    // for(var i=0 ;i<.length;i++){
  this.days.forEach( (i,index) => {
    // console.log("i = ",i ,"index : ",index)
    if(i[1][0] && !i[1][1]){
      this.helper.presentToast("الرجاء إدخال الفترة إلى")
      this.ErrorExist.push("err detect")
    }
    else if(i[1][1] && !i[1][0]  ){
      this.helper.presentToast("الرجاء إدخال الفترة من")
      this.ErrorExist.push("err detect")}
    else if(i[1][0] && i[1][1] ){
      if(i[1][0] > i[1][1]){
        this.helper.presentToast("الفترة من يجب أن لا تسبق الفترة إلى")
        this.ErrorExist.push("err detect")}
      else if(i[1][0] == i[1][1]){
        this.helper.presentToast("الفترة من يجب أن لا تساوى الفترة إلى")
        this.ErrorExist.push("err detect")}
      else{
        this.ErrorExist = []
      }
    }else{
      this.ErrorExist = []
    }



      if(i[2][0] && !i[2][1]){
        this.helper.presentToast("الرجاء إدخال الفترة إلى")
        this.ErrorExist.push("err detect")}
      else if(i[2][1] && !i[2][0]  ){
        this.helper.presentToast("الرجاء إدخال الفترة من")
        this.ErrorExist.push("err detect")}
      else if(i[2][0] && i[2][1] ){
        if(i[2][0] > i[2][1]){
          this.helper.presentToast("الفترة من يجب أن لا تسبق الفترة إلى")
          this.ErrorExist.push("err detect")}
        else if(i[2][0] == i[2][1]){
          this.helper.presentToast("الفترة من يجب أن لا تساوى الفترة إلى")
          this.ErrorExist.push("err detect")}
          else{
            this.ErrorExist = []
          }
      }else{
        this.ErrorExist = []
      }



    })
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

// console.log("this.ErrorExist = ",this.ErrorExist)
//     if(this.ErrorExist.length == 0 ){
//       console.log("call api to save times")
//     }

console.log("this.days : ",this.days)

  }

}
