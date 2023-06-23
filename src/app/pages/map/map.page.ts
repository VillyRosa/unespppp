import { Component, ElementRef, ViewChild } from '@angular/core';
import { CasesService } from 'src/app/services/cases.service';
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})
export class MapPage {

 
  @ViewChild('map', { static: false }) mapElement?: ElementRef;
  map: any;

  constructor(private casesService: CasesService) {}

  ionViewDidEnter() {
    const mapEle = this.mapElement?.nativeElement;

    if (mapEle) {
      this.map = new google.maps.Map(mapEle, {
        center: { lat: -21.2084, lng: -50.4266 },
        zoom: 12
      });

      const geojsonUrl = './assets/data/Meus_lugares_aracatuba.geojson';

      const geojsonLayer = new google.maps.Data();
      geojsonLayer.loadGeoJson(geojsonUrl);
      geojsonLayer.setMap(this.map);

      this.casesService.getCases().subscribe(
        (cases: any[]) => {
          const mappedCases = cases.map((caseItem) => ({
            latitude: parseFloat(caseItem.latitude),
            longitude: parseFloat(caseItem.longitude),
            status: caseItem.status
          }));
          this.displayCasesOnMap(mappedCases);
        },
        (error) => {
          console.log(error);
        }
      );
      
    }
  }

  displayCasesOnMap(cases: any[]) {
    cases.forEach((caseItem) => {
      let markerColor = '';

      if (caseItem.status === 'positivo') {
        markerColor = 'red';
      } else if (caseItem.status === 'suspeito') {
        markerColor = 'yellow';
      } else if (caseItem.status === 'negativo') {
        markerColor = 'green';
      }

      const marker = new google.maps.Marker({
        position: { lat: caseItem.latitude, lng: caseItem.longitude },
        map: this.map,
        title: caseItem.status,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 12
        }
      });
    });
    console.log(cases)
  }
}