import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CasesService } from 'src/app/services/cases.service';
import { MapsService } from 'src/app/services/maps.service';
import { ViacepService } from 'src/app/services/viacep.service';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.page.html',
  styleUrls: ['./insert.page.scss'],
})

export class InsertPage implements OnInit {

  screen: 'adress' | 'status' = 'adress';

  case: any = {
    adress: {
      cep: '',
      street: '',
      neighborhood: '',
      number: ''
    },
    latitude: '',
    longitude: '',
    status: ''
  }

  constructor(
    public readonly authService: AuthService,
    public readonly casesService: CasesService,
    public readonly viacepService: ViacepService,
    public readonly mapsService: MapsService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async searchCep() {

    if (this.case.adress.cep.length !== 9) return;

    const loading = await this.loadingController.create({ message: 'Buscando cep . . .' });
    await loading.present();

    let resp: any;
    await firstValueFrom(this.viacepService.get(this.case.adress.cep))
      .then((data) => resp = data)
      .finally(() => loading.dismiss())
      .catch((err) => console.log(err))

    if (resp.erro) {
      this.case.adress.cep = '';
      return this.toastAlert('top', 'O cep informado é inválido!');
    }
    
    this.case.adress.street = resp.logradouro;
    this.case.adress.neighborhood = resp.bairro;

  }

  async saveCase() {

    if (this.case.adress.neighborhood === '') return this.toastAlert('top', 'Informe o bairro!');
    if (this.case.adress.street === '') return this.toastAlert('top', 'Informe a rua!');
    if (this.case.adress.number === '') return this.toastAlert('top', 'Informe o número!');
    if (this.case.status === '') return this.toastAlert('top', 'Informe o status!');

    const loading = await this.loadingController.create({ message: 'Cadastrando caso . . .' });
    await loading.present();

    // Comunicar com a api do google para obter as coordenadas do endereço
    let adressToSend = `${this.case.adress.street}, ${this.case.adress.number} - ${this.case.adress.neighborhood}, Araçatuba - SP, Brazil`;
    let result: any;
    await firstValueFrom(this.mapsService.adressToCoordinates(adressToSend))
      .then(data => result = data)
      .catch(err => console.log(err))
    
    result = result.results[0].geometry.location;

    this.case.latitude = result.lat;
    this.case.longitude = result.lng;
    delete this.case.adress;

    // Enviar o caso para o back-end

    await firstValueFrom(this.casesService.create(this.case))
      .then(data => console.log(data))
      .finally(() => loading.dismiss())
      .catch(err => console.log(err))

  }

  async toastAlert(position: 'top' | 'middle' | 'bottom', message: string, duration: number = 1500) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
      icon: 'alert-circle',
      cssClass: 'toastAlert'
    });

    await toast.present();
  }

}
