const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");
const store = new session.MemoryStore();
const logger = require('morgan');
// const passport = require('passport');

require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
// const csurf = require('csurf');

const db = require('./db/index');

const registerRouter = require('./routes/registration');
const loginRouter = require('./routes/login');
const productsRouter = require('./routes/products');
const accountRouter = require('./routes/account');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const ordersRouter = require('./routes/orders');

const PORT = process.env.PORT || 4000;



app.use(cookieParser());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(logger('dev'));
app.use(cors());
app.use(helmet());

app.use(
  session({
    secret: "secret-key",
    cookie: { maxAge: 86400000, 
    httpOnly: true, secure: false, sameSite: 'none', path: "/" },
    resave: false,
    saveUninitialized: false,
    store
  })
);

// app.use(passport.initialize());

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/products', productsRouter);
app.use('/account', accountRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/orders', ordersRouter);



// const csrfMiddleware = csurf({
//   cookie: {
//     maxAge: 3000,
//     secure: true,
//     sameSite: 'none'
//   }
// })

// app.use(csrfMiddleware);



// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser((id, done) => {
//   findById(id, function(err, user) {
//     if(err) return done(err);
//     done(null, user);
//   })
// });

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     db.users.findByUsername(username, (err, user) => {
//       if(err) return done(err);
//       if(!user) return done(null, false);
//       if(user.password != password) return done(null, false);
//       return done(null, user)
//     });
//   })
// );

app.get('/home', (req, res) => {
    res.send('This is the home page');
})

app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.log('error')
      throw error
    }
    console.log(results.rows)
    res.status(200).json(results.rows)
  })
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
})


//DELETE FROM users WHERE id IS NOT NULL;ALTER SEQUENCE users_id_seq RESTART WITH 1; to erase table and restart id serial in postgres
