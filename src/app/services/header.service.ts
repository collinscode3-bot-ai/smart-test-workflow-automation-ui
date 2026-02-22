import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface HeaderData {
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private headerSubject = new BehaviorSubject<HeaderData>({
    title: '',
    description: ''
  });

  headerData$ = this.headerSubject.asObservable();

  setHeaderData(title: string, description: string) {
    this.headerSubject.next({ title, description });
  }
}
