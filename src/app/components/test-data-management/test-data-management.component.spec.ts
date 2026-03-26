import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TestDataManagementComponent } from './test-data-management.component';
import { TemplateService } from '../../services/template.service';

describe('TestDataManagementComponent', () => {
  let component: TestDataManagementComponent;
  let fixture: ComponentFixture<TestDataManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestDataManagementComponent ],
      imports: [ ReactiveFormsModule, HttpClientTestingModule ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '1' })
          }
        }
      ]
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

  it('should populate datasets and schemaHeaders on init', () => {
    expect(component.datasets.length).toBeGreaterThan(0);
    expect(component.schemaHeaders.length).toBeGreaterThan(0);
    expect(component.totalItems).toBe(component.datasets.length);
  });

  it('should display error when downloading template without schema headers', () => {
    component.schemaHeaders = [];
    component.downloadTemplate();
    expect(component.errorMessage).toBe('Template Generation Failed: No fields or headers have been selected for this template.');
  });

  it('should trigger download when schema headers are present', () => {
    const templateService = TestBed.inject(TemplateService);
    const spy = spyOn(templateService, 'downloadExcelTemplate');
    component.schemaHeaders = ['ID', 'Name'];
    component.testCaseId = '123';
    component.downloadTemplate();
    expect(spy).toHaveBeenCalledWith('123', ['ID', 'Name']);
    expect(component.errorMessage).toBeNull();
  });

  it('should add and remove payload headers', () => {
    expect(component.payloadHeaders.length).toBe(0);
    component.addHeader();
    expect(component.payloadHeaders.length).toBe(1);
    expect(component.payloadHeaders.at(0).get('seqNo')?.value).toBe(1);

    component.addHeader();
    expect(component.payloadHeaders.length).toBe(2);
    expect(component.payloadHeaders.at(1).get('seqNo')?.value).toBe(2);

    component.removeHeader(0);
    expect(component.payloadHeaders.length).toBe(1);
    expect(component.payloadHeaders.at(0).get('seqNo')?.value).toBe(1);
  });

  it('should validate mandatory fields in payload headers', () => {
    component.addHeader();
    const header = component.payloadHeaders.at(0);
    header.get('headerType')?.setValue('');
    header.get('headerName')?.setValue('');
    header.get('headerValue')?.setValue('');
    header.get('dataType')?.setValue('');
    expect(header.valid).toBeFalsy();

    header.get('headerType')?.setValue('STATIC_VALUE');
    header.get('headerName')?.setValue('Content-Type');
    header.get('headerValue')?.setValue('application/json');
    header.get('dataType')?.setValue('String');
    expect(header.valid).toBeTruthy();
  });
});
