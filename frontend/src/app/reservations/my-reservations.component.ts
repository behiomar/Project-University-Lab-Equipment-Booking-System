import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReservationItem, ReservationService } from './reservation.service';

@Component({
  selector: 'app-my-reservations',
  imports: [DatePipe],
  template: `
    <h2>My Active Reservations</h2>

    @if (loading()) { <p>Loading...</p> }
    @else if (reservations().length === 0) { <p>You have no active reservations.</p> }
    @else {
      <table>
        <thead>
          <tr><th>Equipment</th><th>From</th><th>To</th><th></th></tr>
        </thead>
        <tbody>
          @for (r of reservations(); track r.id) {
            <tr>
              <td>{{ r.equipment_name || ('#' + r.equipment_id) }}</td>
              <td>{{ r.start_date | date: 'mediumDate' }}</td>
              <td>{{ r.end_date | date: 'mediumDate' }}</td>
              <td><button (click)="cancel(r)">Cancel</button></td>
            </tr>
          }
        </tbody>
      </table>
    }
  `
})
export class MyReservationsComponent implements OnInit {
  private service = inject(ReservationService);
  reservations = signal<ReservationItem[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.service.getMine().subscribe({
      next: (list) => { this.reservations.set(list); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  cancel(r: ReservationItem) {
    if (!confirm(`Cancel this booking?`)) return;
    this.service.cancel(r.id).subscribe(() => {
      this.reservations.update((list) => list.filter((x) => x.id !== r.id));
    });
  }
}