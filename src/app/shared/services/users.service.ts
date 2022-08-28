import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private serviceUrl = environment.ENDPOINTS.USERS_PATH;
  private changePasswordUrl = environment.ENDPOINTS.CHANGE_PASSWORD_PATH; 
  constructor(private http: HttpClient) {}

  addUser(user: FormData): Observable<any> {
    return this.http.post<any>(this.serviceUrl, user);
  }


  /**
   * this method call the server to get all the contact-bases
   * @param page number of the page
   * @param active the field to sort
   * @param direction the sort direction
   * @param size the page size
   */
  getUsers(page, active, direction, size, search): Observable<any> {
    const searchValue = search === '' ? '' : `&search=${search}`; 
    const req = this.serviceUrl + `?page=${page}&per_page=${size}&order=${active}&direction=${direction}` + searchValue;
    return this.http.get(req, { observe: 'response' });
  }
  /**
    * this method call the server to get the user by ID
    * @param userId
    */
  getUserById(userId: number): Observable<Users> {
    const req = this.serviceUrl + `/${userId}`;
     
    return this.http.get<Users>(req);
  }

  /**
   * update the user informations
   * @param user
   * @param userId
   */
  updateUser(user: FormData, userId: any): Observable<Users> {
    const req = this.serviceUrl + `/${userId}`;
    return this.http.put<any>(req, user);
  }

  /**
   * update the user informations
   * @param user
   */
  changePassword(user: any): Observable<Users> {
    const req = this.changePasswordUrl + `${user.id}`;
    return this.http.put<Users>(req, user);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(this.serviceUrl + `/${userId}`);
  }

}
