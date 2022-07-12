import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakShowcaseComponent } from './speak-showcase.component';

describe('SpeakShowcaseComponent', () => {
  let component: SpeakShowcaseComponent;
  let fixture: ComponentFixture<SpeakShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeakShowcaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
