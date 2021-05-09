import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientDashboardService {

  private serviceUrl = environment.ENDPOINTS.ARTICLE_BY_MEDIUM_PATH;
  private serviceAuthorUrl = environment.ENDPOINTS.ARTICLE_BY_AUTHOR_PATH;
  private serviceTagUrl = environment.ENDPOINTS.ARTICLE_BY_TAG_PATH;
  private serviceDateUrl = environment.ENDPOINTS.ARTICLE_BY_DATE_PATH;
  constructor(private http: HttpClient) {}


  getArticleByMedium(startDate: any, endDate: any): Observable<any> {
    const start_date = `?start_date=${startDate}`; 
    const end_date = `&end_date=${endDate}`; 
    const req = this.serviceUrl +start_date + end_date;
    return this.http.get(req, { observe: 'response' });
  }

  getArticleByAuthor(): Observable<any> {
   // const searchValue = date === '' ? '' : `&search=${date}`; 

    const req = this.serviceAuthorUrl;
    return this.http.get(req, { observe: 'response' });
  }

  getArticleByTag(): Observable<any> {
    // const searchValue = date === '' ? '' : `&search=${date}`; 
 
     const req = this.serviceTagUrl;
     return this.http.get(req, { observe: 'response' });
   }

   getArticleByDate(days): Observable<any> {
     const daysValue =  days === undefined ? '' :  `?number_days=${days}`; 
 
     const req = this.serviceDateUrl + daysValue;
     return this.http.get(req, { observe: 'response' });
   }
   
}
