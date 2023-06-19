import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, catchError } from 'rxjs';
import { FunctionsService } from './functions.service';
import { NavController } from '@ionic/angular';
// import { Storage } from '@ionic/storage';

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

interface ILogin {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  authUser: any;

  constructor(
    public http: HttpClient,
    private functions: FunctionsService,
    private readonly navCtrl: NavController,
  ) { }

  ngOnInit(): void {
    
  }

  auth(login: ILogin, loading: any): Observable<any> {

    return new Observable(observable => {

      this.login(login, loading)
      .subscribe({
        next: async data => {
          
          if (!data.message) {

            this.authUser = data;

            // Guardar senha aq
            this.navCtrl.navigateForward('/tabs')

            observable.next(data)

          }

        }
      })

    })

  }

  login(login: ILogin, loading: any): Observable<any> {

    const url = 'http://localhost:3000/login';

    return this.http.post<any>(url, { ...login }, { headers } as any).pipe(
      catchError(err => {
        console.log(err.error);
        loading.dismiss();
        return this.functions.alert('Ops!', '', 'Usuário ou senha incorretos!');
      })
    )

  }

  getAuth() {
    return this.authUser;
  }

}
