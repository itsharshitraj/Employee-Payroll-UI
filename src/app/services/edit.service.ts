import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payroll } from '../home/home.component';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  constructor(private http: HttpClient) {}

  editData(person: Payroll): Observable<any> {
    return this.http.put(environment.apiUrl +'/api/employees/'+ person.id,
       person);
  }
}