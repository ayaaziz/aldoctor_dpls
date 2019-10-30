import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePhonePage } from './change-phone';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChangePhonePage,
  ],
  imports: [
    IonicPageModule.forChild(ChangePhonePage),
    TranslateModule.forChild(),
  ],
})
export class ChangePhonePageModule {}
