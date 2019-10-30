import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContacUsPage } from './contac-us';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ContacUsPage,
  ],
  imports: [
    IonicPageModule.forChild(ContacUsPage),
    TranslateModule.forChild(),
  ],
})
export class ContacUsPageModule {}
