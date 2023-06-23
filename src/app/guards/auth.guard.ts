import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  async canActivate(): Promise<boolean> {
    if (window.localStorage.getItem('visitAcess')) return true;
    if (this.authService.getAuth() !== undefined) return true;

    const isAuthenticated = window.localStorage.getItem('login');

    if (isAuthenticated) {
      const loading = await this.loadingController.create({ spinner: 'dots' });
      await loading.present();

      try {
        const data = await firstValueFrom(this.authService.login(JSON.parse(isAuthenticated), null));
        return true;
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        loading.dismiss();
      }
    } else {
      this.router.navigate(['/login']);
      return false; 
    }
  }
}
