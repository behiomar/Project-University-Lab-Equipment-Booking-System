import { Component } from '@angular/core';
import { EquipmentList } from '../equipment-list/equipment-list';

@Component({
  selector: 'app-equipment-form',
  standalone: true,
  imports: [EquipmentList],
  template: `<app-equipment-list></app-equipment-list>`
})
export class EquipmentForm {}