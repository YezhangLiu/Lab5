// script.js
const img = document.getElementById("image-input");  // image file
const readtxt = document.querySelector("[type='button']");  // readtext button
const reset = document.querySelector('button[type="reset"]'); // clear button
const submit = document.querySelector('button[type="submit"]'); // submit button
const canvas = document.getElementById("user-image"); // create canvas
const selection = document.getElementById("voice-selection");
const range = document.querySelector('input[type="range"]');  // volumn

const ctx = canvas.getContext('2d');
selection.disabled = false;

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('change', function (event) {
  alert(event.target.files[0].name);
  ctx.clearRect(0, 0, canvas.width, canvas.height);   // clear canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);    // fill canvas with black
  //draw image with proper dimension
  img.src = URL.createObjectURL(event.target.files[0]);
  img.alt = event.target.files[0].name;   // change alt name
  let imgdata = getDimmensions(canvas.width, canvas.height, img.clientWidth, img.clientHeight);
  ctx.drawImage(img, imgdata.startX, imgdata.startY, imgdata.width, imgdata.height);
});

// submit button
submit.addEventListener('click', () => {
  ctx.textAlign = "center";
  ctx.font = "30px Verdana";
  ctx.fillText(document.getElementById("text-top").value, 200, 50);
  ctx.fillText(document.getElementById("text-bottom").value, 200, 350);
  submit.disabled = true;
  reset.disabled = false;
  readtxt.disabled = false;
});

// reset button
reset.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  submit.disabled = false;
  reset.disabled = true;
  readtxt.disabled = true;
});

// voice selection
readtxt.addEventListener('click', () => {
  var top = new SpeechSynthesisUtterance(document.getElementById("text-top").value);
  var bottom = new SpeechSynthesisUtterance(document.getElementById("text-bottom").value);
  speechSynthesis.speak(top);
  speechSynthesis.speak(bottom);
});

// adjust icon and volumn
range.addEventListener('change', () => {
  alert("range");
  top.volume = range.value/100;
  bottom.volume = range.value/100;
  var icon = document.querySelector('img[alt="Volume Level 3"]');
  if(range == 0) {
    icon.src = "icons/volume-level-0.svg";
  }

  else if(range >= 1 && range <= 33){
    icon.src = "icons/volume-level-1.svg";
  }

  else if(range >= 34 && range <= 66){
    icon.src = "icons/volume-level-2.svg";
  }

  else if(range >= 67 && range <= 100){
    icon.src = "icons/volume-level-3.svg";
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
