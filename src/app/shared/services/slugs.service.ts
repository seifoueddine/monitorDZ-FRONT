import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Slugs } from '../models/slugs.model';


@Injectable({
  providedIn: 'root'
})
export class SlugsService {

  private serviceUrl = environment.ENDPOINTS.SLUGS_PATH;
  constructor(private http: HttpClient) {}

  addSlug(slug: any): Observable<any> {
    return this.http.post<any>(this.serviceUrl, slug);
  }


 /**
   * this method call the server to get all parks
   * @param page number of the page
   * @param active the field to sort
   * @param direction the sort direction
   * @param size the page size
   */
  getSlugs(page, active, direction, size, search): Observable<any> {
    const searchValue = search === '' ? '' : `&search=${search}`; 

    const req = this.serviceUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue;
    return this.http.get(req, { observe: 'response' });
  }
  /**
    * this method call the server to get the slug by ID
    * @param slugId
    */
  getSlugById(slugId: number): Observable<Slugs> {
    const req = this.serviceUrl + `/${slugId}`;
    console.log(req);
    return this.http.get<Slugs>(req);
  }

  /**
   * update the slug informations
   * @param slug
   */
  updateSlug(slug: Slugs): Observable<Slugs> {
    const req = this.serviceUrl + `/${slug.id}`;
    console.log(req);
    return this.http.put<Slugs>(req, slug);
  }



  deleteSlug(slugId: string): Observable<void> {
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
