import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDTO } from '../models/response.model';
import { Movement } from '../models/movement.model';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  movement: Movement | undefined;

  constructor(private http: HttpClient) { }

  setMovement(movement: Movement) {
    this.movement = movement;
  }

  saveMovement(data: Movement): Observable<HttpResponse<ResponseDTO>> {
    return this.http.post<ResponseDTO>(environment.ambiente + 'movement', data, { observe: 'response' });
  }

  getAllMovements(): Observable<HttpResponse<ResponseDTO>> {
    return this.http.get<ResponseDTO>(environment.ambiente + 'movement', { observe: 'response' });
  }
}
