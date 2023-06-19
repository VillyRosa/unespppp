import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit {

  authUser: any;

  form: any = {
    name: '',
    cpf: '',
  };

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController
    ) { 

      this.authUser = this.authService.getAuth();
      
    }

  async ngOnInit() {

    const loading = await this.loadingController.create({  message: 'Carregando . . .' });
    await loading.present();

    if (this.authUser) {
      
      this.form.name = this.authUser.name;
      this.form.cpf = this.authUser.cpf;
      
    }

    loading.dismiss();

  }

}