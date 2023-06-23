import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  userAuth: any;

  constructor(
    authService: AuthService
  ) { 
    this.userAuth = authService.getAuth();
  }

  ngOnInit() {
  }

}
