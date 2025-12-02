import session  from 'express-session';
import  sequelize from './database.js';
import connectSessionSequelize from 'connect-session-sequelize';

const SequelizeStore = connectSessionSequelize(session.Store);

const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'sessions',
  checkExpirationInterval: 15 * 60 * 1000, 
  expiration: 24 * 60 * 60 * 1000 
});


sessionStore.sync();

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  },
  name: 'auth.sid'
};

module.exports = session(sessionConfig);