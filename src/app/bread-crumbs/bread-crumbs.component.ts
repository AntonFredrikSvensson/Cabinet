import { BreadCrumbsService } from './../bread-crumbs.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrls: ['./bread-crumbs.component.css']
})
export class BreadCrumbsComponent implements OnInit {
  public breadCrumbsObject: any;
  private breadCrumbSubscription: Subscription;

  constructor(
    private breadCrumbService: BreadCrumbsService
  ) { }

  ngOnInit(): void {
    this.breadCrumbSubscription = this.breadCrumbService
      .getBreadCrumbs()
      .subscribe(breadCrumbs => (this.breadCrumbsObject = breadCrumbs));
  }

  clearBreadCrumbs(crumbKey) {
    this.breadCrumbService.clearBreadCrumbs(crumbKey);
  }

}
