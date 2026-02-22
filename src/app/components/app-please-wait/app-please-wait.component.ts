import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-please-wait',
  templateUrl: './app-please-wait.component.html',
  styleUrls: ['./app-please-wait.component.scss']
})
export class AppPleaseWaitComponent {
  // Placeholder for isLoading$ observable
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor() {}
}
