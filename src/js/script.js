import HoverEffect from './lib/hoverEffect';
//import Scene3 from './lib/emotion-detector';
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
const $videoInput = document.querySelector(`.inputVideo`);
const $heart = document.querySelector(`.heart`);

import SweetScroll from 'sweet-scroll';


const init = () => {

  socket = io.connect(`/`);

  socket.on(`connect`, () => {
    socket.on(`qrDom`, qrDom => {
      document.getElementById(`placeholder`).innerHTML = qrDom;
    });

  });
  socket.on(`update`, data => {
    console.log(data.target);
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
  scene2();
  scene3();
  scene4();
  scene5();
  scene6();
};

const setScrolling = () => {


}

const scene1 = () => {
  console.log(`scene1`);
}

const scene2 = () => {
  socket.on(`update`, data => {
    console.log(`z: ${data.alpha}`);
    console.log(`x: ${data.beta}`);
    console.log(`y: ${data.gamma}`);
    HoverEffect($servants, data.beta, data.gamma, 40);
  });
}

const scene3 = () => {
  initialiseCamera();
  setEventsDetector();
  setClassifiersDetector();
  initialiseDetector();
}

const scene4 = () => {
  const listener = new SpeechToText(onAnythingSaid, onFinalised);
  listener.startListening();
  socket.on(`update`, data => {
  $gradient.setAttribute(`style`, `background: radial-gradient(circle closest-corner at ${data.x * 100  }% ${data.y * 100 }%, white -10%, #121, black 60%)`);
});
}

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

socket.on('update', data => {
  if (data.shaked){
      draw();
  }
});
}

const scene6 = () => {
  startTracking();
}

const initialiseCamera = () => {
  navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: false, video: {width: 1280, height: 720}},
          stream => {

            divRoot.srcObject = stream;
            divRoot.onloadedmetadata = () => {
              divRoot.play();
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
}

const initialiseDetector = () => {
  detector.start();
}

const setClassifiersDetector = () => {
  // Track smiles
  detector.detectExpressions.smile = true;
}


const setEventsDetector = () => {
  detector.addEventListener("onInitializeSuccess", function() {console.log('success')});
  detector.addEventListener("onInitializeFailure", function() {console.log('failure')});
  detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {handleEmotion(faces);});
  detector.addEventListener("onImageResultsFailure", function (image, timestamp, err_detail) {console.log('resultsfailed')});
  detector.addEventListener("onResetSuccess", function() {});
  detector.addEventListener("onResetFailure", function() {});
  detector.addEventListener("onStopSuccess", function() {});
  detector.addEventListener("onStopFailure", function() {});
  detector.addEventListener("onWebcamConnectSuccess", function() {
	console.log("I was able to connect to the camera successfully.");
});

detector.addEventListener("onWebcamConnectFailure", function() {
	console.log("I've failed to connect to the camera :(");
});
}

const handleEmotion = (faces) => {
  if (faces[0]) {
    if (faces[0].expressions.smile > 20) {
      pause ++;
      if (pause === 3) {
        changeName();
        pause = 0;
      }
    }
  }
};

const startNextScene = () => {
  console.log(`VOLGENDE SCÈNE`);
  detector.stop();
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
  currentFrame ++;
  counter ++;

  for (let i = 0;i < paths.length;i ++) {
    const path = paths[i];
    const length = path.getTotalLength();

    path.style.strokeDashoffset = Math.floor(length * (1 - progress));
  }

  handle = requestAnimationFrame(draw);

  if (counter >= totalFrames / 3) {
    cancelAnimationFrame(handle);
    counter = 0;
  }

  if (progress >= 1) {
    cancelAnimationFrame(handle);
  }
};

const startTracking = () => {
  colors.on(`track`, event => {
    if (event.data.length === 0) {
      console.log(`no data`);
    }

    else {
      $heart.style.left = `${window.innerWidth - event.data[0].x  }px`;
      // balEl.style.top = `${event.data[0].y  }px`;
      console.log('detecting color');
      let rect = $heart.getBoundingClientRect();
      if (rect.left < 350){
        stopTracking();
      }
    }
  });
};

const stopTracking = () => {
  $heart.style.left = `350px`;
}

init();
