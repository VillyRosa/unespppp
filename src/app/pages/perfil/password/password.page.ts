import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

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
    private authService: AuthService
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

}