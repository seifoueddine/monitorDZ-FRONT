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
  search(page, active, direction, size, key, authorIds, start_date, end_date, langValues, tagsName,mediaTypes, zoneJoin , media_ids): Observable<any> { 
    const searchValue = key === '' ? '' : `&search=${key}`; 
    const media_idsValue = media_ids ? `&media_id=${media_ids}`  : ''; 
    
   
    const author_idsValue = authorIds ? `&authors_ids=${authorIds}`  : ''; 
   const languageValue = langValues ? `&language=${langValues}`  : ''; 
    

     const startDateValue = start_date ? `&start_date=${start_date}`  : '' ; 
     const endDateValue = end_date ? `&end_date=${end_date}`  : ''; 

     const tagsNameValue = tagsName ? `&tag_name=${tagsName}`  : ''; 
     const mediaTypesValue = mediaTypes ? `&medium_type=${mediaTypes}`  : ''; 

     const zoneJoinValue = zoneJoin ? `&media_area=${zoneJoin}`  : ''; 

    const req = this.serviceUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue + author_idsValue + startDateValue + endDateValue + languageValue + tagsNameValue + mediaTypesValue + zoneJoinValue + media_idsValue;
    return this.http.get(req, { observe: 'response' });
  }
}
