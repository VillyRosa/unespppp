import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, catchError, finalize, observable, throwError } from 'rxjs';
import { FunctionsService } from './functions.service';
import { NavController } from '@ionic/angular';

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
export class AuthService {

  private authUser: any;

  constructor(
    public http: HttpClient,
    private functions: FunctionsService,
    private readonly navCtrl: NavController
  ) { }

  auth(login: ILogin): Observable<any> {

    return new Observable(observable => {

      this.login(login)
      .subscribe({
        next: async data => {
          
          if (!data.message) {
            
            console.log(data);

            this.authUser = data;

            // Guardar senha aq
            this.navCtrl.navigateForward('/tabs')

            observable.next(data)

          }

        }
      })

    })

  }

  login(login: ILogin): Observable<any> {

    const url = 'http://localhost:3000/login';

    return this.http.post<any>(url, { ...login }, { headers } as any).pipe(
      catchError(err => {
        return this.functions.alert('Ops!', '', 'Usuário ou senha incorretos!')
      })
    )

  }

  getAuth() {
    return this.authUser;
  }

}