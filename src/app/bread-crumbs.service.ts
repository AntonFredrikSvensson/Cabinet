import { LocalStorageMethods } from './utils';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BreadCrumbsService {
  private breadCrumbsObject = { 0: ['Home', ''] };
  public breadCrumbSubject: BehaviorSubject<any>;

  constructor() {
    this.breadCrumbSubject = new BehaviorSubject<any>(this.breadCrumbsObject);

    // console.log('---constructor breadCrumbsService');
    // Get back saved credentials
    const savedBreadCrumbs: any = LocalStorageMethods.retrieve('breadCrumbs');
    if (savedBreadCrumbs) {
      // console.log(savedBreadCrumbs[1]);
      this.storeBreadCrumbs(savedBreadCrumbs);
    }
  }

  getBreadCrumbs(): BehaviorSubject<any> {
    return this.breadCrumbSubject;
  }

  addBreadCrumb(folderName, folderLink) {
    const newKey = Object.keys(this.breadCrumbsObject).length;
    this.breadCrumbsObject[newKey] = [folderName, '/files/' + folderLink];
    this.storeBreadCrumbs(this.breadCrumbsObject);
    console.log('---addBreadCrumb---');
    console.log(this.breadCrumbsObject);
  }

  clearBreadCrumbs(crumbKey) {
    this.clearStoredBreadCrumbs();
    for (const [key] of Object.entries(this.breadCrumbsObject)) {
      if (key > crumbKey) {
        delete this.breadCrumbsObject[key];
      }
    }
    this.storeBreadCrumbs(this.breadCrumbsObject);
    console.log('---clearBreadCrumbs---');
    console.log(this.breadCrumbsObject);
  }

  clearStoredBreadCrumbs() {
    LocalStorageMethods.remove('breadCrumbs');
    return this.breadCrumbSubject.next(this.breadCrumbsObject);
  }

  storeBreadCrumbs(breadCrumbsObject: any) {
    console.log('---storeBreadCrumbs---');
    this.breadCrumbsObject = breadCrumbsObject;
    LocalStorageMethods.store('breadCrumbs', this.breadCrumbsObject);
    return this.breadCrumbSubject.next(this.breadCrumbsObject);
  }
}
