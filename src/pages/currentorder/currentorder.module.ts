import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrentorderPage } from './currentorder';

@NgModule({
  declarations: [
    CurrentorderPage,
  ],
  imports: [
    IonicPageModule.forChild(CurrentorderPage),
  ],
})
export class CurrentorderPageModule {}
