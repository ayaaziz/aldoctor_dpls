import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { HelperProvider } from '../helper/helper';
import 'rxjs/add/operator/timeout';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { switchMap, map } from 'rxjs/operators';

/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginServiceProvider {

  constructor( public helper: HelperProvider,public http: HttpClient, public loadingCtrl: LoadingController) {
    console.log('Hello LoginServiceProvider Provider');
  }
  getAccessToken(authSuccessCallback,authFailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
     loader.present();
    let headers = new HttpHeaders()
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');//client_credentials
    let params = new HttpParams().set('client_id', '2').set('client_secret', 'SWMX2z5hAtB7DD5l29bwZ7s3gCxmLGgp8JKX8w7p').set('grant_type', 'client_credentials');
    let serviceUrl = this.helper.serviceUrl + 'oauth/token';
    this.http.post(serviceUrl, params, { headers: headers })
    .timeout(10000)
    .subscribe(
      data => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        console.log(JSON.stringify(data))
        authSuccessCallback(data)
      },
      err => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        authFailureCallback("");
      }
    )
}
getGovernerates(lang, successCallback , failCallback){
   this.http.get(this.helper.serviceUrl+'api/get/lkps/governerates?lang='+lang).subscribe(data => successCallback(data) , err => failCallback(err))
  }
  getLabTypes(lang, successCallback , failCallback){
    this.http.get(this.helper.serviceUrl+'api/get/lkps/specialities-lab?lang='+lang).subscribe(data => successCallback(data) , err => failCallback(err))
   }
   getXrayTypes(lang, successCallback , failCallback){
    this.http.get(this.helper.serviceUrl+'api/get/lkps/specialities-xray?lang='+lang).subscribe(data => successCallback(data) , err => failCallback(err))
   }
   getNursingTypes(lang, successCallback , failCallback){
    // http://aldoctor-app.com/aldoctorfinaltest/public/api/get/lkps/specialities-nursing?lang=ar

    this.http.get(this.helper.serviceUrl+'api/get/lkps/specialities-nursing?lang='+lang).subscribe(data => successCallback(data) , err => failCallback(err))
   }


getCities(id,lang, successCallback , failCallback){
   this.http.get(this.helper.serviceUrl+'api/get/lkps/cities?governerate_id='+id+'?lang='+lang).subscribe(data => successCallback(data) , err => failCallback(err))
}

changeAvailability(availability,access_token,categoriesSuccessCallback,categoriesFailureCallback) {
  let loader = this.loadingCtrl.create({
    content: "",
  });
   loader.present();    
  let headers = new HttpHeaders();
      let parameter = new HttpParams().set('availability',availability)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/users/change-availability';
      this.http.post(serviceUrl,parameter,{headers: headers })
      
        .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 categoriesSuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          categoriesFailureCallback("-2")
        }
      )
   
    }
changePhone(phone,access_token,categoriesSuccessCallback,categoriesFailureCallback) {
  let loader = this.loadingCtrl.create({
    content: "",
  });
   loader.present();    
  let headers = new HttpHeaders();
      // let params={
      //   'email' :email,
      //   'password' :password
      // }
      let parameter = new HttpParams().set('phone',phone)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/change-phone';
      this.http.post(serviceUrl,parameter,{headers: headers })
      
        .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 categoriesSuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          categoriesFailureCallback("-2")
        }
      )
   
    }

userLogin(email,password,categoriesSuccessCallback,categoriesFailureCallback) {
  let loader = this.loadingCtrl.create({
    content: "",
  });
   loader.present();    
  let headers = new HttpHeaders();
      let params={
        'email' :email,
        'password' :password
      }
      let parameter = new HttpParams().set('email',email).set('password',password).set('app_type','1')
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded'); //.set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/login';
      this.http.post(serviceUrl,parameter,{headers: headers })
      
        .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 categoriesSuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          categoriesFailureCallback(err)
        }
      )
   
    }
    getSpecializations(access_token){
      console.log("sp:",this.helper.currentLang);
      //return this.http.get(this.helper.serviceUrl+'api/get/lkps/specialities');
      var lang = this.helper.currentLang;
      let headers = new HttpHeaders();
  
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/get/lkps/specialities?lang='+lang;
      console.log("request : ",serviceUrl);
      return this.http.get(serviceUrl,{headers: headers });
  
      
    }
    
    getTime(access_token ,dlat,dlong,plat,plong, success, fail){


      let headers = new HttpHeaders();
     
      let parameter = new HttpParams().set('patient_route',plat+","+plong).set('dpls_route',dlat+","+dlong).set('lang','ar')
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      
 
      
     //
      var lang = this.helper.currentLang;
  //key=AIzaSyCOlXpEUuoXStcUGDGXfFx_axfNfi4CkvY&language=ar
      // let serviceUrl = 'https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin='+dlat+','+dlong+'&destination='+plat+','+plong+'&language='+lang+'&key='+this.helper.key;
      let serviceUrl = this.helper.serviceUrl +'api/getDirection';
      console.log("request : ",serviceUrl);
      // this.http.get(serviceUrl).subscribe(
        this.http.post(serviceUrl,parameter,{headers: headers }).subscribe(
        data => {
          let time = data['routes'][0].legs[0].duration.text
          console.log("time data " + time)
          success(time)
      },
    err => {

    })
  
      
    }
    //get current user
    getUserOrder( access_token,SuccessCallback,FailureCallback) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let headers = new HttpHeaders();
      // let params={
      //   'email' :email,
      //   'password' :password
      // }
      
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/users/my-orders';
      this.http.get(serviceUrl,{headers: headers })
      
       .timeout(10000)
       .subscribe(
        data => {
        //   let datares = this.helper.decrypt(JSON.stringify(data)) 
        //  console.log("loggg type "+datares)
        // var fixedResponse = JSON.parse(datares.replace(/\0/g, ''));
        // console.log("lll "+ JSON.stringify(fixedResponse))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log(JSON.stringify(err))
          FailureCallback("-2")
        }
      )
   
    }
    getUserOrders(access_token,page,lang,status){
      let headers = new HttpHeaders();
      let parameter = new HttpParams().set('page',page).set('lang',lang).set('status',status)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/users/my-orders';
      return this.http.post(serviceUrl,parameter,{headers: headers });
    }
    filterOrder(after,before,access_token,page,lang){
      let headers = new HttpHeaders();
      let parameter = new HttpParams().set('page',page).set('lang',lang).set('status','1')
      // let parameter = new HttpParams().set('before','2018-06-20').
      // set('after','2018-06-20');2018-06-18,after,from=2018-06-17&before,to=2018-06-18
      
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +"api/users/my-orders?after="+after+"&before="+before;
      return this.http.post(serviceUrl,parameter ,{headers: headers });
    }
    //get current user
    getUserData(access_token,SuccessCallback,FailureCallback) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let headers = new HttpHeaders();
      // let params={
      //   'email' :email,
      //   'password' :password
      // }
      
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/user';
      this.http.get(serviceUrl,{headers: headers , responseType: 'text' })
      
       .timeout(10000)
       .subscribe(
        data => {
        //   let datares = this.helper.decrypt(JSON.stringify(data)) 
        //  console.log("loggg type "+datares)
        // var fixedResponse = JSON.parse(datares.replace(/\0/g, ''));
        // console.log("lll "+ JSON.stringify(fixedResponse))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log(JSON.stringify(err))
          FailureCallback("-2")
        }
      )
   
    }
        //activate user 
        UserForgetPassword(code,phone,SuccessCallback,FailureCallback) {
          let loader = this.loadingCtrl.create({
            content: "",
          });
           loader.present();
          let headers = new HttpHeaders();
          // let params={
          //   'email' :email,
          //   'password' :password
          // }
          let parameter = new HttpParams().set('phone',phone).set('code',code)
          headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
          let serviceUrl = this.helper.serviceUrl +'api/forget';
          this.http.post(serviceUrl,parameter,{headers: headers })
           .timeout(10000)
           .subscribe(
            data => {
              loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                    console.log(JSON.stringify(data))
                     SuccessCallback(data)
            },
            err => {
              loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
              FailureCallback("-2")
            }
          )
       
        }

        UserForgetPasswordSendPhone(phone,SuccessCallback,FailureCallback) {
          let loader = this.loadingCtrl.create({
            content: "",
          });
           loader.present();
          let headers = new HttpHeaders();
          let parameter = new HttpParams().set('phone',phone)
          headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
          let serviceUrl = this.helper.serviceUrl +'api/changeMe';
          this.http.post(serviceUrl,parameter,{headers: headers })
           .timeout(10000)
           .subscribe(
            data => {
              loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                    console.log(JSON.stringify(data))
                     SuccessCallback(data)
            },
            err => {
              loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
              FailureCallback("-2")
            }
          )
       
        }
    
    //activate user 
    activateUser(ActivationCode,access_token,SuccessCallback,FailureCallback) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let headers = new HttpHeaders();
      // let params={
      //   'email' :email,
      //   'password' :password
      // }
      let parameter = new HttpParams().set('code',ActivationCode)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ access_token);
      let serviceUrl = this.helper.serviceUrl +'api/activate';
      this.http.post(serviceUrl,parameter,{headers: headers })
       .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback("-2")
        }
      )
   
    }

    activateChangePhone(ActivationCode,phone,access_token,SuccessCallback,FailureCallback) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let headers = new HttpHeaders();
      // let params={
      //   'email' :email,
      //   'password' :password
      // }
      let parameter = new HttpParams().set('code',ActivationCode).set('phone',phone)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/change-phone-code';
      this.http.post(serviceUrl,parameter,{headers: headers })
       .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback("-2")
        }
      )
   
    }
    
    setOrderDate(access_token,order_id,date, remark,type,SuccessCallback,FailureCallback) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let headers = new HttpHeaders();
      let parameter = new HttpParams().set('order_id',order_id).set('date',date).set('remark',remark).set('type',type)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/order/setdate';
      this.http.post(serviceUrl,parameter,{headers: headers })
       .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback("-2")
        }
      )
   
    }

    sendCmplaint(message,SuccessCallback,FailureCallback) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let headers = new HttpHeaders();
      let parameter = new HttpParams().set('text',message)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'/api/contact';
      this.http.post(serviceUrl,parameter,{headers: headers })
       .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback("-2")
        }
      )
   
    }
    getFinancial(month,year,SuccessCallback,FailureCallback) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let headers = new HttpHeaders();
      let parameter = new HttpParams().set('month',month).set('year',year)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/doctor/payments';
      this.http.post(serviceUrl,parameter,{headers: headers })
       .timeout(10000)
       .subscribe( 
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback("-2")
        }
      )
   
    }
    //resend activation code
    //activate user 
    resendActivation(phone,SuccessCallback,FailureCallback) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let headers = new HttpHeaders();
      let parameter = new HttpParams().set('phone',phone)
      if(localStorage.getItem('kdkvfkhggsso')){
        
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      }
      else{
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
      }
      let serviceUrl = this.helper.serviceUrl +'api/resend-activation';
      this.http.post(serviceUrl,parameter,{headers: headers })
       .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback("-2")
        }
      )
   
    }
 
    userRegister(first_name,second_name,last_name,nickname,phone,union_id,birth_date,college_id,graduation_year,bio,bio_ar,certifications,profile_pic,speciality_services,email,password,gender,speciality_id,address,terms,educational_degree,access_token,certifications_ext,profile_pic_ext,governorate,city,categoriesSuccessCallback,categoriesFailureCallback) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let headers = new HttpHeaders();
      let parameter = new HttpParams().set('first_name',first_name).set('second_name',second_name).set('last_name',last_name).set('nickname',nickname)
      .set('phone',phone).set('union_id',union_id).set('birth_date',birth_date).set('college_id',college_id).set('graduation_year',graduation_year)
      .set('bio',bio).set('bio_ar',bio_ar).set('certifications',String(certifications)).set('profile_pic',profile_pic).set('speciality_services',speciality_services).set('email',email).set('gender',gender).set('speciality_id',speciality_id).set('address',address).set('terms',terms).set('educational_degree',educational_degree).set('password',password).set('certifications_ext',String(certifications_ext)).set('profile_pic_ext',profile_pic_ext)
      //ayaaaaaaaa
      .set('governorate',governorate).set('city',city)

      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/doctor/register';
      this.http.post(serviceUrl,parameter,{headers: headers })
      
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 categoriesSuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          categoriesFailureCallback("-2")
        }
      )
   
    }

    entityRegister(name, email, phone,entityphone, profile_pic, profile_pic_ext, password, tax_liscence_pic, address, extra_info,
      tax_liscence_pic_ext, owner_name, terms, type_id, tax_liscence, governorate_id, city_id, staff_num ,
       speciality_services ,categoriesSuccessCallback,categoriesFailureCallback) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let headers = new HttpHeaders();
      let parameter = new HttpParams().set('name',name).set('email',email).set('phone',phone).set('address',address).set('entity_phone',entityphone)
      .set('tax_liscence_pic',tax_liscence_pic).set('tax_liscence_pic_ext',tax_liscence_pic_ext).set('entity_phone',entityphone).set('extra_info',extra_info)
      .set('owner_name',owner_name).set('type_id',type_id).set('tax_liscence',tax_liscence)
      .set('governorate_id',governorate_id).set('city_id',city_id).set('profile_pic',profile_pic)
      .set('speciality_services',speciality_services)
      .set('terms',terms).set('password',password).set('profile_pic_ext',profile_pic_ext).set('staff_num',staff_num)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
      let serviceUrl = this.helper.serviceUrl +'api/entity/register';
      this.http.post(serviceUrl,parameter,{headers: headers })
      
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          
                console.log(JSON.stringify(data))
                categoriesSuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
         
          categoriesFailureCallback("-2")
        }
      )
   
    }

    NurseRegister(name, email, phone,entityphone, profile_pic, profile_pic_ext, password, tax_liscence_pic, address, extra_info,
      tax_liscence_pic_ext, owner_name, terms, type_id, tax_liscence, governorate_id, city_id, staff_num ,
       speciality_services ,gender,categoriesSuccessCallback,categoriesFailureCallback) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let headers = new HttpHeaders();
      let parameter = new HttpParams().set('name',name).set('email',email).set('phone',phone).set('address',address).set('entity_phone',"12345678974")
      .set('tax_liscence_pic',tax_liscence_pic).set('tax_liscence_pic_ext',tax_liscence_pic_ext).set('entity_phone',"12345678974").set('extra_info',extra_info)
      .set('owner_name',"nurse").set('type_id',type_id).set('tax_liscence',tax_liscence)
      .set('governorate_id',governorate_id).set('city_id',city_id).set('profile_pic',profile_pic)
      .set('speciality_services',speciality_services).set('gender',gender)
      .set('terms',terms).set('password',password).set('profile_pic_ext',profile_pic_ext).set('staff_num',staff_num)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
      let serviceUrl = this.helper.serviceUrl +'api/entity/register';
      this.http.post(serviceUrl,parameter,{headers: headers })
      
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          
                console.log(JSON.stringify(data))
                categoriesSuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
         
          categoriesFailureCallback("-2")
        }
      )
   
    }

    userEditProfile(first_name,second_name,last_name,nickname,union_id,birth_date,college_id,graduation_year,bio,bio_ar,certifications,speciality_services,email,gender,speciality_id,address,terms,educational_degree,access_token,certifications_ext,categoriesSuccessCallback,categoriesFailureCallback) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let headers = new HttpHeaders();
      let parameter = new HttpParams().set('first_name',first_name).set('second_name',second_name).set('last_name',last_name).set('nickname',nickname)
      .set('union_id',union_id).set('birth_date',birth_date).set('college_id',college_id).set('graduation_year',graduation_year).set('type_id',"2")
      .set('bio',bio).set('bio_ar',bio_ar).set('certifications',certifications).set('speciality_services',speciality_services).set('email',email).set('gender',gender).set('speciality_id',speciality_id).set('address',address).set('terms',terms).set('educational_degree',educational_degree).set('certifications_ext',certifications_ext)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/edit';
      this.http.post(serviceUrl,parameter,{headers: headers })
      
        .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                 categoriesSuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          categoriesFailureCallback("-2")
        }
      )
   
    }
    getSpecialization(specSuccessCallback,specFailureCallback){
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      this.http.get(this.helper.serviceUrl + 'api/get/lkps/specialities?lang='+this.helper.currentLang+"&all=1")
      .timeout(10000)
      .subscribe(
       data => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
               console.log(JSON.stringify(data))
               specSuccessCallback(data)
       },
       err => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
         specFailureCallback("-2")
       }
     )
    }

    getgovernerate(SuccessCallback,FailureCallback){
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      this.http.get(this.helper.serviceUrl + 'api/get/lkps/governerates?lang='+this.helper.currentLang)
      .timeout(10000)
      .subscribe(
       data => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
               console.log(JSON.stringify(data))
               SuccessCallback(data)
       },
       err => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
         FailureCallback("-2")
       }
     )
    }

    getColleges(SuccessCallback,FailureCallback){
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      this.http.get(this.helper.serviceUrl + 'api/get/lkps/colleges?lang='+this.helper.currentLang)
      .timeout(10000)
      .subscribe(
       data => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
               console.log(JSON.stringify(data))
               SuccessCallback(data)
       },
       err => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
         FailureCallback("-2")
       }
     )
    }

    getGradYears(SuccessCallback,FailureCallback){
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      this.http.get(this.helper.serviceUrl + 'api/get/lkps/graduation_year?lang='+this.helper.currentLang)
      .timeout(10000)
      .subscribe(
       data => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
               console.log(JSON.stringify(data))
               SuccessCallback(data)
       },
       err => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
         FailureCallback("-2")
       }
     )
    }
  // Change password
  resetpassword(oldPassword,newPassword,confirmTxt,access_token, successCallback, failureCallback) {
    let headers = new HttpHeaders();
    let loader = this.loadingCtrl.create({
      content: "",
    });
     loader.present();
    let parameter = new HttpParams().set('current_password',oldPassword).set('password',newPassword).set('password_confirmation',confirmTxt)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.serviceUrl +'api/change_password';
    this.http.post(serviceUrl,parameter,{headers: headers })
    
      .timeout(10000)
     .subscribe(
      data => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
              console.log(JSON.stringify(data))
              successCallback(data)
      },
      err => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        failureCallback("-2")
      }
    )
   
  }

  changeProfilePic(profile_pic,profile_pic_ext,access_token, successCallback, failureCallback) {
    
    let loader = this.loadingCtrl.create({
      content: "",
    });
     loader.present();
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('profile_pic',profile_pic).set('profile_pic_ext',profile_pic_ext)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.serviceUrl +'api/change_profile_img';
    this.http.post(serviceUrl,parameter,{headers: headers })
    
      .timeout(20000)
     .subscribe(
      data => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
              console.log(JSON.stringify(data))
              successCallback(data)
      },
      err => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        failureCallback("-2")
      }
    )
  }

  registerFirebase(firebase_registeration_id, access_token) {
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('firebase_registeration_id',firebase_registeration_id).set('device_type',this.helper.device_type).set('firebase_lang',this.helper.currentLang == "en" ? "0" : "1")
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.serviceUrl +'api/update-firebase';
    this.http.post(serviceUrl,parameter,{headers: headers })
    
      .timeout(20000)
     .subscribe(
      data => {
              console.log(JSON.stringify(data))
             
      },
      err => {
        
      }
    )
   
  }

    getDegrees(SuccessCallback,FailureCallback){
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      this.http.get(this.helper.serviceUrl + 'api/get/lkps/edu-degrees?lang='+this.helper.currentLang)
      .timeout(10000)
      .subscribe(
       data => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
               console.log(JSON.stringify(data))
               SuccessCallback(data)
       },
       err => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
         FailureCallback("-2")
       }
     )
    }

    getDrServices(spec_id,SuccessCallback,FailureCallback){
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      this.http.get(this.helper.serviceUrl + 'api/get/lkps/speciality-services?lang='+this.helper.currentLang +"&speciality_id=" + spec_id)
      .timeout(10000)
      .subscribe(
       data => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
               console.log(JSON.stringify(data))
               SuccessCallback(data)
       },
       err => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
         FailureCallback("-2")
       }
     )
    }

    getContacts(spec_id,SuccessCallback,FailureCallback){
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      this.http.get(this.helper.serviceUrl + 'api/get/lkps/contact-doctors?lang='+this.helper.currentLang)
      .timeout(10000)
      .subscribe(
       data => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
               console.log(JSON.stringify(data))
               SuccessCallback(data)
       },
       err => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
         FailureCallback("-2")
       }
     )
    }

    getReturnTime(SuccessCallback,FailureCallback){
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      this.http.get(this.helper.serviceUrl + 'api/get/lkps/reorder-times?lang='+this.helper.currentLang)
      .timeout(10000)
      .subscribe(
       data => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
               console.log(JSON.stringify(data))
               SuccessCallback(data)
       },
       err => {
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
         FailureCallback("-2")
       }
     )
    }

    getCurrentOrder(order_id,access_token, SuccessCallback,FailureCallback){
      let headers = new HttpHeaders();
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present();
      let parameter = new HttpParams().set('current_password', order_id)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/orders/get/'+order_id;
      this.http.get(serviceUrl,{headers: headers })
      
        .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback("-2")
        }
      )
     
    }
    getRate(lang,type,SuccessCallback,FailureCallback){ 
      let headers = new HttpHeaders();
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present()
      var  serviceUrl ;
     if(type == 0)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/doctor-rate-criteriea?lang='+lang;
      else if(type == 1)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/pharmacy-rate-criteriea?lang='+lang;
      else if (type == 3)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/center-rate-criteriea?lang='+lang;
      else if (type == 2)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/xray-rate-criteriea?lang='+lang;
      else if (type == 5)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/nursing-rate-criteriea?lang='+lang;

      this.http.get(serviceUrl)
       .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback("-2")
        }
      )
     
    }

    getTools(lang,type,service_id,SuccessCallback,FailureCallback){ 
      let headers = new HttpHeaders();
      let loader = this.loadingCtrl.create({
        content: "",
      });
       loader.present()
      var  serviceUrl ;
     if(type == "0")
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/speciality-tool?lang='+lang+'&speciality_id='+service_id;
      else if(type == 1)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/speciality-tool?lang='+lang+'&speciality_id='+service_id;
      else if (type == 2)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/speciality-tool?lang='+lang+'&speciality_id='+service_id;
      else if (type == 3)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/speciality-tool?lang='+lang+'&speciality_id='+service_id;
      this.http.get(serviceUrl)
       .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback("-2")
        }
      )
     
    }

    createReOrder(order_id , date_id ,custom_date , access_token, SuccessCallback,FailureCallback){
      let headers = new HttpHeaders();
      let loader = this.loadingCtrl.create({ 
        content: "",
      }); 
       loader.present();
      let parameter = new HttpParams().set('order_id', order_id).set('date_id', date_id).set('custom_date',custom_date)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/orders/create-reorder';
      this.http.post(serviceUrl, parameter, {headers: headers })
       .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback("-2")
        }
      )
     
    }

    
    trackUser(lat , long , access_token, SuccessCallback,FailureCallback){
      let headers = new HttpHeaders();
      
      let parameter = new HttpParams().set('lat', lat).set('lng', long)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/update-tracking';
      this.http.post(serviceUrl, parameter, {headers: headers })
       .timeout(10000)
       .subscribe(
        data => {
          
                console.log(JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
          
          FailureCallback("-2")
        }
      )
     
    }

    updateCurrentOrder(order_id,status ,type,totalPrice, access_token, SuccessCallback,FailureCallback){
      let headers = new HttpHeaders();
      let loader = this.loadingCtrl.create({
        content: "",
      }); 
       loader.present();
      let parameter = new HttpParams().set('order_id', order_id).set('status', status).set('type',type).set('totalPrice',totalPrice)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/orders/update';
      this.http.post(serviceUrl, parameter, {headers: headers })
       .timeout(10000)
       .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
                console.log(JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback("-2")
        }
      )
     
    }
    getUser(userID, SuccessCallback,FailureCallback){
    
      let headers = new HttpHeaders();
  
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded') //.set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
        let serviceUrl = this.helper.serviceUrl +'api/user/' + userID;
        this.http.get(serviceUrl,{headers: headers })
        .timeout(10000)
        .subscribe(
        data => {
          
                console.log(JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
          
          FailureCallback("-2")
        }
      )
        
    }
    AboutApplication(access_token, SuccessCallback,FailureCallback){
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
        let serviceUrl = this.helper.serviceUrl +'api/get/lkps/about-us_ar';
        this.http.get(serviceUrl,{headers: headers })
        .timeout(10000)
        .subscribe(
        data => {
                console.log(JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
          
          FailureCallback("-2")
        }
      )
        
    }
    privacy(access_token,lang, SuccessCallback,FailureCallback){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/get/lkps/doctors-privacy-policy?lang='+lang;
      this.http.get(serviceUrl,{headers: headers })
      .timeout(10000)
      .subscribe(
      data => {
              console.log(JSON.stringify(data))
              SuccessCallback(data)
      },
      err => {
        
        FailureCallback("-2")
      }
    )
      
  }
  payment_privacy(access_token,lang, SuccessCallback,FailureCallback){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.serviceUrl +'api/get/lkps/doctors-pay-policy?lang='+lang;
    this.http.get(serviceUrl,{headers: headers })
    .timeout(10000)
    .subscribe(
    data => {
            console.log(JSON.stringify(data))
            SuccessCallback(data)
    },
    err => {
      
      FailureCallback("-2")
    }
  )
    
}
terms(access_token,lang, SuccessCallback,FailureCallback){
  let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.serviceUrl +'api/get/lkps/doctors-terms-conditions?lang='+lang;
    this.http.get(serviceUrl,{headers: headers })
    .timeout(10000)
   .subscribe(
    data => {
      
            console.log(JSON.stringify(data))
            SuccessCallback(data)
    },
    err => {
      
      FailureCallback("-2")
    }
  )
    
}
    Conditions(access_token,lang, SuccessCallback,FailureCallback){
      let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
        let serviceUrl = this.helper.serviceUrl +'api/get/lkps/doctors-use-conditions?lang='+lang;
        this.http.get(serviceUrl,{headers: headers })
        .timeout(10000)
       .subscribe(
        data => {
          
                console.log(JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
          
          FailureCallback("-2")
        }
      )
        
    }
    ContactUsEmail(access_token, SuccessCallback,FailureCallback){
      var lang = this.helper.currentLang;
      let headers = new HttpHeaders();
  
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
        let serviceUrl = this.helper.serviceUrl +'api/get/lkps/contact-doctors-email?lang='+lang;
        this.http.get(serviceUrl,{headers: headers })
        .timeout(10000)
       .subscribe(
        data => {
          
                console.log(JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
          
          FailureCallback("-2")
        }
      )
        
    }
    ContactUsPhone(access_token, SuccessCallback,FailureCallback){
      var lang = this.helper.currentLang;
      let headers = new HttpHeaders();
  
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
        let serviceUrl = this.helper.serviceUrl +'api/get/lkps/contact-doctors-phone?lang='+lang;
        this.http.get(serviceUrl,{headers: headers })
        .timeout(10000)
       .subscribe(
        data => {
          
                console.log(JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
          
          FailureCallback("-2")
        }
      )
        
    }
    ContactUsMobile(access_token, SuccessCallback,FailureCallback){
      var lang = this.helper.currentLang;
      let headers = new HttpHeaders();
  
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
        let serviceUrl = this.helper.serviceUrl +'api/get/lkps/contact-doctors-mobile?lang='+lang;
        this.http.get(serviceUrl,{headers: headers })
        .timeout(10000)
       .subscribe(
        data => {
          
                console.log(JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
          
          FailureCallback("-2")
        }
      )
        
    }
  rateCriteriea(rate,access_token,type){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      //let serviceUrl = this.helper.serviceUrl +'api/get/lkps/doctor-rate-criteriea?rate='+rate;
      var  serviceUrl ;
      if(type == 0)
         serviceUrl = this.helper.serviceUrl +'api/get/lkps/doctor-rate-criteriea?rate='+rate;
       else if(type == 1)
         serviceUrl = this.helper.serviceUrl +'api/get/lkps/pharmacy-rate-criteriea?rate='+rate;
       else if (type == 3)
         serviceUrl = this.helper.serviceUrl +'api/get/lkps/center-rate-criteriea?rate='+rate;
       else if (type == 2)
         serviceUrl = this.helper.serviceUrl +'api/get/lkps/xray-rate-criteriea?rate='+rate;
      else if (type == 5)
         serviceUrl = this.helper.serviceUrl +'api/get/lkps/nursing-rate-criteriea?rate='+rate;
        
      return this.http.get(serviceUrl,{headers: headers });
  
  }
  rateUser(userId,rate,notes,myid,orderId,reasons_ids,access_token){
    let headers = new HttpHeaders();
     
      let parameter = new HttpParams().set('service_profile_id',userId)
      .set('rate',rate).set('remark',notes).set('order_id',orderId).set("rate_criteria_ids",reasons_ids)
      .set('is_reorder','0').set('user_id',myid);
      console.log("parameters from service: ",parameter);
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/users/rate';
      return this.http.post(serviceUrl,parameter,{headers: headers });
  }
  getNotifications(page, lang ,access_token, SuccessCallback, FailureCallback){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.serviceUrl+ 'api/notificationsDOCTOR?page='+page+'&lang='+lang;
    console.log("access token ",access_token,"headers from getNotifications",headers , "request ",serviceUrl);
    this.http.get(serviceUrl,{headers: headers })
    .timeout(10000)
    .subscribe(
     data => {
             console.log(JSON.stringify(data))
             SuccessCallback(data)
     },
     err => {
       
       FailureCallback("-2")
     }
   )
    
  }
  getCountOfNotifications(access_token, SuccessCallback, FailureCallback){
   
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.serviceUrl+ 'api/notifications-count';
    //console.log("access token ",access_token,"headers from getCountOfNotifications",headers , "request ",serviceUrl);
    this.http.get(serviceUrl,{headers: headers })
    .timeout(10000)
    .subscribe(
     data => {
       
            // console.log(JSON.stringify(data))
             SuccessCallback(data)
     },
     err => {
       
       FailureCallback("-2")
     }
   )

  }

  logmeout(SuccessCallback, FailureCallback){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.serviceUrl +'api/logmeout';
    this.http.get(serviceUrl,{headers: headers })
    .timeout(10000)
    .subscribe( 
     data => {
             SuccessCallback(data)
     },
     err => {
       
       FailureCallback("-2")
     }
   )
  }


  updateNotification(status,access_token,SuccessCallback, FailureCallback){
    
    let headers = new HttpHeaders();
    //notifications -> 1, 0
    let parameter = new HttpParams().set('notifications',status);
    console.log("parameters from service: ",parameter);
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.serviceUrl +'api/notifications-update';
    this.http.post(serviceUrl,parameter,{headers: headers })
    .timeout(10000)
    .subscribe(
     data => {
       
            // console.log(JSON.stringify(data))
             SuccessCallback(data)
     },
     err => {
       
       FailureCallback("-2")
     }
   )
  }
  readNotification(access_token,SuccessCallback, FailureCallback){
//api/notifications/read/{id} (post)
    let headers = new HttpHeaders();
    
    // let parameter = new HttpParams().set('notifications',status);
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.serviceUrl +'api/notifications/read/1';
    this.http.post(serviceUrl,null,{headers: headers })
    .timeout(10000)
    .subscribe(
     data => {
       
             console.log(JSON.stringify(data))
             SuccessCallback(data)
     },
     err => {
       
       FailureCallback("-2")
     }
   )

  }
  cancelreasons(access_token,type){
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();

      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      //let serviceUrl = this.helper.serviceUrl +'api/get/lkps/cancel-reasons';
      //let serviceUrl = this.helper.serviceUrl +'api/get/lkps/doctor-cancel-reasons?lang='+lang;
      var  serviceUrl ;
     if(type == 0)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/doctor-cancel-reasons?lang='+lang;
      else if(type == 1)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/pharma-cancel-reasons?lang='+lang;
      else if (type == 3)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/t7alel-cancel-reasons?lang='+lang;
      else if (type == 2)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/ashe3a-cancel-reasons?lang='+lang;
      else if (type == 5)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/nursing-cancel-reasons?lang='+lang;

      return this.http.get(serviceUrl,{headers: headers })
      
  }
  cancelorder(orderid,reason_ids,description,access_token,type,status){
    let headers = new HttpHeaders();
      let parameter = new HttpParams().set('order_id',orderid).set('type',type).set('status',status)
      .set('reason_ids',reason_ids).set('description',description);
      console.log("parameters from service: ",parameter);
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
      let serviceUrl = this.helper.serviceUrl +'api/orders/cancel';
      return this.http.post(serviceUrl,parameter,{headers: headers });

  }

  reorder(orderId , custom_date ,date_id,access_token){
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('order_id',orderId)
    .set('date_id',date_id).set('custom_date',custom_date);
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.serviceUrl +'api/orders/create-reorder';
    return this.http.post(serviceUrl,parameter,{headers: headers });

  }

  getaddress(lat,lng){
    
    var url = "https:maps.googleapis.com/maps/api/geocode/json?address="+lat+","+lng+"&key="+this.helper.googleApiKey;
    console.log("google api url ",url);
    return this.http.get(url);
  }

  editserviceProfile(data,access_token){
    let headers = new HttpHeaders();
    if(!data.entity_services){
      data.entity_services = ""
    }
    let parameter = new HttpParams().set('name',data.name)
    .set('tax_liscence_pic',data.certificateData).set('tax_liscence_pic_ext',data.certifications_ext)
    .set('email',data.email).set('address',data.address).set("gender",data.gender)
    .set('owner_name',data.owner).set('type_id',data.type_id)
    .set('tax_liscence',data.tax_liscence).set('speciality_services',data.entity_services)
    .set('governorate_id',data.governorate_id).set('city_id',data.city_id)
    .set('staff_num',data.deliveryCount).set('entity_phone',data.entityphone).set('extra_info',data.extra_info)
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.serviceUrl +'api/edit';
    return this.http.post(serviceUrl,parameter,{headers: headers });
  }

  ConditionsForAllServices(access_token,type,lang, SuccessCallback,FailureCallback){
    let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
     var  serviceUrl ;
     if(type == 0)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/doctors-use-conditions?lang='+lang;
      else if(type == 1)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/pharma-use-conditions?lang='+lang;
      else if (type == 3)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/t7alel-use-conditions?lang='+lang;
      else if (type == 2)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/xray-use-conditions?lang='+lang;
      else if (type == 5)
        serviceUrl = this.helper.serviceUrl +'api/get/lkps/nursing-use-conditions?lang='+lang;


      this.http.get(serviceUrl,{headers: headers })
      .timeout(10000)
     .subscribe(
      data => {
        
              console.log(JSON.stringify(data))
              SuccessCallback(data)
      },
      err => {
        
        FailureCallback("-2")
      }
    )
      
  }


  payment_privacyForAllServices(access_token,type,lang, SuccessCallback,FailureCallback){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    
    var  serviceUrl ;
    if(type == 0)
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/doctors-pay-policy?lang='+lang;
    else if(type == 1)
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/pharma-pay-policy?lang='+lang;
    else if (type == 3)
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/t7alel-pay-policy?lang='+lang;
    else if (type == 2)
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/xray-pay-policy?lang='+lang;
    else if (type == 5)
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/nursing-pay-policy?lang='+lang;
    
      
      this.http.get(serviceUrl,{headers: headers })
      .timeout(10000)
      .subscribe(
        data => {
          console.log(JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          FailureCallback("-2")
        }
      )
          
  }
  privacyForAllServices(access_token,type,lang, SuccessCallback,FailureCallback){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
   
    var  serviceUrl ;
    if(type == 0)
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/doctors-privacy-policy?lang='+lang;
    else if(type == 1)
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/pharma-privacy-policy?lang='+lang;
    else if (type == 3)
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/t7alel-privacy-policy?lang='+lang;
    else if (type == 2)
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/xray-privacy-policy?lang='+lang;
    else if (type == 5)
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/nursing-privacy-policy?lang='+lang;
    
    
    this.http.get(serviceUrl,{headers: headers })
    .timeout(10000)
    .subscribe(
    data => {
            console.log(JSON.stringify(data))
            SuccessCallback(data)
    },
    err => {
      
      FailureCallback("-2")
    }
  )
    
}


getCustomerService(id,access_token){

  // http://aldoctor-app.com/aldoctorfinaltest/public/api/get/lkps/customer-service?city_id=null
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
  let serviceUrl = this.helper.serviceUrl+ 'api/get/lkps/customer-service?city_id='+id;
  return this.http.get(serviceUrl,{headers: headers });
}



// addWorkingDays?userId=11&intervals
addWorkingDays(userId,interval){
let params={
      "userId" : userId,
      "intervals":interval
    }
  let headers = new HttpHeaders();
    let parameter = new HttpParams().set("data",JSON.stringify(params))
    // .set('userId',userId)
    // .set('intervals',interval);
    console.log("parameters : ",parameter)
    // let params={
    //   "userId" : userId,
    //   "intervals":interval
    // }
    // console.log("params : ",JSON.stringify(params))
    headers = headers
    .set('Content-Type', 'application/x-www-form-urlencoded')
    // .set('Content-Type', 'application/form-data')
    .set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    
    console.log("interval : ",interval)

   
  
  let serviceUrl = this.helper.serviceUrl+ 'api/addWorkingDays';
  // {data:JSON.stringify(params)}
  return this.http.post(serviceUrl,parameter,{headers: headers });
  
}

listWorkingDays(userId){

  let headers = new HttpHeaders();
    // let parameter = new HttpParams().set('userId',userId)
    // .set('intervals',interval);
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    
    // console.log("interval : ",interval)

   
  
  let serviceUrl = this.helper.serviceUrl+ 'api/workingDays?userId='+userId;
  return this.http.get(serviceUrl,{headers: headers });
  
}


//ayaaaaaa

uploadReport(orderId,access_token,reportFiles,files_ext){
  let headers = new HttpHeaders();
  // console.log("lat from service ",this.helper.lat);
  // console.log("lon from service ",this.helper.lon);
  
  // let userLocation = this.helper.lat + "," + this.helper.lon;

  let parameter = new HttpParams()
  .set('orderid',orderId)
  .set('files',reportFiles)
  .set('service_id','3')
  .set('fiels_ext',files_ext)

  // .set('extra',userLocation)
  // .set('type_id',this.helper.type_id)
  // .set('service_number',serviceNmber)
  // .set('entity_service_id',centerId);
  
  
  headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
  let serviceUrl = this.helper.serviceUrl +'api/orders/UploadResultFile';
  return this.http.post(serviceUrl,parameter,{headers: headers });
}

  deleteResultFile(fileId,access_token) {
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('fileID',fileId);
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/orders/DeleteResultFile';
    return this.http.post(serviceUrl,parameter,{headers: headers });
  }

}
