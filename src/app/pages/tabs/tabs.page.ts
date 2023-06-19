import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  authUser: any;

  constructor(
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.authUser = this.authService.getAuth();
  }

}
