import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservationItem {
  id: number;
  equipment_id: number;
  equipment_name?: string;
  start_date: string;
  end_date: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000/api/reservations';

  create(equipment_id: number, start_date: string, end_date: string): Observable<ReservationItem> {
    return this.http.post<ReservationItem>(this.api, { equipment_id, start_date, end_date });
  }

  getMine(): Observable<ReservationItem[]> {
    return this.http.get<ReservationItem[]>(`${this.api}/mine`);
  }

  cancel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}