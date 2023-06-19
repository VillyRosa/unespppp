import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { CasesService } from '../services/cases.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  authUser: any;
  cases: any = [];

  constructor(
    private authService: AuthService,
    private casesService: CasesService
  ) {

  }
  
  async ngOnInit() {

    this.authUser = await this.authService.getAuth();

    console.log(this.authUser);

    this.load();    

  }

  async load() {

    if (this.authUser) await firstValueFrom(this.casesService.get())
      .then(data => this.cases = data)
      .catch(error => console.log(error))

    console.log(this.cases);

  }
  
}
