import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';

declare var google;

 
@IonicPage({
  name:'partner-address'
})
@Component({
  selector: 'page-partner-address',
  templateUrl: 'partner-address.html',
})



export class PartnerAddressPage {


  @ViewChild('map') mapElement;
  lang_direction= "";
  map: any;
  lat; 
  lng;
  allMarkers = [] ;

  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loginservice: LoginServiceProvider, public translate: TranslateService,
    public helper: HelperProvider) {
      this.lang_direction = this.helper.lang_direction;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PartnerAddressPage');
    if(localStorage.getItem("entitylat") && localStorage.getItem("entitylong")){
      this.lat = parseFloat(localStorage.getItem("entitylat"))
      this.lng = parseFloat(localStorage.getItem("entitylong"))
      
    }
    else{
    }
    this.initMap();
  }

  initMap(){
    console.log("init map");
    let latlng = new google.maps.LatLng(31.037933,31.381523);
    var mapOptions={
     center:latlng,
      zoom:15,
      disableDefaultUI: true,
      mapTypeId:google.maps.MapTypeId.ROADMAP,

    };
    this.map=  new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    this.mapclick();
    this.locateUser();

  }
  mapclick(){
    this.map.addListener('click',(ev) => {
      console.log("click event",ev);
      this.lat = ev.latLng.lat();
      this.lng = ev.latLng.lng();
      localStorage.setItem("entitylat",String(this.lat))
      localStorage.setItem("entitylong",String(this.lng))
      console.log('lat',this.lat," lon",this.lng);
      this.addMarkerAndGetAddress();
    });
    
  }
  
  addMarkerAndGetAddress(){
    var markers;
    for(var j=0;j<this.allMarkers.length;j++)
    { 
      this.allMarkers[j].setMap(null);
    }
    this.allMarkers =[]
    markers = new google.maps.Marker({
    position: new google.maps.LatLng(this.lat, this.lng),
    map: this.map,
    animation: google.maps.Animation.DROP,
    icon: { 
    url : 'assets/icon/location.png'
     ,
    // size: new google.maps.Size(71, 71),
    scaledSize: new google.maps.Size(25, 25) 

      }
    });

    this.allMarkers.push(markers);
    this.map.setCenter(new google.maps.LatLng(this.lat, this.lng))
    this.loginservice.getaddress(this.lat,this.lng).subscribe(
      resp=>{
        console.log("resp from get address",resp);
        this.helper.serviceAddress =  JSON.parse(JSON.stringify(resp)).results[0].formatted_address;
      },err=>{
        console.log("err from get address",err);
      }
    );
   
  }
  dismiss(){
    console.log("dismiss");
    this.navCtrl.pop();
  }

  locateUser(){
    this.helper.geoLoc(data => this.getCurrentLoc(data));
  }

  getCurrentLoc(loc) {

    console.log("waitting loc " + JSON.stringify(loc))
    if (loc == "-1") {
      this.helper.presentToast(this.translate.instant("locFailed"))
    }
    else {
      this.lat = loc.inspectorLat;
      this.lng = loc.inspectorLong;
      localStorage.setItem("entitylat",String(this.lat))
      localStorage.setItem("entitylong",String(this.lng))
      this.addMarkerAndGetAddress()
    }
  }
  

}
