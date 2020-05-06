import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
//import { SignupPage } from '../pages/signup/signup';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NotificationPage } from '../pages/notification/notification';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LoginPage } from '../pages/login/login';
import { CodepagePage } from '../pages/codepage/codepage';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RefreshTokenInterceptor } from '../providers/refresh-token.interceptor';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { HelperProvider } from '../providers/helper/helper';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { ChangePasswordPage } from '../pages/change-password/change-password'; 
//Import TranslateModule
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { CenterOrderPage } from '../pages/center-order/center-order';
import { NeworderPage } from '../pages/neworder/neworder';
import { PharmacyOrderPage } from '../pages/pharmacy-order/pharmacy-order';
// import { IonicTimepickerModule } from '@logisticinfotech/ionic-timepicker';

//import { HttpModule, Http } from '@angular/http';
//import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
   ChangePasswordPage,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    NotificationPage,
    LoginPage,
    CenterOrderPage,
    NeworderPage,
    PharmacyOrderPage,
    CodepagePage
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFontAwesomeModule,

    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp
      , {
        monthNames: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"]
      }
      ),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
   ChangePasswordPage,
    AboutPage,
    ContactPage,
    NotificationPage,
    HomePage,
    TabsPage,
    LoginPage ,
    CenterOrderPage,
    NeworderPage,
    PharmacyOrderPage,
    CodepagePage

  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
    StatusBar,
    SplashScreen,
    Geolocation,
    Diagnostic,
    LocationAccuracy,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginServiceProvider,
    HelperProvider
  ]
})
export class AppModule {}
