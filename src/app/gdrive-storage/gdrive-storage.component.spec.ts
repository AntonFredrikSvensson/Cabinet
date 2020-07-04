import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdriveStorageComponent } from './gdrive-storage.component';

describe('GdriveStorageComponent', () => {
  let component: GdriveStorageComponent;
  let fixture: ComponentFixture<GdriveStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdriveStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdriveStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
