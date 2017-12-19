const Hapi = require(`hapi`);
const inert = require(`inert`);
const server = new Hapi.Server();
const shortid = require(`shortid`);
const qrcode = require(`qrcode-generator`);

server.register(inert, err => {
  if (err) {
    throw err;
  }
  server.route({
    method: `GET`,
    path: `/{param*}`,
    handler: {
      directory: {
        path: `./server/public`,
        redirectToSlash: true,
        index: true
      }
    }
  });
});

server.connection({
  port: process.env.PORT || 8080,
  host: `0.0.0.0`
});

const io = require(`socket.io`)(server.listener);
const users = {};


io.on(`connection`, socket => {
  console.log(`connection`);

  const sid = shortid.generate();
  users[sid] = {
    id: socket.id
  };
  console.log(sid);

  const qr = qrcode(0, `L`); //TYPENUMBER, 'CORRECTION LEVEL'
  qr.addData(`${`https://warlockapp.herokuapp.com` + `/` + `controller.html?id=`}${  sid}`);
  qr.make();
  const qrDom = qr.createImgTag(4, 4 * 4);
  socket.emit(`qrDom`, qrDom);

  socket.on(`update`, (targetId, data) => {
    if (!users[targetId]) {
      return;
    }
    socket.to(users[targetId].id).emit(`update`, data);
  });

  socket.on(`sceneTarget`, sceneTarget => {
    console.log(sceneTarget);
  });


  socket.on(`disconnect`, () => {
    console.log(`disconnect`);
    delete users[sid];
  });
});

server.start(err => {
  if (err) {
    throw err;
  }
  console.log(`server running at= ${server.info.uri}`);
});
