import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from './reservation.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  template: `
    <h2>Book equipment</h2>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>Start date
        <input type="date" formControlName="start_date" [min]="today" />
      </label>

      <label>End date
        <input type="date" formControlName="end_date" [min]="form.value.start_date || today" />
      </label>

      @if (form.errors?.['range'] && form.touched) {
        <p class="error">End date must be after the start date.</p>
      }
      @if (error()) { <p class="error">{{ error() }}</p> }

      <button type="submit" [disabled]="form.invalid || loading()">
        {{ loading() ? 'Booking...' : 'Confirm booking' }}
      </button>
    </form>
  `
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ReservationService);

  equipmentId = Number(this.route.snapshot.paramMap.get('equipmentId'));
  today = new Date().toISOString().split('T')[0];
  loading = signal(false);
  error = signal('');

  form = this.fb.group(
    {
      start_date: ['', Validators.required],
      end_date: ['', Validators.required]
    },
    {
      validators: (g) => {
        const s = g.get('start_date')?.value;
        const e = g.get('end_date')?.value;
        return s && e && s >= e ? { range: true } : null;
      }
    }
  );

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const { start_date, end_date } = this.form.value;
    this.service.create(this.equipmentId, start_date!, end_date!).subscribe({
      next: () => this.router.navigate(['/my-reservations']),
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err.status === 409
            ? 'Sorry, this equipment is already booked for those dates.'
            : err.error?.message || 'Something went wrong. Please try again.'
        );
      }
    });
  }
}