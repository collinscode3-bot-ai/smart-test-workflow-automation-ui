import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { Observable } from 'rxjs';
import { HeaderData } from '../../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  headerData$: Observable<HeaderData>;

  constructor(private headerService: HeaderService) {
    this.headerData$ = this.headerService.headerData$;
  }

  ngOnInit(): void {}
}
