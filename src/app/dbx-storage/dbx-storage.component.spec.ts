import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbxStorageComponent } from './dbx-storage.component';

describe('DbxStorageComponent', () => {
  let component: DbxStorageComponent;
  let fixture: ComponentFixture<DbxStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbxStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbxStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
