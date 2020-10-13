import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';


/**
 * Generated class for the OrderdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orderdate',
  templateUrl: 'orderdate.html',
})
export class OrderdatePage {
  lang_direction= ""
  constructor(public helper: HelperProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.lang_direction = this.helper.lang_direction;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderdatePage');
  }

}
