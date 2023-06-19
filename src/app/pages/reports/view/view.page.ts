import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CasesService } from 'src/app/services/cases.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  userAuth: any;
  cases: any = [];
  casesFilter: any = [];

  constructor(
    private readonly authService: AuthService,
    private readonly casesService: CasesService
    ) { }
    
  async ngOnInit() {

    this.userAuth = await this.authService.getAuth();

    console.log(this.userAuth)

    this.load();

  }

  async load() {

    await firstValueFrom(this.casesService.get())
      .then(data => this.cases = data)
      .catch((err) => console.log(err))

    this.casesFilter = this.cases;

    console.log(this.cases);

  }

}
