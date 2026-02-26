import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface HasModalOpen {
  isModalOpen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalGuard implements CanDeactivate<HasModalOpen> {
  canDeactivate(
    component: HasModalOpen,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.isModalOpen) {
      alert('Please save or cancel the current parameter configuration before navigating away.');
      return false;
    }
    return true;
  }
}
