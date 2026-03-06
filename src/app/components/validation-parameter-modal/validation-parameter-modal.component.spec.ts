import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ValidationParameterModalComponent } from './validation-parameter-modal.component';
import { ErrorMessageService } from '../../services/error-message.service';

describe('ValidationParameterModalComponent', () => {
  let component: ValidationParameterModalComponent;
  let fixture: ComponentFixture<ValidationParameterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationParameterModalComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        FormBuilder,
        { provide: ErrorMessageService, useValue: { getErrorMessage: () => 'Error' } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationParameterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load filtered options for JSON_FIELD_VALIDATION and EQUALS', () => {
    component.context = { type: 'JSON_FIELD_VALIDATION', name: 'EQUALS' };
    component.loadFilteredOptions();
    expect(component.parameterOptions).toEqual([
      { key: 'EXPECTED_VALUE', value: 'Expected Value' },
      { key: 'PATH', value: 'JSON Path' }
    ]);
  });

  it('should load filtered options for JSON_VALIDATION', () => {
    component.context = { type: 'JSON_VALIDATION', name: 'STRICT_EQUALS' };
    component.loadFilteredOptions();
    expect(component.parameterOptions).toEqual([
      { key: 'EXCLUDE_FIELDS', value: 'Exclude Fields' },
      { key: 'IGNORE_ORDER', value: 'Ignore Order' }
    ]);
  });
});
