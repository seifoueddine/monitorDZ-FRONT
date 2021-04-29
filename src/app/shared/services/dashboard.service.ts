import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private serviceUrl = environment.ENDPOINTS.ARTICLE_BY_MEDIUM_PATH;
  private serviceAuthorUrl = environment.ENDPOINTS.ARTICLE_BY_AUTHOR_PATH;
  constructor(private http: HttpClient) {}


  getArticleByMedium(): Observable<any> {
   // const searchValue = date === '' ? '' : `&search=${date}`; 

    const req = this.serviceUrl;
    return this.http.get(req, { observe: 'response' });
  }

  getArticleByAuthor(): Observable<any> {
   // const searchValue = date === '' ? '' : `&search=${date}`; 

    const req = this.serviceAuthorUrl;
    return this.http.get(req, { observe: 'response' });
  }
}
