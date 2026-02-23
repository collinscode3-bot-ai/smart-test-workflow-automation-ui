import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-please-wait',
  templateUrl: './app-please-wait.component.html',
  styleUrls: ['./app-please-wait.component.scss']
})
export class AppPleaseWaitComponent {
  isLoading$ = this.loadingService.isLoading$;

  constructor(private loadingService: LoadingService) {}
}
