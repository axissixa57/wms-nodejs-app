import http from 'http';
import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import chalk from 'chalk';
import session from 'express-session';

import { myConfig } from './library/config';

import { logRouter } from './routes/logRouter';
import { registrationRouter } from './routes/registrationRouter';
import { mainRouter } from './routes/mainRouter';
import { docsRouter } from './routes/docsRouter';
import { logbooksRouter } from './routes/logbooksRouter';
import { handbooksRouter } from './routes/handbooksRouter';
import { reportsRouter } from './routes/reportsRouter';
import { templateRouter } from './routes/templateRouter';
import { apiRouter } from './routes/apiRouter';

import { User } from './models/User';

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(
   logger((tokens, req, res) => {
      return [
         chalk.green.bold(tokens.method(req, res)),
         chalk.red.bold(tokens.status(req, res)),
         chalk.white(tokens.url(req, res)),
         chalk.yellow(tokens['response-time'](req, res) + ' ms')
      ].join(' ');
   })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
   session({
      name: myConfig.session.SESS_NAME,
      resave: false,
      saveUninitialized: false,
      secret: myConfig.session.SESS_SECRET,
      cookie: {
         maxAge: myConfig.session.SESS_LIFETIME,
         sameSite: true,
         secure: false // ипсользование http, true - https
      }
   })
);

// res.locals.user
app.use(async (req, res, next) => {
   const { userId } = req.session;
   if (userId) {
      res.locals.user = await User.findById(userId);
   }
   next();
});

app.use('/', logRouter);
app.use('/registration', registrationRouter);
app.use('/main', mainRouter);
app.use('/docs', docsRouter);
app.use('/logbooks', logbooksRouter);
app.use('/reports', reportsRouter);
app.use('/handbooks', handbooksRouter);
app.use('/templates', templateRouter);
app.use('/api', apiRouter);

// 404
app.use((req, res) => {
   res.status(404).send('Sorry cant find that!');
});

mongoose.connect(
   // 'mongodb://localhost:27017/wmsDB',
   'mongodb+srv://Ax1S:niW2GScgBXO5tjgS@wmscluster-0jm4z.mongodb.net/wms?retryWrites=true&w=majority',
   { useNewUrlParser: true },
   err => {
      if (err) console.log(`Error in DB connection : ${err}`);
      else console.log('MongoDB Connection Succeeded.');
   }
);

// app.listen(process.env.PORT || 3000, () => {
//    console.log(
//       'Сервер ожидает подключения... Open http://127.0.0.1:3000/ in your browser.'
//    );
// });

var port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
// server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
   var port = parseInt(val, 10);

   if (isNaN(port)) {
      // named pipe
      return val;
   }

   if (port >= 0) {
      // port number
      return port;
   }

   return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
   if (error.syscall !== 'listen') {
      throw error;
   }

   var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

   // handle specific listen errors with friendly messages
   switch (error.code) {
      case 'EACCES':
         console.error(bind + ' requires elevated privileges');
         process.exit(1);
         break;
      case 'EADDRINUSE':
         console.error(bind + ' is already in use');
         process.exit(1);
         break;
      default:
         throw error;
   }
}

/**
 * Event listener for HTTP server "listening" event.
 */

// function onListening() {
//     var addr = server.address();
//     var bind = typeof addr === 'string'
//         ? 'pipe ' + addr
//         : 'port ' + addr.port;
//     debug('Listening on ' + bind);
// }
