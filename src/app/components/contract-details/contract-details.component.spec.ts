import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ContractDetailsComponent } from './contract-details.component';

describe('ContractDetailsComponent', () => {
  let component: ContractDetailsComponent;
  let fixture: ComponentFixture<ContractDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractDetailsComponent ],
      imports: [ ReactiveFormsModule, RouterTestingModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with new mode by default', () => {
    expect(component.mode).toBe('new');
  });

  it('should validate required fields', () => {
    const form = component.contractForm;
    expect(form.valid).toBeFalsy();

    form.controls['contractName'].setValue('Test Contract');
    form.controls['contractType'].setValue('Provider');
    form.controls['description'].setValue('Test Description');
    form.controls['baseContract'].setValue('{}');
    expect(form.valid).toBeTruthy();
  });
});
