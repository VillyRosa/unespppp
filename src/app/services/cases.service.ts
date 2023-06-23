import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { FunctionsService } from './functions.service';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

interface createCase {
  latitude: number;
  longitude: number;
  status: string;
};

interface editCase {
  latitude?: number;
  longitude?: number;
  status?: boolean;
};

@Injectable({
  providedIn: 'root'
})

export class CasesService {

  authUser: any;
  headers: HttpHeaders;
  url: string;

  constructor(
    public http: HttpClient,
    private authService: AuthService,
    private functionsService: FunctionsService
  ) { 

    this.url = this.functionsService.getUrl() + 'cases';

    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authService.getAuth() !== undefined ? this.authService.getAuth().token : null}`
    });

  }
  getCases(): Observable<any[]> {
    return this.http.get<any[]>(this.url, { headers: this.headers }).pipe(
      map((response: any[]) => {
        return response.map((caseItem: any) => ({
          latitude: caseItem.latitude,
          longitude: caseItem.longitude,
          status: caseItem.status
        }));
      })
    );
  }
  get(): Observable<any> {

    return this.http.get(this.url, { headers: this.headers })

  }

  create(newCase: createCase): Observable<any> {

    return this.http.post<any>(this.url, newCase, { headers: this.headers } as any)

  }

  edit(caseId: number, editCase: editCase): Observable<any> {

    return this.http.put<any>(this.url + `/${caseId}`, { ...editCase }, { headers: this.headers } as any)

  }

  delete(caseId: number): Observable<any> {

    return this.http.delete(this.url + `/${caseId}`, { headers: this.headers })

  }

}
