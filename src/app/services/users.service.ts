import { Injectable } from '@angular/core';
import { FunctionsService } from './functions.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  url: string = '';
  headers: HttpHeaders;

  constructor(
    private readonly authService: AuthService,
    private readonly functionsService: FunctionsService,
    private http: HttpClient
  ) { 

    this.url = functionsService.getUrl();

    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authService.getAuth() !== undefined ? this.authService.getAuth().token : null}`
    });

  }

  changePassword(bodyRequest: IChangePassword): Observable<any> {

    console.log(bodyRequest);

    return this.http.put(this.url + 'changePassword', bodyRequest, { headers: this.headers })

  }

}
