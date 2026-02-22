import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ SidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 5 main menu items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const menuItems = compiled.querySelectorAll('.menu-item');
    expect(menuItems.length).toBe(5);
  });

  it('should toggle section expansion', () => {
    // Note: section[0] might be expanded by default if the route is '/'
    const section = component.menuItems[1]; // Use Test Suites which is collapsed by default
    expect(section.isExpanded).toBeFalse();
    component.toggleSection(section);
    expect(section.isExpanded).toBeTrue();
    component.toggleSection(section);
    expect(section.isExpanded).toBeFalse();
  });
});
