"use strict"

let gazeState = undefined;
let gazeX = undefined;
let gazeY = undefined;


let circleSize = 30;
let circleArray = [];
let cam;
let pixelSize = circleSize;
let eyeImage;
let state = 'intro'

function preload(){
  eyeImage = loadImage("assets/images/eye.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textAlign(CENTER);
  imageMode(CENTER);
  textFont("Abril Fatface");
  cam = createCapture(VIDEO);
  cam.size(height*1.7,height);
  cam.hide();
}

function draw() {
  // gazeState = 0;
  // gazeX = mouseX;
  // gazeY = mouseY;
  background(1, 28, 39, 50);
  noStroke();
  fill(255);
  if (gazeState === 0) {
    cam.loadPixels();

    for (let x = 0; x < cam.width; x += pixelSize) {
      for (let y = 0; y < cam.height; y += pixelSize) {
        let index = (x + y * cam.width) * 4; // convert x&y to index //index = position in the array

        // get the color of the pixel position
        // draw a rect at the corresponding x and y pixel
        let r = cam.pixels[index];
        let g = cam.pixels[index + 1];
        let b = cam.pixels[index + 2];

        let d;
        if (gazeState === 0) {
          d = dist(gazeX, gazeY, x, y);
        } else {
          d = 0;
        }

        let col;
        if (d > 100) {
          col = color(r+ d-100, g+ d-100, b+ d-100);
        } else {
          col = color(r, g, b);
        }
        //col = color(r + d, g + d, b + d)
        noStroke();
        fill(col);
        ellipse(x+(width-(height*1.7))/2, y, constrain(map(d, 0, 300, pixelSize, 0), 0, pixelSize));
      }
    }

    if (keyIsDown(32)) {
      pixelSize--;
    }else{
      pixelSize++;
    }
    pixelSize = constrain(pixelSize,10,50);

    push();
    fill(255);
    textSize(32);
    text('Use your touch (hold spacebar) to clarify your vision', width/2, height - 40);
    pop();

  }else if (gazeState === undefined){
    push();
    fill(255, 190, 11);
    textSize(80);
    text('Visual Agnosia', width/2, height/2-100);
    textSize(32);
    fill(251, 86, 7)
    text('The inability to recognize objects through sight', width/2, height/2);
    push();
    textFont('helvetica')
    textSize(20);
    fill(200)
    text('This simulation requires a webcam to track your eyes.\n You will undergo a calibrating procedure, after which the simulation will begin.', width/2, height/2+100);
    pop();
    textSize(32);
    fill(255, 0, 110);
    text('Press spacebar to continue', width/2, height-40);
    pop();
    push();
    image(eyeImage, width/2, height-200, 150,130);
    pop();

  }else{
    // push();
    // fill(255);
    // textSize(50);
    // text('Something went wrong with the tracking', width/2, height/2-50);
    // pop();
  }

}

function keyPressed() {
  if (keyCode === 32 && state === 'intro') {
    state = 'sim'
    GazeCloudAPI.StartEyeTracking();
    GazeCloudAPI.OnResult = function(GazeData) {
      gazeState = GazeData.state
      gazeX = GazeData.docX;
      gazeY = GazeData.docY;
      // console.log(GazeData.state); // 0: valid gaze data; -1 : face tracking lost, 1 : gaze data uncalibrated
      // console.log(GazeData.docX); // gaze x in document coordinates
      // console.log(GazeData.docY); // gaze y in document coordinates
      // console.log(GazeData.time); // timestamp
    }
  }
}
