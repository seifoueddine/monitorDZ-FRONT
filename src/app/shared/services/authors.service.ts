import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Authors } from '../models/authors.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

 
  private serviceUrl = environment.ENDPOINTS.AUTHORS_PATH;
   private serviceUrlClient = environment.ENDPOINTS.AUTHORS_CLIENT_PATH;
  constructor(private http: HttpClient) {}

  getAuthorsClients(): Observable<any> {
    

    const req = this.serviceUrlClient ;
    return this.http.get(req, { observe: 'response' });
  }

  addAuthor(slug: any): Observable<any> {
    return this.http.post<any>(this.serviceUrl, slug);
  }

  /**
   * this method call the server to get all parks
   * @param page number of the page
   * @param active the field to sort
   * @param direction the sort direction
   * @param size the page size
   */
  getAuthors(page, active, direction, size, search, medium_id?): Observable<any> {
    const searchValue = search === '' ? '' : `&search=${search}`; 
    const mediumId = medium_id == undefined ? '' : `&medium_id=${medium_id}`; 
    const req = this.serviceUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}`+ mediumId + searchValue;
    return this.http.get(req, { observe: 'response' });
  }
  /**
    * this method call the server to get the slug by ID
    * @param slugId
    */
  getAuthorById(slugId: number): Observable<Authors> {
    const req = this.serviceUrl + `/${slugId}`;
    console.log(req);
    return this.http.get<Authors>(req);
  }

  /**
   * update the slug informations
   * @param slug
   */
  updateAuthor(slug: Authors): Observable<Authors> {
    const req = this.serviceUrl + `/${slug.id}`;
    console.log(req);
    return this.http.put<Authors>(req, slug);
  }



  deleteAuthor(slugId: string): Observable<void> {
    const array = slugId.split(',');
    let req = this.serviceUrl;
    if(array.length === 1){
      req = this.serviceUrl + `/${array[0]}`
    }else {
      let idsString = ''
     array.map(x=> {

      idsString = idsString + '&ids[]=' + `${x}`

      }
      )
    const  newString =  idsString.substring(1);
      req = this.serviceUrl + '/destroy_selected?' + newString;
    }
    return this.http.delete<void>(req);
  }

}
