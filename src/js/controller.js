let socket, targetId;
const Shake = require('shake.js');

const init = () => {
  targetId = getUrlParameter(`id`);
  if (!targetId) {
    alert(`missing id`);
    return;
  }

  socket = io.connect(`/`);
  console.log(`CONTROLLER.JS`);

  window.addEventListener(`deviceorientation`, handleOrientation, true);
  shake();
};

const getUrlParameter = name => {
  name = name.replace(/[\[]/, `\\[`).replace(/[\]]/, `\\]`);
  const regex = new RegExp(`[\\?&]${  name  }=([^&#]*)`);
  const results = regex.exec(location.search);
  return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ` `));
};

const handleOrientation = e => {
  socket.emit(`update`, targetId, {
    alpha: e.alpha,
    beta: e.beta,
    gamma: e.gamma
  });

};

const shake = () => {
  let shakeEvent = new Shake({threshold: 15});
  shakeEvent.start();
  window.addEventListener(`shake`, sendAlert)
}

const sendAlert = e => {
  socket.emit('update', targetId, {
    shaked: true
  });
  document.getElementById(`title`).innerHTML = `shaked`;
}

init();
