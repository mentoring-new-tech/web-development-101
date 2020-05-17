import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // lib used to make http calls to our back-end
import { Observable } from 'rxjs'; // as the HttpClient returns a Observable, we must use this lib too

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  constructor(private http: HttpClient) { }

  /**
   * For each endpoint in our Suppliers Back-end, we must create a method to call its respective endpoint
   */

  getAll(): Observable<any> {
    return this.http.get('/api/v1/suppliers/');
  }

  getOne(id: string): Observable<any> {
    return this.http.get(`/api/v1/suppliers/${id}`);
  }

  create(name: string, cnpj: string, address: string, tel: string): Observable<any> {
    let body = {
      name: name,
      cnpj: cnpj,
      address: address,
      tel: tel
    }
    return this.http.post('/api/v1/suppliers/', body);
  }

  update(id: string, name: string, cnpj: string, address: string, tel: string): Observable<any> {
    let body = {
      name: name,
      cnpj: cnpj,
      address: address,
      tel: tel
    }
    return this.http.put(`/api/v1/suppliers/${id}`, body);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`/api/v1/suppliers/${id}`);
  }

}
