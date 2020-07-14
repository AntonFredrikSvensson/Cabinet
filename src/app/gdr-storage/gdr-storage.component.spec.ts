import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdrStorageComponent } from './gdr-storage.component';

describe('GdrStorageComponent', () => {
  let component: GdrStorageComponent;
  let fixture: ComponentFixture<GdrStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdrStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdrStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
