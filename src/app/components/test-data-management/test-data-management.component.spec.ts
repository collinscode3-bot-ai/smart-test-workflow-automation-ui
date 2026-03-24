import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TestDataManagementComponent } from './test-data-management.component';

describe('TestDataManagementComponent', () => {
  let component: TestDataManagementComponent;
  let fixture: ComponentFixture<TestDataManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestDataManagementComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDataManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when no file is selected', () => {
    expect(component.testDataForm.valid).toBeFalsy();
  });
});
