export interface SubLink {
  label: string;
  path: string;
}

export interface SidebarSection {
  label: string;
  icon: string;
  isExpanded: boolean;
  subLinks: SubLink[];
}

export const SIDEBAR_ROUTES: SidebarSection[] = [
  {
    label: 'Projects',
    icon: 'bi-grid',
    isExpanded: false,
    subLinks: [
      { label: 'Create Project', path: '/' },
      { label: 'Project List', path: '/projects/list' }
    ]
  },
  {
    label: 'Test Suites',
    icon: 'bi-journal-text',
    isExpanded: false,
    subLinks: [
      { label: 'Create Suite', path: '/test-suites/create' },
      { label: 'Suite List', path: '/test-suites/list' }
    ]
  },
  {
    label: 'Contracts',
    icon: 'bi-file-earmark-text',
    isExpanded: false,
    subLinks: [
      { label: 'Contract List', path: '/contracts/list' },
      { label: 'Upload Contract', path: '/contracts/upload' }
    ]
  },
  {
    label: 'Test Data',
    icon: 'bi-database',
    isExpanded: false,
    subLinks: [
      { label: 'Datasets', path: '/test-data/datasets' },
      { label: 'Variables', path: '/test-data/variables' }
    ]
  },
  {
    label: 'Test Execution',
    icon: 'bi-play-circle',
    isExpanded: false,
    subLinks: [
      { label: 'Runs', path: '/test-execution/runs' },
      { label: 'Reports', path: '/test-execution/reports' }
    ]
  }
];
