import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

const key = 'AIzaSyCqpJw6js0BaYtkQijSa6wS8pb_ScLw0PA';


@Injectable({
  providedIn: 'root'
})

export class MapsService {

  constructor(
    public http: HttpClient,
  ) { }

  adressToCoordinates(adress: string) {

    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${adress}&key=${key}`)

  }

  coordinatesToAdress(coordinates: string) {

    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates}&key=${key}`)

  }

}
