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
  private serviceCrawlingUrl = environment.ENDPOINTS.CRAWLING_PATH;
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
  getArticles(page, active, direction, size, search): Observable<any> {
    const searchValue = search === '' ? '' : `&search=${search}`; 

    const req = this.serviceUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue;
    return this.http.get(req, { observe: 'response' });
  }
  /**
    * this method call the server to get the article by ID
    * @param articleId
    */
  getArticleById(articleId: number): Observable<Articles> {
    const req = this.serviceUrl + `/${articleId}`;
    console.log(req);
    return this.http.get<Articles>(req);
  }

  /**
   * update the article informations
   * @param article
   */
  updateArticle(article: Articles): Observable<Articles> {
    const req = this.serviceUrl + `/${article.id}`;
    console.log(req);
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



}
