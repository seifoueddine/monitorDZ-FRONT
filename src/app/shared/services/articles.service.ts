import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Articles } from '../models/articles.model';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  private serviceUrl = environment.ENDPOINTS.ARTICLES_PATH;
  private serviceForSortingUrl = environment.ENDPOINTS.ARTICLES_FOR_SORTING_PATH;
  private serviceCrawlingUrl = environment.ENDPOINTS.CRAWLING_PATH;
  private serviceAutoTagUrl = environment.ENDPOINTS.AUTO_TAG_PATH;
  private serviceChangeStatusUrl = environment.ENDPOINTS.CHANGE_STATUS_PATH;
  private serviceChangeAveUrl = environment.ENDPOINTS.CHANGE_AVE_PATH;
  private serviceClientArticlesUrl = environment.ENDPOINTS.CLIENT_ARTICLES_PATH;
  private serviceExport = environment.ENDPOINTS.EXPORT_PDF_PATH;
  private serviceSendEmailUrl = environment.ENDPOINTS.SEND_EMAIL_PATH;
  constructor(private http: HttpClient) {}

  addArticle(article: any): Observable<any> {
    return this.http.post<any>(this.serviceUrl, article);
  }


 /**
   * this method call the server to get all parks
   * @param page number of the page
   * @param active the field to sort
   * @param direction the sort direction
   * @param size the page size
   */
  getArticles(page, active, direction, size, search, media_ids): Observable<any> {
    const searchValue = search === '' ? '' : `&search=${search}`; 
    const media_idsValue = media_ids ? `&media_id=${media_ids}`  : ''; 
    const req = this.serviceUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue + media_idsValue;
    return this.http.get(req, { observe: 'response' });
  }

/**
   * this method call the server to get all parks
   * @param page number of the page
   * @param active the field to sort
   * @param direction the sort direction
   * @param size the page size
   */
  getArticlesForSorting(page, active, direction, size, search, media_ids, start_date, end_date,langValues): Observable<any> {
    const searchValue = search === '' ? '' : `&search=${search}`; 
    const media_idsValue = media_ids ? `&media_id=${media_ids}`  : ''; 
    
    const startDateValue = start_date ? `&start_date=${start_date}`  : '' ; 
    const endDateValue = end_date ? `&end_date=${end_date}`  : ''; 

    const languageValue = langValues ? `&language=${langValues}`  : ''; 
    const req = this.serviceForSortingUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue + media_idsValue + startDateValue + endDateValue + languageValue;
    return this.http.get(req, { observe: 'response' });
  }
  


/**
   * this method call the server to get all parks
   * @param page number of the page
   * @param active the field to sort
   * @param direction the sort direction
   * @param size the page size
   */
  getClientArticles(page, active, direction, size, search, media_ids, start_date, end_date, authorIds, langValues, tagsName, mediaTypes, zoneJoin): Observable<any> {
    const searchValue = search === '' ? '' : `&search=${search}`; 
    const media_idsValue = media_ids ? `&media_id=${media_ids}`  : ''; 
    
   
    const author_idsValue = authorIds ? `&authors_ids=${authorIds}`  : ''; 
    const languageValue = langValues ? `&language=${langValues}`  : ''; 
    

    const startDateValue = start_date ? `&start_date=${start_date}`  : '' ; 
    const endDateValue = end_date ? `&end_date=${end_date}`  : ''; 

    const tagsNameValue = tagsName ? `&tag_name=${tagsName}`  : ''; 
    const mediaTypesValue = mediaTypes ? `&medium_type=${mediaTypes}`  : ''; 

    const zoneJoinValue = zoneJoin ? `&media_area=${zoneJoin}`  : ''; 

    const req = this.serviceClientArticlesUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue + media_idsValue + startDateValue + endDateValue + author_idsValue + languageValue + tagsNameValue + mediaTypesValue + zoneJoinValue;
    return this.http.get(req, { observe: 'response' });
  }

  
  /**
    * this method call the server to get the article by ID
    * @param articleId
    */
  getArticleById(articleId: number): Observable<Articles> {
    const req = this.serviceUrl + `/${articleId}`;
    return this.http.get<Articles>(req);
  }

  /**
   * update the article informations
   * @param article
   */
  updateArticle(article: Articles): Observable<any> {
    const req = this.serviceUrl + `/${article.id}`;
    return this.http.put<Articles>(req, article);
  }



  deleteArticle(articleId: string): Observable<void> {
    const array = articleId.split(',');
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


  /**
   * this method call the server to make crawling
   * @param id number of the page

   */
  crawling(id: any): Observable<any> {
 

    const req = this.serviceCrawlingUrl + `?media_id=${id}`;
    return this.http.get(req, { observe: 'response' });
  }


  autoTag(slug_id?, startDate?, endDate?): Observable<any> {
    const req = this.serviceAutoTagUrl+ `?slug_id=${slug_id}&start_date=${startDate}&end_date=${endDate}`;
    return this.http.get(req, { observe: 'response' });
  }


  changeStatus(status: any,ids: string): Observable<any> {
    const object: any = {}
    object.ids = ids;
    object.status = status;
    return this.http.post<any>(this.serviceChangeStatusUrl, object);
  }


  changeAve(ave: string,ids: string): Observable<any> {
    const object: any = {}
    object.ids = ids;
    object.ave = ave;
    return this.http.post<any>(this.serviceChangeAveUrl, object);
  }


  exportPDF(id: any): Observable<any> {
    const req = this.serviceExport + `?id=${id}`;
    return this.http.get(req, { observe: 'response', responseType: 'blob' });
  }

  sendEmail(article_id: any, email: string): Observable<any> {
    const object: any = {}
    object.article_id = article_id;
    object.email = email;
    return this.http.post<any>(this.serviceSendEmailUrl, object);
  }

}
