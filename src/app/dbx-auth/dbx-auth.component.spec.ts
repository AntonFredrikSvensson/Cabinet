import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbxAuthComponent } from './dbx-auth.component';

describe('DbxAuthComponent', () => {
  let component: DbxAuthComponent;
  let fixture: ComponentFixture<DbxAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbxAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbxAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
