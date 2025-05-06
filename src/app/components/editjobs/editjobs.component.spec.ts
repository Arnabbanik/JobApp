import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditjobsComponent } from './editjobs.component';

describe('EditjobsComponent', () => {
  let component: EditjobsComponent;
  let fixture: ComponentFixture<EditjobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditjobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditjobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
