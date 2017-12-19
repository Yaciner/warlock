import HoverEffect from './lib/hoverEffect';
//import Scene3 from `./lib/emotion-detector`;
const $servants = document.querySelector(`.servants`);
import io from 'socket.io-client';
const divRoot = document.getElementById(`inputVideo`);
const faceMode = affdex.FaceDetectorMode.LARGE_FACES;
const detector = new affdex.CameraDetector(divRoot, 1280, 720, faceMode);
let socket = [];
let pause = 0;
const $gradient = document.querySelector(`.gradient`);
const $poem = document.querySelector(`.poem`);
import SpeechToText from 'speech-to-text';
let spokenText = ``;
let displayedText = ``;

const $witchName = document.querySelector(`.witchName`);
const names = [`Brencis Brevil`, `Panasora Brenainn`, `Kadir Depraysie`];
let index = 0;

const paths = document.querySelectorAll(`path`);
let currentFrame = 0;
const totalFrames = 300;
let counter = 0;

const colors = new tracking.ColorTracker(`magenta`);
const $videoInput = document.querySelector(`.video`);
const $maskingInput = document.querySelector(`.video-7`);
const $heart = document.querySelector(`.heart-6`);
const $key = document.querySelector(`.key`);

import SweetScroll from 'sweet-scroll';

let xAverage = 0;
let yAverage = 0;
const warlock = document.querySelector(`.warlock-7`);


const init = () => {

  socket = io.connect(`/`);

  socket.on(`connect`, () => {
    socket.on(`qrDom`, qrDom => {
      document.getElementById(`placeholder`).innerHTML = qrDom;
    });

  });
  socket.on(`update`, data => {
    if (data.target === 2) {
      console.log(`nu moet hij scrollen`);
      window.scrollTo(0, window.innerHeight);
    }

    if (data.target === 3) {
      console.log(`nu moet hij scrollen`);
      window.scrollTo(0, window.innerHeight * 2);
    }

    if (data.target === 4) {
      console.log(`nu moet hij scrollen`);
      window.scrollTo(0, window.innerHeight * 3);
    }

    if (data.target === 5) {
      console.log(`nu moet hij scrollen`);
      window.scrollTo(0, window.innerHeight * 4);
    }
  });

  setScrolling();

  scene1();
};

const setScrolling = () => {
  console.log(`setScrolling`);
};

const scene1 = () => {
  console.log(`scene1`);
  scene2();
  scene3();
};

const scene2 = () => {
  socket.on(`update`, data => {
    HoverEffect($servants, data.beta, data.gamma, 40);
  });
};

const scene3 = () => {
  initialiseCamera();
  setEventsDetector();
  setClassifiersDetector();
  initialiseDetector();
};

const scene4 = () => {
  const listener = new SpeechToText(onAnythingSaid, onFinalised);
  listener.startListening();
  socket.on(`update`, data => {
    $gradient.setAttribute(`style`, `background: radial-gradient(circle closest-corner at ${data.x * 100  }% ${data.y * 100 }%, white -10%, #121, black 60%)`);
    const keyTop = ($key.getBoundingClientRect().top / window.innerHeight) * 100;
    const keyLeft = ($key.getBoundingClientRect().left / window.innerWidth) * 100;
  // let keyWidth = ($key.getBoundingClientRect().width / window.innerWidth) * 100;
  // let keyHeight = ($key.getBoundingClientRect().height / window.innerHeight) * 100;

    if ((data.y * 100) > keyTop && (data.y * 100) < keyTop + 5 && (data.x * 100) > keyLeft && (data.x * 100) < keyLeft + 5) {
      scene5();
      window.scrollTo(0, window.innerHeight * 4);
    }
  });
};

const scene5 = () => {
  for (let i = 0;i < paths.length;i ++) {
    const path = paths[i];
    const length = path.getTotalLength();

    path.style.strokeDasharray = `${length} ${length}`;
    path.style.strokeDashoffset = length;
  }

  socket.on(`connect`, () => {
    socket.on(`qrDom`, qrDom => {
      document.getElementById(`placeholder`).innerHTML = qrDom;
    });
  });

  socket.on(`update`, data => {
    if (data.shaked) {
      draw();
    }
  });
};

const scene6 = () => {
  window.scrollTo(0, window.innerHeight * 5);
  startTracking();
};

const initialiseCamera = () => {
  navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: false, video: {width: 1280, height: 720}},
          stream => {

            divRoot.srcObject = stream;
            $maskingInput.srcObject = stream;
            divRoot.onloadedmetadata = () => {
              divRoot.play();
              $maskingInput.play();
              tracking.track($videoInput, colors);
            };
          },
          err => {
            console.log(`The following error occurred: ${  err.name}`);
          }
       );
  } else {
    console.log(`getUserMedia not supported`);
  }
};

const initialiseDetector = () => {
  detector.start();
};

const setClassifiersDetector = () => {
  // Track smiles
  detector.detectExpressions.smile = true;
};


const setEventsDetector = () => {
  detector.addEventListener(`onImageResultsSuccess`, function (faces) {handleEmotion(faces);handleMasking(faces);});
};

const handleEmotion = faces => {
  if (faces[0]) {
    if (faces[0].expressions.smile > 20) {
      pause ++;
      if (pause === 12) {
        changeName();
        pause = 0;
      }
    }
  }
};

const handleMasking = faces => {
  console.log(`masking`);
  let x = 0;
  let y = 0;

  if (faces[0]) {
    for (let i = 0;i < 34;i ++) {
      x = x + faces[0].featurePoints[i].x;
      y = y + faces[0].featurePoints[i].x;
    }

    xAverage = x / 34;
    yAverage = y / 34;

    warlock.style.left = `${((xAverage / window.innerWidth) - ((warlock.width / 3) / window.innerWidth)) * 100}%`;
    warlock.style.top = `${((yAverage / window.innerHeight) - ((warlock.height / 1.5) / window.innerHeight)) * 100}%`;
  }
};

const startNextScene = () => {
  console.log(`VOLGENDE SCÈNE`);
  detector.stop();
  scene4();
  window.scrollTo(0, window.innerHeight * 3);
};

const changeName = () => {
  index += 1;
  if (index > names.length - 1) {
    startNextScene();
    index = 0;
  }
  $witchName.innerHTML = names[index];
};

const onAnythingSaid = text => {
  spokenText = displayedText + text;
  $poem.innerHTML = spokenText;
};

const onFinalised = text => {
  displayedText = displayedText + text;
  $poem.innerHTML = displayedText;
};

const draw = () => {

  const progress = currentFrame / totalFrames;
  console.log(progress);
  console.log(paths.length);
  currentFrame ++;
  counter ++;

  for (let i = 0;i < paths.length;i ++) {
    const path = paths[i];
    const length = path.getTotalLength();

    path.style.strokeDashoffset = Math.floor(length * (1 - progress));
  }

  const handle = requestAnimationFrame(draw);

  if (counter >= totalFrames / 3) {
    cancelAnimationFrame(handle);
    counter = 0;
  }

  if (progress >= 1) {
    cancelAnimationFrame(handle);
    scene6();
  }
};

const startTracking = () => {
  colors.on(`track`, event => {
    if (event.data.length === 0) {
      console.log(`no data`);
    } else {
      $heart.style.left = `${window.innerWidth - event.data[0].x  }px`;
      const rect = $heart.getBoundingClientRect();
      if (rect.left < 350) {
        stopTracking();
        scene7();
      }
    }
  });
};

const stopTracking = () => {
  $heart.style.left = `30%`;
};

const scene7 = () => {

};

init();
