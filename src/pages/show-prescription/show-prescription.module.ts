import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowPrescriptionPage } from './show-prescription';

@NgModule({
  declarations: [
    ShowPrescriptionPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowPrescriptionPage),
  ],
})
export class ShowPrescriptionPageModule {}
