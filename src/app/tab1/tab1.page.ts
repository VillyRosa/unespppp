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

  constructor(
    private authService: AuthService,
    private cases: CasesService
  ) {

  }
  
  async ngOnInit() {

    this.authUser = await this.authService.getAuth();

    console.log(this.authUser);

    await firstValueFrom(this.cases.get())
    .then(data => console.log(data))
    .catch(error => console.log(error))

  }
  
}
