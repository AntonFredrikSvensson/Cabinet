import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdriveAuthComponent } from './gdrive-auth.component';

describe('GdriveAuthComponent', () => {
  let component: GdriveAuthComponent;
  let fixture: ComponentFixture<GdriveAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdriveAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdriveAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
