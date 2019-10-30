import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, ToastController, AlertController } from 'ionic-angular';
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
import { Content } from 'ionic-angular';
import { File } from '@ionic-native/file';

declare var window;

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [FileChooser, Base64, FilePath, IOSFilePicker, Camera, File]
})
export class SignupPage {
  @ViewChild(Content) content: Content;
  first: any = false;
  second: any = true;
  signUpForm;
  firstname;
  secondname = "";
  surname = "";
  Nickname = "";
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
  imageAdded = false;
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
  profile_pic_ext = [];
  doctorImg = "";
  address;
  termsStatus = false;
  accessToken = "";
  user_certficits = []
  user_img = []
  termsError = false
  constructor(public toastCtrl: ToastController, private camera: Camera, public helper: HelperProvider,
    public actionSheetCtrl: ActionSheetController, public loginservice: LoginServiceProvider,
    public translate: TranslateService, public formBuilder: FormBuilder, private file: File,
    public filePicker: IOSFilePicker, public platform: Platform, private alertCtrl: AlertController,
    private filePath: FilePath, public navCtrl: NavController, public navParams: NavParams,
    private fileChooser: FileChooser, private base64: Base64, public storage: Storage) {
    this.langDirection = this.helper.lang_direction;

    this.registerFormOne = formBuilder.group({

      firstname: ['', Validators.required],
      // secondname: ['', Validators.required],
      surname: ['', Validators.required],
      Nickname: ['', Validators.required],
      email: ['', emailValidator.isValid],
      phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required])],
      address: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(4), Validators.required])],
      confirmpassword: ['', Validators.compose([matchOtherValidator('password')])],
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      Syndicate: ['', Validators.required]
    });
    this.registerFormTwo = formBuilder.group({

      Specialization: ['', Validators.required],
      gradyear: ['', Validators.required],
      College: ['', Validators.required],
      Degree: ['', Validators.required],
      aboutdr: ['', Validators.required],
      drservices: ['', Validators.required]
    });

  }
  openTermsOfUse() {
    this.navCtrl.push('RegisterConditionsPage')
  }
  //get doctor certificates 
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
            this.certificateData.push(encodeURIComponent(val.split(',')[1]))
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
      quality: 50,
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
      this.doctorImg = encodeURIComponent(imageData);
      this.imageAdded = true
      this.profile_pic_ext.push("jpeg")
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
    this.disableCollege = false
    this.DrServicesData = data
  }
  servicesFailureCallback(data) {
    this.presentToast(this.translate.instant("serverError"))
  }
  //view will enter
  ionViewWillEnter() {
    this.cancelTxt = this.translate.instant("canceltxt");
    this.doneTxt = this.translate.instant("doneTxt");
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
      this.loginservice.getDrServices(this.Specialization, (data) => this.servicesSuccessCallback(data), (data) => this.servicesFailureCallback(data))
      //this.loginservice.getColleges((data) => this.collegeSuccessCallback(data), (data) => this.collegeFailureCallback(data))
    }
    else {
      this.presentToast(this.translate.instant("serverError"))
    }
  }
  openAboutInfo() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("aboutDRInfo"),
      message: 'يجب اضافة معلومات خاصة بتخصصك',
      buttons: [
        {
          text: this.translate.instant("ok"),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
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
    else {
      this.content.scrollToTop()
      this.helper.presentToast(this.translate.instant('registerationFillData'))
    }
  }
  getphoto() {

  }
  registerUser() {
    this.registerAttempt = true;
    //alert(this.termsStatus)
    if (this.termsStatus == false) {
      this.presentToast(this.translate.instant('checkAgreement'))
    }
    else {
      if (this.registerFormTwo.valid) {
        if (navigator.onLine) {
          this.loginservice.getAccessToken((data) => this.authSuccessCallback(data), (data) => this.authFailureCallback(data));
        }
        else {
          this.presentToast(this.translate.instant("serverError"))
        }
      }
      else {
        this.content.scrollToTop()
        this.helper.presentToast(this.translate.instant('registerationFillData'))
      }
    }
  }
  authSuccessCallback(data) {
    this.accessToken = data.access_token;
    //localStorage.setItem('adftrmee', data.access_token)
    //this.mainService.categoriesService( this.helper.DeviceId, (data) => this.categoriesSuccessCallback(data), (data) => this.categoriesFailureCallback(data));
    if (navigator.onLine) {
      this.loginservice.userRegister(this.firstname, this.secondname, this.surname, this.Nickname, "2" + this.phone, this.Syndicate, this.birthdate, this.College, this.gradyear, this.aboutdr, this.aboutdr, this.certificateData.toString(), this.doctorImg, this.DrServices, this.email, this.passwrodTxt, this.gender, this.Specialization, this.address, 1, this.Degree, data.access_token, this.certifications_ext.toString(), this.profile_pic_ext.toString(), (data) => this.successCallback(data), (data) => this.failureCallback(data))
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
  previous() {
    this.first = false;
    this.second = true
  }
  successCallback(data) {

    console.log(JSON.stringify(data))
    //let res = JSON.parse(data)
    this.storage.set('user_login_token', data)
    if (data.access_token) {
      this.navCtrl.setRoot(CodepagePage, { userToken: data.access_token, type: 0, service_id: this.Specialization, phoneToChange: "2" + this.phone })
    }
    else {
      if (data.errors.phone) {
        this.presentToast(this.translate.instant("phoneExists"))
      }
      else if (data.errors.email) {
        this.presentToast(this.translate.instant("emailExists"))
      }
      else {
        this.presentToast(this.translate.instant("serverError"))
      }
    }

    // if(data.success == true){
    // this.loginservice.userLogin(this.email, this.passwrodTxt, this.accessToken, (data) => this.loginSuccessCallback(data), (data) => this.loginFailureCallback(data))

    // }
    // else{
    //   this.presentToast(this.translate.instant("signUpFailure"))
    // }
  }
  loginSuccessCallback(data) {
    console.log(JSON.stringify(data))
    //let res = JSON.parse(data)
    this.storage.set('userAccess', data.access_token)
    this.navCtrl.setRoot(CodepagePage, { userToken: data.access_token, type: 0, service_id: this.DrServices, phoneToChange: "2" + this.phone })
  }
  loginFailureCallback(data) {

  }
  failureCallback(data) {
    this.presentToast(this.translate.instant("serverError"))
  }
}