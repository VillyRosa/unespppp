import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, map } from 'rxjs';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  screen: 'login' | 'firstAcess' | 'forgetPassword' | 'resetCodeEmail' | 'resetPassword' = 'login';

  loginObj: any = {
    email: undefined,
    password: undefined,
    remember: false
  };

  firstAcessObj: any = {
    cpf: undefined,
    email: undefined
  };

  //otp (codigo de validação)
  config = {
    length: 5,
    allowNumbersOnly: true,
    inputStyles: {
      'width' : '50px',
      'height' : '68px',
      'color' : '#7F56D9',
      'font-size' : '35px',
      'font-family' : 'sans-serif',
      'font-weight' : '600',
      'background' : 'white',
      'border' : 'solid 1px #D6BBFB',
      'border-radius' : '4px'
    }
  };

  constructor(
    private readonly functionsService: FunctionsService,
    private authService: AuthService,
    private loadingController: LoadingController
  ) {

  }

  ngOnInit(): void {

    this.load();

  }

  async load() {
    if (window.localStorage.getItem('login') !== undefined) {
      let aux: any = window.localStorage.getItem('login');
      if (aux !== null) {
        aux = JSON.parse(aux);
        if (aux) {
          aux.remember = true;
          await firstValueFrom(this.authService.login(aux, 'awd'));
        }
      }
    }
  }

  async login() {

    if (this.loginObj.email === undefined || this.loginObj.email === '') return this.functionsService.toastAlert('top', 'Preencha o campo email');
    if (this.loginObj.password === undefined || this.loginObj.password === '') return this.functionsService.toastAlert('top', 'Preencha o campo senha');

    let body = {
      email: this.loginObj.email,
      password: this.loginObj.password,
      remember: this.loginObj.remember
    }

    const loadingCtrl = await this.loadingController.create({ message: 'Entrando . . .' });
    await loadingCtrl.present();

    await firstValueFrom(this.authService.login(body, loadingCtrl))

    return loadingCtrl.dismiss();

  }

  async firstAcess() {

  }

  toggleType(input: string, icon: string) {

    let auxInput: any = document.querySelector(`#${input}`);
    let auxIcon: any = document.querySelector(`#${icon}`);

    if (auxIcon.name === 'eye-off-outline') {

      auxIcon.name = 'eye-outline';
      auxInput.type = 'text';

    } else {

      auxIcon.name = 'eye-off-outline';
      auxInput.type = 'password';

    }

  }

}
