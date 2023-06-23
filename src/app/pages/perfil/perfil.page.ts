import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  userAuth: any;

  leave: boolean = false;

  constructor(
    private readonly navCtrl: NavController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  async ngOnInit() {

    const loading = await this.loadingController.create({  message: 'Carregando . . .' });
    await loading.present();

    this.userAuth = await this.authService.getAuth();

    loading.dismiss();

  }

  toggleLeave() {
    return this.leave = !this.leave;
  }

  leaveAcount() {
    this.authService.authUser = undefined;
    window.localStorage.clear();
    this.navCtrl.navigateForward('/login');
    this.leave = false;
  }

}
