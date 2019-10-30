import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RetimePage } from './retime';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RetimePage,
  ],
  imports: [
    IonicPageModule.forChild(RetimePage),
    TranslateModule.forChild(),
  ],
})
export class RetimePageModule {}
