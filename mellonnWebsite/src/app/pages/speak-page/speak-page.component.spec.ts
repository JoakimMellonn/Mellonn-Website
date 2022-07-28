import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakPageComponent } from './speak-page.component';

describe('SpeakPageComponent', () => {
  let component: SpeakPageComponent;
  let fixture: ComponentFixture<SpeakPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeakPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeakPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
