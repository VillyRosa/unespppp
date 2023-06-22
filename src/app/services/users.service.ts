import { Injectable } from '@angular/core';
import { FunctionsService } from './functions.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  udi: string;
}

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  url: string = '';

  constructor(
    private readonly functionsService: FunctionsService,
    private http: HttpClient
  ) { 

    this.url = functionsService.getUrl();

  }

  changePassword(bodyRequest: IChangePassword): Observable<any> {

    return this.http.put(this.url + 'changePassword', bodyRequest)

  }

}
