import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmsignPage } from './confirmsign';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ConfirmsignPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmsignPage),
    TranslateModule.forChild()
  ],
})
export class ConfirmsignPageModule {}
