import io from 'socket.io-client';
const divRoot = document.getElementById(`inputVideo`);
let faceMode = affdex.FaceDetectorMode.LARGE_FACES;
let detector = new affdex.CameraDetector(divRoot, 1280, 720, faceMode);
let points = [];
let socket = [];
let pause = 0;

const $witchName = document.querySelector(`.witchName`);
const names = [`Brencis Brevil`, `Panasora Brenainn`, `Kadir Depraysie`];
let index = 0;

const init = () => {
  socket = io.connect(`/`);
  socket.on(`connect`, () => {
});

  initialiseCamera();
  setEventsDetector();
  setClassifiersDetector();
  initialiseDetector();
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
  if (faces[0]){
    if(faces[0].expressions.smile > 20) {
      pause ++;
      if (pause === 3){
        changeName();
        pause = 0;
      }
    }
  }
};

const startNextScene = () => {
  console.log('VOLGENDE SCÈNE');
  detector.stop();
}

const changeName = () => {
  index += 1;
  if (index > names.length - 1) {
    startNextScene();
    index = 0;
  }
  $witchName.innerHTML = names[index];
}

init();
