import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {

  authUser: any;

  form: any = {
    password: '',
    newPassword: '',
    repeatPassword: ''
  };

  requirementsPassword: any = {
    letters: false,
    uppercase: false,
    number: false,
    special: false
  };

  constructor(
    private authService: AuthService,
    private readonly functionsService: FunctionsService,
    private readonly usersService: UsersService,
    private loadingController: LoadingController
  ) { 

    this.authUser = authService.getAuth();

  }

  ngOnInit() {
  }

  // Função que verifica se a senha contém todos seus requisitos
  verifyPassword() {

    // Verificando se a senha tem pelo menos 8 caracteres
    this.form.newPassword.length+1 > 8 ? this.requirementsPassword.letters = true : this.requirementsPassword.letters = false;

    // Verificando se a senha tem pelo menos 1 letra maiúscula
    /[A-Z]/.test(this.form.newPassword) ? this.requirementsPassword.uppercase = true : this.requirementsPassword.uppercase = false;
    
    // Verificando se a senha tem pelo menos 1 número
    /[0-9]/.test(this.form.newPassword) ? this.requirementsPassword.number = true : this.requirementsPassword.number = false;
    
    // Verificando se a senha tem pelo menos 1 caractere especial
    /\W|_/.test(this.form.newPassword) ? this.requirementsPassword.special = true : this.requirementsPassword.special = false;

  }

  // Função que muda o type do respectivo input entre password e text e altera o ícone
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

  async changePassword(): Promise<void> {

    // Toast alerts para verificações
    if (this.form.password === '') return this.functionsService.toastAlert('top', 'Insira sua senha atual!', 'error');
    if (this.form.newPassword === '') return this.functionsService.toastAlert('top', 'Insira a nova senha!');
    if (!this.requirementsPassword.letters || !this.requirementsPassword.uppercase || !this.requirementsPassword.number || !this.requirementsPassword.special) return this.functionsService.toastAlert('top', 'A nova senha precisa cumprir todos os requisitos!', 'error');
    if (this.form.repeatPassword === '') return this.functionsService.toastAlert('top', 'Insira a repetição de senha!', 'error');
    if (this.form.newPassword !== this.form.repeatPassword) return this.functionsService.toastAlert('top', 'Nova senha e repetição não conferem!', 'error');

    const loading = await this.loadingController.create({ message: 'Alterando senha . . .' });
    await loading.present();

    let bodyRequest: any = {
      oldPassword: this.form.password,
      newPassword: this.form.newPassword,
      repeatPassword: this.form.repeatPassword,
      uid: this.authUser.UID
    };
    
    await firstValueFrom(this.usersService.changePassword(bodyRequest))
      .then(() => {
        if (window.localStorage.getItem('login')) {
          const lastStorage = window.localStorage.getItem('login');
          if (lastStorage) {
            const lastStorageJson = JSON.parse(lastStorage);
            window.localStorage.setItem('login', JSON.stringify({ email: lastStorageJson.email, password: this.form.newPassword, remember: lastStorageJson.remember }))
          }
        }
        
        this.functionsService.toastAlert('top', 'Senha alterada com sucesso!', 'success');
        this.form.password = '';
        this.form.newPassword = '';
        this.form.repeatPassword = '';
      })
      .finally(() => loading.dismiss())
      .catch((err) => this.functionsService.toastAlert('top', err.error.message, 'error'))

  }

}