"use strict"

let gazeState = undefined;
let gazeX = undefined;
let gazeY = undefined;
let eyeImage;


let cam;
let pixel = {
  x: 0,
  y: 0,
  size: 0,
  minSize: 20,
  maxSize: 80,
  quadSize: 0,
  minQuadSize: 0,
  maxQuadSize: undefined,
  color: undefined,
  wiggle: 15,
  shiftedX: 0,
  cornerOffset: 0
}
let d;
let colorAffectRadius = 100;
let sizeAffectRadius = 300;
let index;
let r, g, b;
let state = 'intro'


function preload() {
  eyeImage = loadImage("assets/images/eye.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textAlign(CENTER);
  imageMode(CENTER);
  textFont("Abril Fatface");
  cam = createCapture(VIDEO);
  if(width<height){
    cam.size(height * cam.width / cam.height, height);
  }else{
    cam.size(width, width * cam.height / cam.width);
  }
  cam.hide();
}

function draw() {
  background(0, 0, 0, 50);
  noStroke();
  fill(255);

  if (state === "sim") {
    if (gazeState === 0) {
      cam.loadPixels();

      if (keyIsDown(32)) {
        pixel.size--;
      } else {
        pixel.size++;
      }
      pixel.size = constrain(pixel.size, pixel.minSize, pixel.maxSize);
      pixel.maxQuadSize = pixel.size * 0.8;

      for (pixel.x = 0; pixel.x < cam.width; pixel.x += pixel.size) {
        for (pixel.y = 0; pixel.y < cam.height; pixel.y += pixel.size) {
          d = dist(gazeX, gazeY, width - (width - cam.width) / 2 - pixel.size / 2 - pixel.x, pixel.y);
          if (d < sizeAffectRadius) {

            index = (pixel.x + pixel.y * cam.width) * 4; // convert x&y to index //index = position in the array
            r = cam.pixels[index]; // get the color of the pixel position
            g = cam.pixels[index + 1];
            b = cam.pixels[index + 2];
            if (d > colorAffectRadius) {
              pixel.color = color(r + d - colorAffectRadius, g + d - colorAffectRadius, b + d - colorAffectRadius);
            } else {
              pixel.color = color(r, g, b);
            }

            pixel.quadSize = map(d, 0, sizeAffectRadius, pixel.maxQuadSize, pixel.minQuadSize, true);
            pixel.cornerOffset = pixel.quadSize / 2;
            pixel.wiggle = pixel.quadSize / 2;
            pixel.shiftedX = width - (width - cam.width) / 2 - pixel.size / 2 - pixel.x;

            noStroke();
            fill(pixel.color);
            quad(pixel.shiftedX - pixel.cornerOffset + random(-pixel.wiggle, pixel.wiggle),
              pixel.y - pixel.cornerOffset + random(-pixel.wiggle, pixel.wiggle),
              pixel.shiftedX + pixel.cornerOffset + random(-pixel.wiggle, pixel.wiggle),
              pixel.y - pixel.cornerOffset + random(-pixel.wiggle, pixel.wiggle),
              pixel.shiftedX + pixel.cornerOffset + random(-pixel.wiggle, pixel.wiggle),
              pixel.y + pixel.cornerOffset + random(-pixel.wiggle, pixel.wiggle),
              pixel.shiftedX - pixel.cornerOffset + random(-pixel.wiggle, pixel.wiggle),
              pixel.y + pixel.cornerOffset + random(-pixel.wiggle, pixel.wiggle));
          }
        }
      }

      push();
      fill(255);
      textSize(32);
      text('Use your touch (hold spacebar) to clarify your vision', width / 2, height - 40);
      pop();
    } else {
      push();
      fill(255);
      textSize(50);
      text('Something went wrong with the tracking', width / 2, height / 2 - 50);
      pop();
    }
  } else {
    push();
    fill(255, 190, 11);
    textSize(80);
    text('Visual Agnosia', width / 2, height / 2 - 100);
    textSize(32);
    fill(251, 86, 7)
    text('The inability to recognize objects through sight', width / 2, height / 2);
    push();
    textFont('helvetica')
    textSize(20);
    fill(200)
    text('This simulation requires a webcam to track your eyes.\n You will undergo a calibrating procedure, after which the simulation will begin.', width / 2, height / 2 + 100);
    pop();
    textSize(32);
    fill(255, 0, 110);
    text('Press spacebar to continue', width / 2, height - 40);
    pop();
    push();
    image(eyeImage, width / 2, height - 200, 150, 130);
    pop();
  }

}

function keyPressed() {
  if (keyCode === 32 && state === 'intro') {
    state = 'sim'
    GazeCloudAPI.StartEyeTracking();
    GazeCloudAPI.OnResult = function(GazeData) {
      gazeState = GazeData.state;
      gazeX = GazeData.docX;
      gazeY = GazeData.docY;
    }
  }
}
