import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  screen: 'login' | 'firstAcess' | 'forgetPassword' | 'resetCodeEmail' | 'resetPassword' = 'login';

  loginObj: any = {
    email: undefined,
    password: undefined
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
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService,
    private loadingController: LoadingController
  ) {

  }

  ngOnInit() {
  }

  async login() {

    if (this.loginObj.email === undefined || this.loginObj.email === '') return this.toastAlert('top', 'Preencha o campo email');
    if (this.loginObj.password === undefined || this.loginObj.password === '') return this.toastAlert('top', 'Preencha o campo senha');

    let body = {
      email: this.loginObj.email,
      password: this.loginObj.password
    }

    const loadingCtrl = await this.loadingController.create({ message: 'Entrando . . .' });
    await loadingCtrl.present();

    await firstValueFrom(this.authService.auth(body, loadingCtrl))

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

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Ops!',
      message: 'Usuário ou senha incorretos!',
      buttons: ['OK']
    });

    await alert.present();
  }

}
