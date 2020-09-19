import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

 
  private serviceUrl = environment.ENDPOINTS.AUTHORS_PATH;
  constructor(private http: HttpClient) {}

  getAuthors(): Observable<any> {
    

    const req = this.serviceUrl ;
    return this.http.get(req, { observe: 'response' });
  }

}
