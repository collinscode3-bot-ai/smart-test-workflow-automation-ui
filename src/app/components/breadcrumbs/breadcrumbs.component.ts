import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
  active: boolean;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateBreadcrumbs(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateBreadcrumbs(event.urlAfterRedirects);
    });
  }

  private updateBreadcrumbs(url: string): void {
    const crumbs: Breadcrumb[] = [
      { label: 'Home', url: '/', active: false }
    ];

    if (url.includes('/projects/dashboard') || url.includes('/projects/list')) {
      crumbs.push({ label: 'Projects', url: '/projects/dashboard', active: false });
      crumbs.push({ label: 'Dashboard', url: '', active: true });
    } else if (url.includes('/test-suites/list')) {
      crumbs.push({ label: 'Projects', url: '/projects/dashboard', active: false });

      // Attempt to extract project name from query params or use a realistic mock
      const projectId = this.getQueryParam(url, 'projectId');
      const projectName = this.getMockProjectName(projectId);

      crumbs.push({ label: projectName, url: '/projects/dashboard', active: false });
      crumbs.push({ label: 'Test Suites', url: '', active: true });
    } else if (url === '/' || url.startsWith('/edit')) {
      crumbs.push({ label: 'Projects', url: '/projects/dashboard', active: false });
      crumbs.push({ label: url === '/' ? 'New Project' : 'Edit Project', url: '', active: true });
    } else {
      // Default fallback
      crumbs.push({ label: 'Projects', url: '/projects/dashboard', active: false });
      crumbs.push({ label: 'Dashboard', url: '', active: true });
    }

    this.breadcrumbs = crumbs;
  }

  private getQueryParam(url: string, param: string): string | null {
    if (url.includes('?')) {
      const params = new URLSearchParams(url.split('?')[1]);
      return params.get(param);
    }
    return null;
  }

  private getMockProjectName(id: string | null): string {
    const projects: { [key: string]: string } = {
      '1': 'Q3 Brand Audit',
      '2': 'Website Redesign',
      '3': 'App Launch 2024',
      '4': 'API Integration',
      '5': 'Market Research',
      '6': 'Customer Support Bot',
      '7': 'Data Migration',
      '8': 'Security Patching'
    };
    return id && projects[id] ? projects[id] : 'Sample Project';
  }
}
