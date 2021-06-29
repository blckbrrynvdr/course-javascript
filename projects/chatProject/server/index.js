const fs = require('fs');
const path = require('path');
const http = require('http');
const Index = require('ws');
console.log('server is starting');

function readBody(req) {
  return new Promise((resolve, reject) => {
    let dataRaw = '';

    req.on('data', (chunk) => (dataRaw += chunk));
    req.on('error', reject);
    req.on('end', () => resolve(JSON.parse(dataRaw)));
  });
}

const server = http.createServer(async (req, res) => {
  console.log('req.url', req.url);
  try {
    if (/\/photos\/.+\.png/.test(req.url)) {
      const [, imageName] = req.url.match(/\/photos\/(.+\.png)/) || [];
      const fallBackPath = path.resolve(__dirname, '../noimage.png');

      const filePath = path.resolve(__dirname, '../photos', imageName);
      console.log('filePath', filePath);
      console.log('imageName', imageName);

      if (fs.existsSync(filePath)) {
        console.log('existsSync', filePath);
        return fs.createReadStream(filePath).pipe(res);
      } else {
        console.log('not existsSync', filePath);
        return fs.createReadStream(fallBackPath).pipe(res);
      }
    } else if (req.url.endsWith('/upload-photo')) {
      console.log('in upload');
      const body = await readBody(req);
      const name = body.name.replace(/\.\.\/|\//, '');
      const [, content] = body.image.match(/data:image\/.+?;base64,(.+)/) || [];
      console.log('before filepath');
      const filePath = path.resolve(__dirname, '../photos', `${name}.png`);

      if (name && content) {
        fs.writeFileSync(filePath, content, 'base64');

        broadcast(connections, { type: 'photo-changed', data: { name } });
      } else {
        return res.end('fail');
      }
    }

    res.end('ok');
  } catch (e) {
    console.error(e);
    res.end('fail');
  }
  console.log('end try catch');
});
const wss = new Index.Server({ server });
const connections = new Map();

wss.on('connection', (socket) => {
  connections.set(socket, {});

  socket.on('message', (messageData) => {
    const message = JSON.parse(messageData);
    let excludeItself = false;

    if (message.type === 'hello') {
      excludeItself = true;
      connections.get(socket).userName = message.data.name;
      sendMessageTo(
        {
          type: 'user-list',
          data: [...connections.values()].map((item) => item.userName).filter(Boolean),
        },
        socket
      );
    }

    sendMessageFrom(connections, message, socket, excludeItself);
  });
  socket.on('close', () => {
    sendMessageFrom(connections, { type: 'close-connect' }, socket);
    connections.delete(socket);
  });
});

function broadcast(connections, message) {
  for (const connection of connections.keys()) {
    connection.send(JSON.stringify(message));
  }
}

function sendMessageTo(message, to) {
  to.send(JSON.stringify(message));
}

function sendMessageFrom(connections, message, from, excludeSelf) {
  const socketData = connections.get(from);
  console.log('socketData from', socketData);
  if (!socketData) return;

  message.from = socketData.userName;
  console.log('message', message);

  for (const connection of connections.keys()) {
    if (connection === from && excludeSelf) continue;

    connection.send(JSON.stringify(message));
  }
}

server.listen(8181);
