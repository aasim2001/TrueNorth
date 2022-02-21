import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchOtption, userDetails } from './global-model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  domain = 'https://api.github.com/';

  constructor(private http: HttpClient) { }

  searchUser(val): Observable<SearchOtption> {
    return this.http.get<SearchOtption>(`${this.domain}search/users?q=${val}+in:user&per_page=10`);
  }

  userDetails(val): Observable<userDetails> {
    return this.http.get<userDetails>(`${this.domain}users/` + val);
  }

  repoDetails(url): Observable<any> {
    return this.http.get<any>(url);
  }
}
