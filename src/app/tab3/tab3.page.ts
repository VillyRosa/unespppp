import { Component, ElementRef, ViewChild } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  @ViewChild('map', { static: false }) mapElement?: ElementRef;

  constructor() {}

  ionViewDidEnter() {
    const mapEle = this.mapElement?.nativeElement;

    if (mapEle) {
      const map = new google.maps.Map(mapEle, {
       center: { lat: -21.2084, lng:  -50.4266 }, // Defina o centro do mapa como preferir
        zoom: 12 // Defina o nível de zoom como preferir
      });

      const kmlLayer = new google.maps.KmlLayer({
        url: './src/assets/Meus lugares araçatuba.kml', // Substitua pelo caminho correto para o seu arquivo KML
        map: map
      });
    }
  }
  
 
}