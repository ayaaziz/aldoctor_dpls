import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { NotificationPage } from '../notification/notification';
import { Events, NavParams} from 'ionic-angular';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  notiCount = 0
  audio: any;
  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = NotificationPage;

  tabIndex: Number = 0;

  constructor(public events: Events,public params: NavParams) {
    this.audio = new Audio();
    this.audio.src = 'assets/mp3/notify.mp3';
      this.audio.load();
    this.events.subscribe('lengthdata', (count) => {
      
      this.notiCount = count;
      if(parseInt(count)>0){
        this.audio.play()
        setTimeout(() => {
          this.audio.pause()
        }, 1000);
      }
  });


    let tabIndex = this.params.get('tabIndex');
    if (tabIndex) {
      this.tabIndex = tabIndex;
    }

  }
  
}
