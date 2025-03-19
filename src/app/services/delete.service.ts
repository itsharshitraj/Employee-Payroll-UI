import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payroll } from '../home/home.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  constructor(private http: HttpClient) {}


  deleteData(person: Payroll) {
    this.http.delete(environment.apiUrl + '/api/employees/' + person.id)
      .subscribe({
        next: (data) => {
          console.log('Data deleted:', data);
          if (data === 'Employee deleted successfully') {
            console.log('Success: Employee deleted successfully');
          }
        },
        error: (err) => {
          console.error('Error deleting data:', err);
        }
      });
  }  
}
