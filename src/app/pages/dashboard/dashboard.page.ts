import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { CasesService } from '../../services/cases.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  authUser: any;
  cases: any = [];

  constructor(
    private authService: AuthService,
    private casesService: CasesService
  ) {

  }
  
  async ngOnInit() {

    this.authUser = await this.authService.getAuth();

    this.load();    

  }

  async load() {

    if (this.authUser) await firstValueFrom(this.casesService.get())
      .then(data => this.cases = data)
      .catch(error => console.log(error))

    console.log(this.cases);

  }
  
}
