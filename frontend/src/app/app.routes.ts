import { Routes } from '@angular/router';
import { CheckoutComponent } from './reservations/checkout.component';
import { MyReservationsComponent } from './reservations/my-reservations.component';

export const routes: Routes = [
  { path: 'checkout/:equipmentId', component: CheckoutComponent },
  { path: 'my-reservations', component: MyReservationsComponent },
];