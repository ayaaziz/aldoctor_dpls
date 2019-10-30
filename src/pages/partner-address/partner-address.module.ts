import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerAddressPage } from './partner-address';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PartnerAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(PartnerAddressPage),
    TranslateModule.forChild(),
  ],
})
export class PartnerAddressPageModule {}
