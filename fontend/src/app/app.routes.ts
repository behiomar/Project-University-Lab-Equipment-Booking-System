import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EquipmentList } from './features/equipment/equipment-list/equipment-list';
import { EquipmentDetails } from './features/equipment/equipment-details/equipment-details';

export const routes: Routes = [
  { path: 'booking/:id', component: EquipmentDetails },
  { path: '', component: Home },
  { path: 'equipment', component: EquipmentList },
  { path: 'equipment/:id', component: EquipmentDetails },
  { path: '**', redirectTo: '' }
];