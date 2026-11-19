import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Equipment } from '../../../core/models/equipment';
import { EquipmentService } from '../../../services/equipment';

@Component({
  selector: 'app-equipment-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './equipment-details.html',
  styleUrl: './equipment-details.css'
})
export class EquipmentDetails implements OnInit {

  equipment = signal<Equipment | null>(null);
  loading = signal(true);
  notFound = signal(false);

  readonly imageBase = 'http://localhost:3000/uploads/';

  constructor(
    private route: ActivatedRoute,
    private equipmentService: EquipmentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.equipmentService.getById(id).subscribe({
      next: (data: Equipment) => {
        this.equipment.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading equipment:', err);
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }
}