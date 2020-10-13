import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaidPolicyPage } from './paid-policy';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PaidPolicyPage,
  ],
  imports: [
    IonicPageModule.forChild(PaidPolicyPage),
    TranslateModule.forChild(),
  ],
})
export class PaidPolicyPageModule {}
