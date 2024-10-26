import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDTO } from '../models/response.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  saveProduct(data: Product): Observable<HttpResponse<ResponseDTO>> {
    return this.http.post<ResponseDTO>(environment.ambiente + 'product', data, { observe: 'response' });
  }

  getAllProducts(): Observable<HttpResponse<ResponseDTO>> {
    return this.http.get<ResponseDTO>(environment.ambiente + 'product', { observe: 'response' });
  }

  plusQuantityProduct(id: number, amount: number): Observable<HttpResponse<ResponseDTO>> {
    return this.http.put<ResponseDTO>(`${environment.ambiente}product/plus/${id}/${amount}`, {}, { observe: 'response' });
  }

  minusQuantityProduct(id: number, amount: number): Observable<HttpResponse<ResponseDTO>> {
    return this.http.put<ResponseDTO>(`${environment.ambiente}product/minus/${id}/${amount}`,{},{ observe: 'response' });
  }
}
