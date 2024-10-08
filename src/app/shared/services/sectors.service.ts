import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Sectors } from '../models/sectors.model';

@Injectable({
  providedIn: 'root'
})
export class SectorsService {

  private serviceUrl = environment.ENDPOINTS.SECTORS_PATH;
  constructor(private http: HttpClient) {}

  addSector(sector: any): Observable<any> {
    return this.http.post<any>(this.serviceUrl, sector);
  }


 /**
   * this method call the server to get all parks
   * @param page number of the page
   * @param active the field to sort
   * @param direction the sort direction
   * @param size the page size
   */
  getSectors(page, active, direction, size, search): Observable<any> {
    const searchValue = search === '' ? '' : `&search=${search}`; 

    const req = this.serviceUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue;
    return this.http.get(req, { observe: 'response' });
  }
  /**
    * this method call the server to get the sector by ID
    * @param sectorId
    */
  getSectorById(sectorId: number): Observable<Sectors> {
    const req = this.serviceUrl + `/${sectorId}`;
     
    return this.http.get<Sectors>(req);
  }

  /**
   * update the sector informations
   * @param sector
   */
  updateSector(sector: Sectors): Observable<Sectors> {
    const req = this.serviceUrl + `/${sector.id}`;
     
    return this.http.put<Sectors>(req, sector);
  }



  deleteSector(sectorId: string): Observable<void> {
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
