import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ProjectsDashboardComponent } from './projects-dashboard.component';
import { HeaderService } from '../../services/header.service';

describe('ProjectsDashboardComponent', () => {
  let component: ProjectsDashboardComponent;
  let fixture: ComponentFixture<ProjectsDashboardComponent>;
  let headerService: HeaderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsDashboardComponent ],
      imports: [ RouterTestingModule, FormsModule ],
      providers: [ HeaderService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsDashboardComponent);
    component = fixture.componentInstance;
    headerService = TestBed.inject(HeaderService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set header data on init', () => {
    const spy = spyOn(headerService, 'setHeaderData');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith('Project Details', 'Manage and monitor your existing projects.');
  });

  it('should filter projects based on search term', () => {
    component.searchTerm = 'Audit';
    component.searchProjects();
    expect(component.filteredProjects.length).toBe(1);
    expect(component.filteredProjects[0].name).toBe('Q3 Brand Audit');
  });

  it('should paginate projects', () => {
    component.itemsPerPage = 5;
    component.searchProjects(); // total 10
    expect(component.paginatedProjects.length).toBe(5);

    component.setPage(2);
    expect(component.currentPage).toBe(2);
    expect(component.paginatedProjects.length).toBe(5);
  });
});
