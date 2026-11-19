import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { EquipmentForm } from './equipment-form';

describe('EquipmentForm', () => {
  let component: EquipmentForm;
  let fixture: ComponentFixture<EquipmentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentForm],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(EquipmentForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});