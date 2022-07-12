import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-speak-showcase',
  templateUrl: './speak-showcase.component.html',
  styleUrls: ['./speak-showcase.component.scss']
})
export class SpeakShowcaseComponent implements OnInit {
  video1Start: number = 0;
  frameLength: number = 25;
  pause1Frame: number = 70;
  pause1Length: number = 2000;
  frameCount: number = 138;

  //Don't change these, they're set automatically
  video1End: number = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.video1End = this.frameLength * this.frameCount + this.pause1Length + this.video1Start;

    const canvas = <HTMLCanvasElement> document.getElementById("canvas1")!;
    const context = canvas.getContext("2d")!;
    console.log(`Scroll height: ${this.document.body.scrollHeight}, View height: ${window.innerHeight}, end: ${this.video1End}`);
    console.log(`pauseStart: ${(this.frameLength * this.pause1Frame) + this.video1Start}`);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const img = new Image()
    img.onload = () => {
      context.clearRect(0, 0, canvas.width , canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    img.src = this.currentFrame(1);

    window.addEventListener('scroll', () => {
      let frameIndex = this.getFrameIndex(this.video1Start, this.video1End, this.pause1Frame, this.pause1Length, this.frameCount);
      console.log(`index: ${frameIndex}, scroll: ${window.scrollY}`);
      requestAnimationFrame(() => this.updateImage(frameIndex, canvas, context, img));
    });
  }

  currentFrame(index: number) {
    return `/assets/animations/macOpenClose/${index.toString().padStart(6, '0')}.png`;
  }

  getFrameIndex(start: number, end: number, pauseFrame: number, pauseLength: number, frameCount: number): number {
    if (window.scrollY > end) return frameCount + 1;
    if (window.scrollY < start) return 0;

    const pauseStart: number = (this.frameLength * pauseFrame) + start;
    const pauseEnd: number = pauseStart + pauseLength;
    
    //Before pause
    let scrollFraction = (window.scrollY - start) / (end - pauseLength - start);

    //During pause
    if (window.scrollY > pauseStart && window.scrollY < pauseEnd) {
      scrollFraction = (pauseStart + 1 - start) / (end - pauseLength - start);
    }

    //After pause
    if (window.scrollY >= pauseEnd) {
      scrollFraction = (window.scrollY - start - pauseLength) / (end - pauseLength - start);
    }

    let frameIndex = Math.min(
      frameCount,
      Math.floor(scrollFraction * frameCount)
    );
    return frameIndex;
  }

  updateImage(index: number, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, img: HTMLImageElement) {
    if (index == 0 || index > this.frameCount) {
      context.clearRect(0, 0, canvas.width , canvas.height);
    } else {
      img.src = this.currentFrame(index);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }
}
