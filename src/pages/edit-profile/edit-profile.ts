import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, ToastController, Events } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { Base64 } from '@ionic-native/base64';
import { FilePath } from '@ionic-native/file-path';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { passwordValidator, matchOtherValidator, emailValidator } from '../../validators/passwordValidator';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CodepagePage } from '../../pages/codepage/codepage';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { File } from '@ionic-native/file';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
  providers: [FileChooser, Base64, FilePath, IOSFilePicker, Camera, File]
})
export class EditProfilePage {
  first: any = false;
  second: any = true;
  signUpForm;
  firstname;
  secondname = "";
  surname;
  Nickname;
  passwrodTxt;
  email = "";
  phone;
  birthdate;
  Syndicate;
  registerFormOne;
  registerFormTwo;
  gender
  submitAttempt = false;
  langDirection: string = 'rtl';
  Specialization;
  gradyear;
  Degree;
  aboutdr;
  cancelTxt;
  doneTxt;
  registerAttempt = false;
  disableCollege = true;
  disableDegrees = true;
  specializations = []
  Colleges = []
  College;
  gradyears = []
  disableYears = true;
  Degrees = ["test"]
  DrServices;
  DrServicesData = [];
  certificateData = [];
  certifications_ext = [];
  user_certficits = [];
  profile_pic_ext = [];
  doctorImg = "";
  address;
  termsStatus = false;
  accessToken = "";
  termsError = false
  constructor(public toastCtrl: ToastController, private camera: Camera, public helper: HelperProvider,
    public actionSheetCtrl: ActionSheetController, public loginservice: LoginServiceProvider,
    public translate: TranslateService, public formBuilder: FormBuilder, private file: File,
    public filePicker: IOSFilePicker, public platform: Platform, public events: Events,
    private filePath: FilePath, public navCtrl: NavController, public navParams: NavParams,
    private fileChooser: FileChooser, private base64: Base64, public storage: Storage) {
    this.langDirection = this.helper.lang_direction;
    this.registerFormOne = formBuilder.group({

      firstname: ['', Validators.required],
      // secondname: ['', Validators.required],
      surname: ['', Validators.required],
      Nickname: ['', Validators.required],
      email: ['', emailValidator.isValid],
      address: ['', Validators.required],
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      Syndicate: ['', Validators.required],
      Specialization: ['', Validators.required],
      gradyear: ['', Validators.required],
      College: ['', Validators.required],
      Degree: ['', Validators.required],
      aboutdr: ['', Validators.required],
      drservices: ['', Validators.required]
    });
    // this.registerFormTwo = formBuilder.group({

    //   Specialization: ['', Validators.required],
    //   gradyear: ['', Validators.required],
    //   College: ['', Validators.required],
    //   Degree: ['', Validators.required],
    //   aboutdr: ['', Validators.required],
    //   drservices: ['', Validators.required]
    // });

  }

  getCertificates() {

    if (this.platform.is('ios')) {
      this.filePicker.pickFile()
        .then(uri => {
          let correctPath = uri.substr(0, uri.lastIndexOf('/') + 1);
          let filename = uri.substr(uri.lastIndexOf('/') + 1)
          this.user_certficits.push(filename)
          let fileExt = filename.split('.').pop();
          this.certifications_ext.push(fileExt)
          this.file.readAsDataURL("file:///" + correctPath, filename).then((val) => {
            this.certificateData.push(encodeURIComponent(val))
          }).catch(err => console.log('Error reader' + err));
        }).catch(err => console.log('Error' + err));
    }
    else if (this.platform.is('android')) {
      this.fileChooser.open().then((filePath) => {
        console.log("filePath " + filePath)
        this.filePath.resolveNativePath(filePath).then((filePathResult) => {
          console.log("filePathResult " + filePathResult)
          this.base64.encodeFile(filePathResult)
            .then(base64File => {
              let filename = filePathResult.substr(filePathResult.lastIndexOf('/') + 1)
              this.user_certficits.push(filename)
              let fileExt = filename.split('.').pop();
              this.certifications_ext.push(fileExt)
              let fileData = base64File.split(',')[1];
              this.certificateData.push(encodeURIComponent(fileData))
              //alert(filename + " vv "+fileExt+" here is encoded image "+ fileData)
            })
            .catch((e) => {
              console.log('Error reading file' + JSON.stringify(e));
            })

        }).catch((error) => {

        })
      })
    }
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.doctorImg = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
  presentActionSheet() {

    let actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant("SelectImageSource"),
      buttons: [
        {
          text: this.translate.instant("LoadfromLibrary"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: this.translate.instant("UseCamera"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: this.translate.instant("canceltxt"),
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  // user select years.
  collegeChanged() {
    if (this.Colleges != undefined) {
      this.disableYears = false;
      // this.getGradYears();
    }
  }
  //user select specification
  specChanged() {

    if (this.Specialization != undefined) {
      this.getCollegesData()
    }
  }
  servicesSuccessCallback(data) {
    console.log(data)
    this.disableCollege = false;
    this.DrServicesData = data
  }
  servicesFailureCallback(data) {
    this.presentToast(this.translate.instant("serverError"))
  }
  //view will enter
  ionViewWillEnter() {

    this.cancelTxt = this.translate.instant("canceltxt");
    this.doneTxt = this.translate.instant("doneTxt");
    this.storage.get('user_login_info').then((val) => {
      this.firstname = val.doctor.first_name
      this.secondname = val.doctor.second_name
      this.surname = val.doctor.last_name
      this.Nickname = val.nickname
      this.Syndicate = val.doctor.union_id
      if (val.email == "static_" + val.phone + "@gmail.com") {
        this.email = ""
      }
      else {
        this.email = val.email
      }

      this.address = val.doctor.address
      this.birthdate = val.doctor.birth_date
      this.gender = val.doctor.gender
      this.Specialization = val.doctor.speciality_id
      this.College = val.doctor.college_id
      this.gradyear = new Date(String(val.doctor.graduation_year)).toISOString()
      this.Degree = val.doctor.educational_degree
      this.aboutdr = val.doctor.bio

      let services = val.doctor.speciality_services
      let servicesArr = []
      for (let i = 0; i < services.length; i++) {
        servicesArr.push(services[i].id)
      }
      this.DrServices = servicesArr
      console.log("speciality_services here" + JSON.stringify(this.DrServices))
    })
    this.getSpecializationsData()
  }
  //user select years 
  yearsChanged() {
    if (this.gradyear != undefined) {
      this.disableDegrees = false;
      this.getDegrees();
    }
  }
  //gard years
  getGradYears() {
    if (navigator.onLine) {
      this.loginservice.getGradYears((data) => this.yearsSuccessCallback(data), (data) => this.yearsFailureCallback(data))
    }
    else {
      this.presentToast(this.translate.instant("serverError"))
    }
  }
  yearsSuccessCallback(data) {
    console.log(data)
    this.gradyears = data
  }
  yearsFailureCallback(data) {
    this.presentToast(this.translate.instant("serverError"))
  }

  //Degrees
  getDegrees() {
    if (navigator.onLine) {
      this.loginservice.getDegrees((data) => this.degreesSuccessCallback(data), (data) => this.degreesFailureCallback(data))
    }
    else {
      this.presentToast(this.translate.instant("serverError"))
    }
  }
  degreesSuccessCallback(data) {
    console.log(data)
    if (data != []) {
      this.Degrees = data
    }
  }
  degreesFailureCallback(data) {
    this.presentToast(this.translate.instant("serverError"))
  }

  //get colleges data
  getCollegesData() {
    if (navigator.onLine) {
      this.loginservice.getColleges((data) => this.collegeSuccessCallback(data), (data) => this.collegeFailureCallback(data))
    }
    else {
      this.presentToast(this.translate.instant("serverError"))
    }
  }
  collegeSuccessCallback(data) {

    this.loginservice.getDrServices(this.Specialization, (data) => this.servicesSuccessCallback(data), (data) => this.servicesFailureCallback(data))
    console.log(data)
    this.Colleges = data
  }
  collegeFailureCallback(data) {
    this.presentToast(this.translate.instant("serverError"))
  }
  getSpecializationsData() {
    //alert("dds")
    if (navigator.onLine) {
      this.loginservice.getSpecialization((data) => this.specSuccessCallback(data), (data) => this.specFailureCallback(data))
    }
    else {
      this.presentToast(this.translate.instant("serverError"))
    }
  }
  specSuccessCallback(data) {
    console.log(data)
    this.specializations = data
  }
  specFailureCallback(data) {
    this.presentToast(this.translate.instant("serverError"))
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  NextForm() {
    //alert(this.passwrodTxt)
    this.submitAttempt = true
    if (this.registerFormOne.valid) {
      this.first = true
      this.second = false
    }
  }
  getphoto() {

  }
  registerUser() {
    this.submitAttempt = true;
    //alert(this.termsStatus)
    //  if(this.termsStatus == false){
    //    this.presentToast(this.translate.instant('checkAgreement'))
    //  }
    //   else{
    if (this.registerFormOne.valid) {
      if (navigator.onLine) {
        this.storage.get("user_login_token").then((val) => {


          this.loginservice.userEditProfile(this.firstname, this.secondname, this.surname, this.Nickname, this.Syndicate, this.birthdate, this.College, String(new Date(this.gradyear).getFullYear()), this.aboutdr, this.aboutdr, this.certificateData.toString(), this.DrServices, this.email, this.gender, this.Specialization, this.address, 1, this.Degree, val.access_token, this.certifications_ext.toString(), (data) => this.successCallback(data), (data) => this.failureCallback(data))
        })
        //this.loginservice.getAccessToken((data) => this.authSuccessCallback(data), (data) => this.authFailureCallback(data));
      }
      else {
        this.presentToast(this.translate.instant("serverError"))
      }
    }
    //} 
  }
  authSuccessCallback(data) {
    this.accessToken = data.access_token;
    //localStorage.setItem('adftrmee', data.access_token)
    //this.mainService.categoriesService( this.helper.DeviceId, (data) => this.categoriesSuccessCallback(data), (data) => this.categoriesFailureCallback(data));
    if (navigator.onLine) {
      //this.loginservice.userEditProfile(this.firstname,this.secondname,this.surname,this.Syndicate,this.birthdate,this.College,this.gradyear,this.aboutdr,this.aboutdr,this.certificateData.toString(),this.doctorImg,this.DrServices,this.email,this.gender,this.Specialization,this.address,1,this.Degree,data.access_token,this.certifications_ext.toString(),this.profile_pic_ext.toString(),(data)=>this.successCallback(data),(data)=>this.failureCallback(data))
    }
    else {
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
  authFailureCallback(data) {
    this.presentToast(this.translate.instant("cannotGetAccessToken"))
  }
  successCallback(data) {


    if (data.success == true) {
      // this.loginservice.userLogin(this.email, this.passwrodTxt, this.accessToken, (data) => this.loginSuccessCallback(data), (data) => this.loginFailureCallback(data))
      this.storage.set("user_login_info", data.user).then(() => {
        this.helper.presentToast(this.translate.instant("ProfileUpdated"))
        this.events.publish("user:userLoginSucceeded", data.user)
        this.navCtrl.setRoot(TabsPage)
      }
      )
    }
    else {
      this.presentToast(this.translate.instant("serverError"))
    }
  }
  loginSuccessCallback(data) {
    console.log(JSON.stringify(data))
    //let res = JSON.parse(data)
    this.storage.set('userAccess', data.access_token)
    this.navCtrl.setRoot(CodepagePage, { userToken: data.access_token })
  }
  loginFailureCallback(data) {

  }
  failureCallback(data) {
    this.presentToast(this.translate.instant("serverError"))
  }
  getcer() {
    if (this.platform.is('ios')) {
      this.filePicker.pickFile()
        .then(uri => {
          console.log(uri)
          this.base64.encodeFile(uri).then((base64File: string) => {
            console.log(base64File);
          }, (err) => {
            console.log(err);
          });
        })
        .catch(err => console.log('Error', err));
    }
    else {
      this.fileChooser.open()
        .then(uri => {
          console.log(uri)
          this.filePath.resolveNativePath(uri)
            .then(filePath => {
              console.log(filePath)
              this.base64.encodeFile(filePath).then((base64File: string) => {
                console.log(base64File);
              }, (err) => {
                console.log(err);
              });
            })
            .catch(err => console.log(err));

        })
        .catch(e => console.log(e));
    }
  }

}
