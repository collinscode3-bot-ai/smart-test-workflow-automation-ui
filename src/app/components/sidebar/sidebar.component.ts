import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SIDEBAR_ROUTES, SidebarSection } from './sidebar.metadata';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: SidebarSection[] = JSON.parse(JSON.stringify(SIDEBAR_ROUTES));

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initial expansion based on current URL
    this.autoExpandActiveSection(this.router.url);

    // Track route changes for auto-expansion
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.autoExpandActiveSection(event.urlAfterRedirects);
    });

    // Placeholder for SidebarService
    // this.sidebarService.expand$.subscribe(sectionLabel => {
    //   this.toggleSection(this.menuItems.find(i => i.label === sectionLabel));
    // });
  }

  toggleSection(section: SidebarSection): void {
    const wasExpanded = section.isExpanded;
    // Accordion behavior: collapse all sections
    this.menuItems.forEach(item => item.isExpanded = false);
    // Toggle the clicked section
    section.isExpanded = !wasExpanded;
  }

  private autoExpandActiveSection(url: string): void {
    this.menuItems.forEach(section => {
      const hasActiveChild = section.subLinks.some(subLink =>
        url === subLink.path || (subLink.path !== '/' && url.startsWith(subLink.path))
      );

      if (hasActiveChild) {
        // Close other sections for accordion behavior
        this.menuItems.forEach(item => item.isExpanded = false);
        section.isExpanded = true;
      }
    });
  }
}
