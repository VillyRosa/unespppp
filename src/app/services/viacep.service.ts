import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})

export class ViacepService {

  constructor(
    public http: HttpClient,
  ) { }

  get(cep: string) {

    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`)

  }

}
