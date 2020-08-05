import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaigns } from '../models/campaigns.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {

  private serviceUrl = environment.ENDPOINTS.CAMPAIGNS_PATH;
  constructor(private http: HttpClient) {}

  addCampaign(sector: any): Observable<any> {
    return this.http.post<any>(this.serviceUrl, sector);
  }


 /**
   * this method call the server to get all parks
   * @param page number of the page
   * @param active the field to sort
   * @param direction the sort direction
   * @param size the page size
   */
  getCampaign(page, active, direction, size, search): Observable<any> {
    const searchValue = search === '' ? '' : `&search=${search}`; 

    const req = this.serviceUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue;
    return this.http.get(req, { observe: 'response' });
  }
  /**
    * this method call the server to get the sector by ID
    * @param sectorId
    */
  getCampaignById(sectorId: number): Observable<Campaigns> {
    const req = this.serviceUrl + `/${sectorId}`;
    console.log(req);
    return this.http.get<Campaigns>(req);
  }

  /**
   * update the sector informations
   * @param sector
   */
  updateCampaign(sector: Campaigns): Observable<Campaigns> {
    const req = this.serviceUrl + `/${sector.id}`;
    console.log(req);
    return this.http.put<Campaigns>(req, sector);
  }



  deleteCampaign(sectorId: string): Observable<void> {
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
