const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const Redis = require('ioredis');

const port = (process.env.REDIS_PORT && process.env.REDIS_PORT.includes(':')
  ? Number(process.env.REDIS_PORT.split(':').pop()) // for Docker
  : process.env.REDIS_PORT) || 6379;
const host = (process.env.REDIS_NAME && process.env.REDIS_NAME.split('/').pop()) // for Docker
  || process.env.REDIS_HOST || 'localhost';

const redisOption = {
  db: process.env.REDIS_DB || 0,
  port,
  host,
};

const redis = new Redis(redisOption);
const app = new Koa();

if (process.env.NODE_ENV === 'production') {
  app.use(serve(path.resolve('./public')));
} else {
  console.log('development mode'); // eslint-disable-line no-console
  app.use(serve(path.resolve('./public')));
}

const server = app.listen(process.env.PORT || 3000);
const io = require('socket.io')(server);

io.on('connection', async (socket) => {
  io.emit('visitor', { count: socket.client.conn.server.clientsCount });

  const [anzuCount, conohaCount] = (await redis.multi()
    .get('count:anzu')
    .get('count:conoha')
    .exec()).map((res) => res[1]);

  // 初期データ配信
  await socket.emit('init', {
    anzu: Number(anzuCount),
    conoha: Number(conohaCount),
  });

  socket.on('love', (data) => {
    const { type } = data;
    if (type === 'anzu' || type === 'conoha') {
      redis.incr(`count:${type}`);
      io.emit('love', { type });
    }
  });

  socket.on('disconnect', () => {
    io.emit('visitor', { count: socket.client.conn.server.clientsCount });
  });
});
