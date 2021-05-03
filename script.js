// script.js
const img = new Image(); // used to load image from <input> and draw to canvas
const file = document.getElementById("image-input");
const canvas = document.getElementById("user-image");
const ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);   // clear canvas
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);    // fill canvas with black

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', (e) => {
  // TODO 
  alert("hello");
  //ctx.clearRect(0, 0, canvas.width, canvas.height);   // clear canvas
  //ctx.fillStyle = 'black';
  //ctx.fillRect(0, 0, canvas.width, canvas.height);    // fill canvas with black
  //document.getElementById("generate-meme").reset();   // clear the form
  //draw image with proper dimension
  img.src = URL.createObjectURL(e.target.files[0]);
  ctx.drawImage(img, 0, 0);

  //let imgdata = getDimmensions(canvas.width, canvas.height, img.clientWidth, img.clientHeight);
  //ctx.drawImage(img, imgdata.startX, imgdata.startY, imgdata.width, imgdata.height);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

// change image
img.addEventListener('change', (e) => {
  img.src = URL.createObjectURL(e.target.files[0]);
});

// submit button
const submit = document.querySelector('button[type="submit"]');
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
const reset = document.querySelector('button[type="reset"]');
reset.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  submit.disabled = false;
  reset.disabled = true;
  readtxt.disabled = true;
});

// voice selection
var voices = [];

function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

inputForm.onsubmit = function(event) {
  event.preventDefault();

  var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  utterThis.pitch = pitch.value;
  utterThis.rate = rate.value;
  synth.speak(utterThis);

  inputTxt.blur();
}
const readtxt = document.querySelector("[type='button']");
readtxt.addEventListener('click', () => {
  let top = new SpeechSynthesisUtterance(document.getElementById("text-top").value);
  speechSynthesis.speak(top);
  let bottom = new SpeechSynthesisUtterance(document.getElementById("text-bottom").value);
  speechSynthesis.speak(bottom);
});

// adjust volume 

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
