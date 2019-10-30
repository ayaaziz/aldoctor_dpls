import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  LangID;
  lang;
  imgArrow;
  directionArrow;
  changeToLang;
  language = { selected: '1' };
  lang_direction= ""

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
    public translate: TranslateService, public helper: HelperProvider, public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  ionViewWillEnter() {
    try {
      
      let userLang = this.storage.get("LanguageApp").then((val) => {
        if (val == 'ar') {
          this.LangID = "1";
          this.imgArrow = 'assets/imgs/settings-arrow-icon2.png';
          this.directionArrow = 'left';
          this.changeToLang = 'English';
          this.lang_direction = 'rtl';
        }
        else {
          this.LangID = "2";
          this.imgArrow = 'assets/imgs/settings-arrow-icon.png';
          this.directionArrow = 'right';
          this.changeToLang = 'العربية';
          this.lang_direction = 'ltr';
        }

        //$scope.currentSavedLang = currentSavedLang;
        this.language = { selected: this.LangID };
      });
    } catch (e) {
      console.log("catch sttings " + e.message)
    }
  }
  onLanguageChange() {
    if (this.lang == 'en') {
      this.translate.use('ar');
      this.translate.setDefaultLang('ar')
      this.storage.set("LanguageApp", 'ar');
      this.lang = 'ar';
      this.lang_direction = 'rtl';
      this.helper.currentLang = 'ar';
      this.helper.lang_direction = 'rtl';
      this.LangID = "1";
      this.imgArrow = 'assets/imgs/settings-arrow-icon2.png';
      this.directionArrow = 'left';
      this.changeToLang = 'English';
      this.lang_direction = 'rtl';
      this.platform.setDir('rtl', true)
  }
    else {
      this.translate.use('en');
      this.translate.setDefaultLang('en')
      this.storage.set("LanguageApp", 'en');
      this.lang = 'en';
      this.lang_direction = 'ltr';
      this.helper.currentLang = 'en';
      this.helper.lang_direction = 'ltr';
      this.LangID = "2";
      this.imgArrow = 'assets/imgs/settings-arrow-icon.png';
      this.directionArrow = 'right';
      this.changeToLang = 'العربية';
      this.lang_direction = 'ltr';
      this.platform.setDir('ltr', true)
    }
  }
}
