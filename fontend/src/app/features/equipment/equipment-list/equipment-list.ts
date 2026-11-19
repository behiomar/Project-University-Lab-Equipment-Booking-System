import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { Equipment } from '../../../core/models/equipment';
import { EquipmentService } from '../../../services/equipment';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './equipment-list.html',
  styleUrl: './equipment-list.css'
})
export class EquipmentList implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  equipments: Equipment[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  editingId: number | null = null;

  // replaces alert()
  toast: { type: 'success' | 'error'; text: string } | null = null;
  private toastTimer: any;

  // replaces confirm()
  deleteTarget: Equipment | null = null;

  equipmentForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
    status: new FormControl('Available', Validators.required)
  });

  constructor(
    private equipmentService: EquipmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEquipments();
  }

  private showToast(type: 'success' | 'error', text: string): void {
    this.toast = { type, text };
    this.cdr.markForCheck();

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast = null;
      this.cdr.markForCheck();
    }, 3500);
  }

  closeToast(): void {
    this.toast = null;
  }

  private getErrorMessage(error: any, fallback: string): string {
    return error?.error?.message || fallback;
  }

  loadEquipments(): void {
    this.equipmentService.getAll().subscribe({
      next: (data: Equipment[]) => {
        this.equipments = data;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error loading equipments:', error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveEquipment(): void {
    if (this.equipmentForm.invalid) {
      this.equipmentForm.markAllAsTouched();
      return;
    }

    const data = this.equipmentForm.value;

    const formData = new FormData();
    formData.append('name', (data.name ?? '').trim());
    formData.append('description', (data.description ?? '').trim());
    formData.append('category', (data.category ?? '').trim());
    formData.append('quantity', String(data.quantity ?? 0));
    formData.append('status', data.status ?? 'Available');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.editingId === null) {
      this.equipmentService.create(formData).subscribe({
        next: () => {
          this.showToast('success', 'Equipment added successfully');
          this.resetForm();
          this.loadEquipments();
        },
        error: (error: any) => {
          console.error('Error adding equipment:', error);
          this.showToast('error', this.getErrorMessage(error, 'Error adding equipment'));
        }
      });
    } else {
      this.equipmentService.update(this.editingId, formData).subscribe({
        next: () => {
          this.showToast('success', 'Equipment updated successfully');
          this.resetForm();
          this.loadEquipments();
        },
        error: (error: any) => {
          console.error('Error updating equipment:', error);
          this.showToast('error', this.getErrorMessage(error, 'Error updating equipment'));
        }
      });
    }
  }

  editEquipment(equipment: Equipment): void {
    this.editingId = equipment.id;

    this.equipmentForm.patchValue({
      name: equipment.name,
      description: equipment.description,
      category: equipment.category,
      quantity: equipment.quantity,
      status: equipment.status
    });

    this.selectedFile = null;
    this.previewUrl = equipment.image
      ? 'http://localhost:3000/uploads/' + equipment.image
      : null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // step 1: open the modal
  askDelete(equipment: Equipment): void {
    this.deleteTarget = equipment;
  }

  cancelDelete(): void {
    this.deleteTarget = null;
  }

  // step 2: delete the whole equipment (all stock) in one request
  confirmDelete(): void {
    if (!this.deleteTarget) return;

    const target = this.deleteTarget;
    this.deleteTarget = null;

    this.equipmentService.delete(target.id).subscribe({
      next: () => {
        if (this.editingId === target.id) this.resetForm();
        this.showToast('success', `"${target.name}" deleted with all its stock`);
        this.loadEquipments();
      },
      error: (error: any) => {
        console.error('Error deleting equipment:', error);
        if (error?.status === 404) {
          this.loadEquipments();
          return;
        }
        this.showToast('error', this.getErrorMessage(error, 'Error deleting equipment'));
      }
    });
  }

  resetForm(): void {
    this.equipmentForm.reset({
      name: '',
      description: '',
      category: '',
      quantity: 0,
      status: 'Available'
    });

    this.selectedFile = null;
    this.previewUrl = null;
    this.editingId = null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}