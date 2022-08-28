import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media } from '../models/media.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private serviceUrl = environment.ENDPOINTS.MEDIA_PATH;
  constructor(private http: HttpClient) {}

  addMedia(media: any): Observable<any> {
    return this.http.post<any>(this.serviceUrl, media);
  }


 /**
   * this method call the server to get all parks
   * @param page number of the page
   * @param active the field to sort
   * @param direction the sort direction
   * @param size the page size
   */
  getMedia(page, active, direction, size, search): Observable<any> {
    const searchValue = search === '' ? '' : `&search=${search}`; 

    const req = this.serviceUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue;
    return this.http.get(req, { observe: 'response' });
  }
  /**
    * this method call the server to get the media by ID
    * @param sectorId
    */
  getMediaById(sectorId: number): Observable<Media> {
    const req = this.serviceUrl + `/${sectorId}`;
     
    return this.http.get<Media>(req);
  }

  /**
   * update the media informations
   * @param media
   */
  updateMedia(media: FormData, mediaId: any): Observable<Media> {
    const req = this.serviceUrl + `/${mediaId}`;
     
    return this.http.put<Media>(req, media);
  }



  deleteMedia(sectorId: string): Observable<void> {
    const array = sectorId.split(',');
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
