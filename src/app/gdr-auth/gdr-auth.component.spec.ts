import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdrAuthComponent } from './gdr-auth.component';

describe('GdrAuthComponent', () => {
  let component: GdrAuthComponent;
  let fixture: ComponentFixture<GdrAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdrAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdrAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
