import { FilesService } from './../files.service';
import { BreadCrumbsService } from './../bread-crumbs.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrls: ['./bread-crumbs.component.css']
})
export class BreadCrumbsComponent implements OnInit, OnDestroy {
  public breadCrumbsObject: any;
  private breadCrumbSubscription: Subscription;

  constructor(
    private breadCrumbService: BreadCrumbsService,
    private filesService: FilesService,
  ) { }

  ngOnInit(): void {
    this.breadCrumbSubscription = this.breadCrumbService
      .getBreadCrumbs()
      .subscribe(breadCrumbs => (this.breadCrumbsObject = breadCrumbs));
  }

  clearBreadCrumbs(crumbKey) {
    this.filesService.clearFilesArray();
    this.breadCrumbService.clearBreadCrumbs(crumbKey);
  }

  ngOnDestroy(): void {
    this.breadCrumbSubscription.unsubscribe();
  }
}
