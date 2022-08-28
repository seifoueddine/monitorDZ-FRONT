import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tags } from '../models/tags.model';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  private serviceUrl = environment.ENDPOINTS.TAGS_PATH;
  constructor(private http: HttpClient) {}

  addTag(tag: any): Observable<any> {
    return this.http.post<any>(this.serviceUrl, tag);
  }


 /**
   * this method call the server to get all parks
   * @param page number of the page
   * @param active the field to sort
   * @param direction the sort direction
   * @param size the page size
   */
  getTags(page, active, direction, size, search): Observable<any> {
    const searchValue = search === '' ? '' : `&search=${search}`; 

    const req = this.serviceUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue;
    return this.http.get(req, { observe: 'response' });
  }
  /**
    * this method call the server to get the tag by ID
    * @param tagId
    */
  getTagById(tagId: number): Observable<Tags> {
    const req = this.serviceUrl + `/${tagId}`;
     
    return this.http.get<Tags>(req);
  }

  /**
   * update the tag informations
   * @param tag
   */
  updateTag(tag: Tags): Observable<Tags> {
    const req = this.serviceUrl + `/${tag.id}`;
     
    return this.http.put<Tags>(req, tag);
  }



  deleteTag(tagId: string): Observable<void> {
    const array = tagId.split(',');
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
