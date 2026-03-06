import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationConfigurationComponent } from './validation-configuration.component';
import { HeaderService } from '../../services/header.service';
import { ErrorMessageService } from '../../services/error-message.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ValidationConfigurationComponent', () => {
  let component: ValidationConfigurationComponent;
  let fixture: ComponentFixture<ValidationConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationConfigurationComponent ],
      imports: [ ReactiveFormsModule, RouterTestingModule ],
      providers: [
        FormBuilder,
        { provide: HeaderService, useValue: { setHeaderData: () => {} } },
        { provide: ErrorMessageService, useValue: { getErrorMessage: () => 'Error' } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update modalContext when addParameter is called', () => {
    component.validationForm.patchValue({
      validationType: 'JSON_FIELD_VALIDATION',
      validationName: 'NOT_NULL'
    });
    component.addParameter();
    expect(component.modalContext).toEqual({
      type: 'JSON_FIELD_VALIDATION',
      name: 'NOT_NULL'
    });
  });
});
