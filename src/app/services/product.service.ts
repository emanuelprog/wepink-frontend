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

  saveProducts(data: Product[]): Observable<HttpResponse<ResponseDTO>> {
    return this.http.post<ResponseDTO>(environment.ambiente + 'product', data, { observe: 'response' });
  }

  getProductsByMovementId(id: number): Observable<HttpResponse<ResponseDTO>> {
    return this.http.get<ResponseDTO>(environment.ambiente + `product/${id}`, { observe: 'response' });
  }

  addQuantityAudited(id: number, quantity: number): Observable<HttpResponse<ResponseDTO>> {
    return this.http.put<ResponseDTO>(`${environment.ambiente}product/add-audited/${id}/${quantity}`, {}, { observe: 'response' });
  }
}
