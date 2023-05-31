import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  authUser: any;

  leave: boolean = false;

  constructor(
    private readonly navCtrl: NavController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  async ngOnInit() {

    const loading = await this.loadingController.create({  message: 'Carregando . . .' });
    await loading.present();

    this.authUser = await this.authService.getAuth();

    loading.dismiss();

  }

  toggleLeave() {
    return this.leave = !this.leave;
  }

  leaveAcount() {
    this.navCtrl.navigateForward('');
  }

}
