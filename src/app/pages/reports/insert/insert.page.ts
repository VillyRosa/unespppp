import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CasesService } from 'src/app/services/cases.service';
import { FunctionsService } from 'src/app/services/functions.service';
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
  };

  state: any;

  constructor(
    public readonly functionsService: FunctionsService,
    public readonly authService: AuthService,
    public readonly casesService: CasesService,
    public readonly viacepService: ViacepService,
    public readonly mapsService: MapsService,
    private router: Router,
    private loadingController: LoadingController,
    private location: Location
  ) { 

    const navig = this.router.getCurrentNavigation();
    this.state = {};
    this.state = navig?.extras?.state || undefined;

  }

  async ngOnInit(): Promise<void> {

    if (this.state !== undefined) {

      const loading = await this.loadingController.create({ message: 'Carregando dados . . .' });
      await loading.present();

      this.case.latitude = this.state.latitude;
      this.case.longitude = this.state.longitude;
      this.case.status = this.state.status;

      let components: any;
      await firstValueFrom(this.mapsService.coordinatesToAdress(`${this.case.latitude},${this.case.longitude}`))
        .then((data) => components = data)
        .catch((err) => console.log(err))
      components = components.results[0].address_components;

      this.case.adress.cep = components[6].short_name;
      this.case.adress.street = components[1].short_name;
      this.case.adress.neighborhood = components[2].short_name;
      this.case.adress.number = components[0].short_name;

      loading.dismiss();

    }

  }

  async searchCep(): Promise<void> {

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
      return this.functionsService.toastAlert('top', 'O cep informado é inválido!');
    }

    if (resp.localidade !== 'Araçatuba') {
      this.case.adress.cep = '';
      return this.functionsService.toastAlert('top', 'O cep informado não é de Araçatuba!');
    }
    
    this.case.adress.street = resp.logradouro;
    this.case.adress.neighborhood = resp.bairro;

  }

  verifies(): boolean {

    if (this.case.adress.neighborhood === '') {
      this.functionsService.toastAlert('top', 'Informe o bairro!');
      return false;
    }

    if (this.case.adress.street === '') {
      this.functionsService.toastAlert('top', 'Informe a rua!');
      return false;
    }

    if (this.case.adress.number === '') {
      this.functionsService.toastAlert('top', 'Informe o número!');
      return false;
    }
    
    if (this.case.status === '') {
      this.functionsService.toastAlert('top', 'Informe o status!');
      return false;
    }

    return true;

  }

  async saveCase(): Promise<void> {

    if (!this.verifies()) return;

    const loading = await this.loadingController.create({ message: 'Cadastrando caso . . .' });
    await loading.present();

    await this.getCoordinates();

    // Enviar o caso para o back-end
    await firstValueFrom(this.casesService.create(this.case))
      .then(data => this.functionsService.alert('Sucesso!', '', data.message))
      .finally(() => loading.dismiss())
      .catch(err => console.log(err))

    this.location.back();

  }

  async updateCase(): Promise<void> {

    if (!this.verifies()) return;

    const loading = await this.loadingController.create({ message: 'Atualizando caso . . .' });
    await loading.present();

    await this.getCoordinates();

    // Enviar o caso para o back-end
    await firstValueFrom(this.casesService.edit(this.state.ID, this.case))
      .then(data => this.functionsService.alert('Sucesso!', '', data.message))
      .finally(() => loading.dismiss())
      .catch(err => console.log(err))

    this.location.back();

  }

  async getCoordinates(): Promise<void> {
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
  }

}
