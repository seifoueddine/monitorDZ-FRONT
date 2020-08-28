import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private serviceUrl = environment.ENDPOINTS.SEARCH_ARTICLES_PATH; 
  constructor(private http: HttpClient) { }

  
 /**
   * this method call the server to get all parks
   * @param page number of the page
   * @param active the field to sort
   * @param direction the sort direction
   * @param size the page size
   */
  search(page, active, direction, size, key): Observable<any> {
    const searchValue = key === '' ? '' : `&search=${key}`; 

    const req = this.serviceUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue ;
    return this.http.get(req, { observe: 'response' });
  }
}
