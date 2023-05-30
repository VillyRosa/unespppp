import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(
    private alertController: AlertController
  ) { }

  getUrl() {
    return 'http://localhost:3000/';
  }

  async alert(header: string, subHeader: string, message: string) {

    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();

  }

}
