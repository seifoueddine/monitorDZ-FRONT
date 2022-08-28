
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lists } from '../models/lists.model';


@Injectable({
  providedIn: 'root'
})
export class ListsService {

  private serviceUrl = environment.ENDPOINTS.LISTS_PATH;
  constructor(private http: HttpClient) {}

  addList(list: any): Observable<any> {
    return this.http.post<any>(this.serviceUrl, list);
  }


 /**
   * this method call the server to get all parks
   * @param page number of the page
   * @param active the field to sort
   * @param direction the sort direction
   * @param size the page size
   */
  getLists(page, active, direction, size, search): Observable<any> {
    const searchValue = search === '' ? '' : `&search=${search}`; 

    const req = this.serviceUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue;
    return this.http.get(req, { observe: 'response' });
  }
  /**
    * this method call the server to get the list by ID
    * @param listId
    */
  getListById(listId: number): Observable<Lists> {
    const req = this.serviceUrl + `/${listId}`;
     
    return this.http.get<Lists>(req);
  }

  /**
   * update the list informations
   * @param list
   */
  updateList(list: Lists): Observable<Lists> {
    const req = this.serviceUrl + `/${list.id}`;
     
    return this.http.put<Lists>(req, list);
  }



  deleteList(listId: string): Observable<void> {
    const array = listId.split(',');
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
