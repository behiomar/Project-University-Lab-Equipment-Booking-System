import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Equipment } from '../../core/models/equipment';
import { EquipmentService } from '../../services/equipment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  latest = signal<Equipment[]>([]);
  mostAvailable = signal<Equipment[]>([]);
  loading = signal(true);
  favorites = signal<number[]>([]);

  readonly imageBase = 'http://localhost:3000/uploads/';

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.equipmentService.getAll().subscribe({
      next: (data: Equipment[]) => {
        this.latest.set([...data].sort((a, b) => b.id - a.id).slice(0, 4));

        this.mostAvailable.set(
          [...data]
            .filter(e => e.status === 'Available')
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 4)
        );

        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading equipments:', err);
        this.loading.set(false);
      }
    });
  }

  isFavorite(id: number): boolean {
    return this.favorites().includes(id);
  }

  toggleFavorite(id: number): void {
    this.favorites.update(list =>
      list.includes(id) ? list.filter(x => x !== id) : [...list, id]
    );
  }
}