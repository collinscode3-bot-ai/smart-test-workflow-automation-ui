import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check route data if mode is not explicitly set or to allow route-based mode
    this.route.data.subscribe(data => {
      if (data['mode']) {
        this.mode = data['mode'];
      }
    });

    if (this.mode === 'edit') {
      this.loadProject();
    }
  }

  loadProject() {
    console.log('Loading project details...');
    /*
    API Placeholder:
    this.projectService.getById(id).subscribe(project => {
      // populate form
    });
    */
  }

  onSubmit() {
    if (this.mode === 'create') {
      this.save();
    } else {
      this.update();
    }
  }

  save() {
    console.log('Saving project...');
    /*
    API Placeholder:
    this.projectService.save(projectData).subscribe(response => {
       console.log('Project created successfully', response);
    });
    */
  }

  update() {
    console.log('Updating project...');
    /*
    API Placeholder:
    this.projectService.update(projectData).subscribe(response => {
       console.log('Project updated successfully', response);
    });
    */
  }
}
