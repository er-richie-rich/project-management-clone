/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FilesManageComponent } from './files-manage.component';

describe('FilesManageComponent', () => {
  let component: FilesManageComponent;
  let fixture: ComponentFixture<FilesManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
