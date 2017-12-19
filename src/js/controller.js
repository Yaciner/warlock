let socket, targetId, sceneTarget;
const Shake = require(`shake.js`);
import io from 'socket.io-client';
const $ontdek = document.querySelector(`.button-ontdek`);
const $volgende = document.querySelector(`.button-volgende`);


const init = () => {
  targetId = getUrlParameter(`id`);
  if (!targetId) {
    alert(`missing id`);
    return;
  }

  socket = io.connect(`/`);

  window.addEventListener(`deviceorientation`, handleOrientation, true);
  $ontdek.addEventListener(`click`, handleOntdek);
  $volgende.addEventListener(`click`, handleVolgende);
  window.addEventListener(`touchmove`, handleTouch);
  shake();
};

const getUrlParameter = name => {
  name = name.replace(/[\[]/, `\\[`).replace(/[\]]/, `\\]`);
  const regex = new RegExp(`[\\?&]${  name  }=([^&#]*)`);
  const results = regex.exec(location.search);
  return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ` `));
};

const handleOntdek = e => {
  sceneTarget = 2;
  e.preventDefault();
  socket.emit(`update`, targetId, {
    target: sceneTarget
  });
  window.scrollTo(0, window.innerHeight);
};

const handleVolgende = e => {
  e.preventDefault();
  sceneTarget ++;
  socket.emit(`update`, targetId, {
    target: sceneTarget
  });

};

const handleOrientation = e => {
  socket.emit(`update`, targetId, {
    alpha: e.alpha,
    beta: e.beta,
    gamma: e.gamma
  });

};

const shake = () => {
  const shakeEvent = new Shake({threshold: 15});
  shakeEvent.start();
  window.addEventListener(`shake`, sendAlert)
}

const sendAlert = e => {
  socket.emit(`update`, targetId, {
    shaked: true
  });
  document.getElementById(`title`).innerHTML = `shaked`;
}

const handleTouch = e => {
  socket.emit(`update`, targetId, {
    x: e.touches[0].clientX / window.innerWidth,
    y: e.touches[0].clientY / window.innerHeight
  });

};

init();
