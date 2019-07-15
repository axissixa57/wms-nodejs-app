import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import session from 'express-session';
import htmlPdf from 'html-pdf';
import ejs from 'ejs';

import { myConfig } from './library/config';

import { logRouter } from './routes/logRouter';
import { registrationRouter } from './routes/registrationRouter';
import { mainRouter } from './routes/mainRouter';
import { docsRouter } from './routes/docsRouter';
import { logbooksRouter } from './routes/logbooksRouter';
import { handbooksRouter } from './routes/handbooksRouter';
import { reportsRouter } from './routes/reportsRouter';
import { apiRouter } from './routes/apiRouter';

import { User } from './models/User';

const app = express();

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: myConfig.session.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: myConfig.session.SESS_SECRET,
    cookie: {
        maxAge: myConfig.session.SESS_LIFETIME,
        sameSite: true,
        secure: false // ипсользование http, true - https
    }
}));

// res.locals.user
app.use(async (req, res, next) => {
    const { userId } = req.session;
    if (userId) {
        res.locals.user = await User.findById(userId);
    }
    next();
})

app.use('/', logRouter);
app.use('/registration', registrationRouter);
app.use('/main', mainRouter);
app.use('/docs', docsRouter);
app.use('/logbooks', logbooksRouter);
app.use('/reports', reportsRouter);
app.use('/handbooks', handbooksRouter);
app.use('/api', apiRouter);

// 404
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

mongoose.connect("mongodb://localhost:27017/wmsDB", { useNewUrlParser: true }, function (err) {
    if (err) console.log('Error in DB connection : ' + err)
    else console.log('MongoDB Connection Succeeded.')

    app.listen(3000, function () {
        console.log("Сервер ожидает подключения... Open http://127.0.0.1:3000/ in your browser.");
    });
});
