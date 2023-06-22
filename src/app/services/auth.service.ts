import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, catchError, finalize } from 'rxjs';
import { FunctionsService } from './functions.service';
import { NavController } from '@ionic/angular';

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

interface ILogin {
  email: string;
  password: string;
  remember: boolean;
};

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnInit {

  url: string;

  authUser: any;

  constructor(
    public http: HttpClient,
    private functions: FunctionsService,
    private readonly navCtrl: NavController,
  ) { 

    this.url = this.functions.getUrl();

  }

  ngOnInit(): void {

  }

  login(login: ILogin, loading: any): Observable<any> {

    return new Observable(observable => {
      this.http.post<any>(this.url + 'login', { ...login }, { headers } as any).pipe(
        catchError(err => {
          console.log(err.error);
          loading.dismiss();
          return this.functions.alert('Ops!', '', 'Usuário ou senha incorretos!');
        }),
        finalize(() => {
          if (!observable.closed) {
            observable.complete(); // Completar a Observable quando a chamada de login terminar
          }
        })
      ).subscribe(data => {
        this.authUser = data;

        // Guardar senha aqui
        if (login.remember) {
          window.localStorage.setItem('login', JSON.stringify({ email: login.email, password: login.password }));
        }
        this.navCtrl.navigateForward('/tabs');

        observable.next(data);
      });
    });
  }

  getAuth() {
    return this.authUser;
  }

}
