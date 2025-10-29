import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getAllUsers(): Observable<any>{
    return this.http.get(`${environment.Endpoint}/user/list`)
      .pipe(
        take(1),
        map((data:any) => data?.data)
      );
  }
  addUser(payload: any){
    return this.http.post(`${environment.Endpoint}/user/new`, payload);
  }
  deleteUser(id: string){
    return this.http.delete(`${environment.Endpoint}/user/delete/${id}`);
  }
}
