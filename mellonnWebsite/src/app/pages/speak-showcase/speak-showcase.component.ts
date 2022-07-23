import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-speak-showcase',
  templateUrl: './speak-showcase.component.html',
  styleUrls: ['./speak-showcase.component.scss']
})
export class SpeakShowcaseComponent implements OnInit, OnDestroy {
  //Global animation settings
  frameLength: number = 100;
  imageSize: number = 0.8; // 1 = 100%

  //chat bubble animation
  chatStart: number = 0; /* If startVH is 0, it will use this */ chatStartVH: number = 0;
  chatFrameCount: number = 25;
  computerFrameChatEnd: number = 13; //Set to frame of computer animation where chat should end

  //computer animation
  computerStart: number = 800; /* If startVH is 0, it will use this */ computerStartVH: number = 350;
  computerPauseFrame: number = 0;
  computerPauseLength: number = 0;
  computerFrameCount: number = 66;


  //Don't change these, they're set automatically
  chatEnd: number = 0;
  computerEnd: number = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.setVariables();

    const canvas = <HTMLCanvasElement> document.getElementById("canvas1")!;
    const context = canvas.getContext("2d")!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const computerImg = new Image();
    const chatImg = new Image();
    computerImg.onload = () => {
      this.loadImages([computerImg, chatImg], canvas, context);
    }
    chatImg.onload = () => {
      this.loadImages([computerImg, chatImg], canvas, context);
    }

    window.addEventListener('scroll', () => {
      this.onScroll();
      let computerFrameIndex = this.getFrameIndex(this.computerStart, this.computerEnd, this.computerPauseFrame, this.computerPauseLength, this.computerFrameCount);
      let chatFrameIndex = this.getFrameIndex(this.chatStart, this.chatEnd, 0, 0, this.chatFrameCount);
      //console.log(`index: ${frameIndex}, scroll: ${window.scrollY}`);
      requestAnimationFrame(() => this.updateImage(computerFrameIndex, this.computerFrameCount, canvas, context, computerImg, 'computer'));
      requestAnimationFrame(() => this.updateImage(chatFrameIndex, this.chatFrameCount, canvas, context, chatImg, 'chat'));
    });
  }

  ngOnDestroy(): void {
      window.removeAllListeners!('scroll');
  }

  currentChatFrame(index: number) {
    return `/assets/animations/chatBubbles/${(index -1).toString().padStart(6, '0')}.png`;
  }

  currentComputerFrame(index: number) {
    return `/assets/animations/macOpen/${(index -1).toString().padStart(6, '0')}.jpg`;
  }

  getImageX(canvasWidth: number) {
    return (1 - this.imageSize) / 2 * canvasWidth;
  }

  getImageY(canvasWidth: number) {
    return (1 - this.imageSize) / 2 * this.getImageH(canvasWidth);
  }

  getImageW(canvasWidth: number) {
    return (canvasWidth * this.imageSize);
  }

  getImageH(canvasWidth: number) {
    return (canvasWidth * 0.5625) * this.imageSize;
  }

  setVariables() {
    //Computer animation variables
    if (this.computerStartVH != 0) this.computerStart = window.innerHeight * (this.computerStartVH / 100);
    this.computerEnd = this.frameLength * this.computerFrameCount + this.computerPauseLength + this.computerStart;

    //Chat animation variables
    if (this.chatStartVH != 0) this.chatStart = window.innerHeight * (this.chatStartVH / 100);
    this.chatEnd = this.frameLength * this.computerFrameChatEnd + (this.computerFrameChatEnd > this.computerPauseFrame ? this.computerPauseLength : 0) + this.computerStart;
    
    console.log('chatEnd: ' + this.chatEnd + ', comp: ' + this.computerStart);
  }

  loadImages(images: HTMLImageElement[], canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let img of images) {
      context.drawImage(img, this.getImageX(canvas.width), this.getImageY(canvas.width), this.getImageW(canvas.width), this.getImageH(canvas.width));
    }
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

  updateImage(index: number, maxFrame: number, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, img: HTMLImageElement, type: 'computer' | 'chat') {
    if (index == 0 || index > maxFrame) {
      context.clearRect(0, 0, canvas.width , canvas.height);
    } else {
      if (type == 'computer') {
        img.src = this.currentComputerFrame(index);
      } else {
        img.src = this.currentChatFrame(index);
      }
      context.drawImage(img, this.getImageX(canvas.width), this.getImageY(canvas.width), this.getImageW(canvas.width), this.getImageH(canvas.width));
    }
  }

  onScroll() {
    const scrollY = window.scrollY;
    const pause = (this.frameLength * this.computerPauseFrame) + this.computerStart;

    //Insert scroll animations below...
    this.titleAnimation(scrollY);
  }

  titleAnimation(scrollY: number) {
    const titleSection = document.getElementById('titleSection')!;
    const title = document.getElementById('title');
    const fadeStart: number = 150; //vh
    const maxOffset: number = 200; //vw
    let offset = 0;
    let opacity = 100;

    if (scrollY < titleSection.clientHeight) {
      offset = scrollY / titleSection.clientHeight * maxOffset;
      const fadeHeight = (fadeStart / 100) * window.innerHeight;
      if (scrollY > fadeHeight) {
        opacity = (1 - (scrollY - fadeHeight) / (titleSection.clientHeight - fadeHeight - window.innerHeight)) * 100;
      }
    } else {
      offset = maxOffset;
    }
    this.renderer.setStyle(title, "left", -offset + 15 + "vw");
    this.renderer.setStyle(title, "opacity", opacity + "%");
  }
}