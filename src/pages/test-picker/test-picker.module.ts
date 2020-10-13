import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestPickerPage } from './test-picker';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TestPickerPage,
  ],
  imports: [
    IonicPageModule.forChild(TestPickerPage),
    TranslateModule.forChild()
  ],
})
export class TestPickerPageModule {}
