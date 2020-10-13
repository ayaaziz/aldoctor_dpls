import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { PhotoViewer } from '@ionic-native/photo-viewer';

/**
 * Generated class for the ShowPrescriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-prescription',
  templateUrl: 'show-prescription.html',
  providers: [PhotoViewer]
})
export class ShowPrescriptionPage {
  presriptions = []
  server_url
  lang_direction
  constructor(public navCtrl: NavController,public helper: HelperProvider, public navParams: NavParams, private photoViewer: PhotoViewer) {
    this.server_url = helper.serviceUrl
    this.presriptions = this.navParams.get('files') 
    this.lang_direction = this.helper.lang_direction
  }
  openViewer(item){
    this.photoViewer.show(item, null, {share: false});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowPrescriptionPage');
  }

}
