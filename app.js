/******************************************** LIBRARIES ************************************************/
require('dotenv').config()
const path = require('path');
const request = require('request');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);// invoking the function with the session constant
const csrf = require('csurf');
const multer = require('multer');
const bcrypt = require('bcryptjs');
var cors = require('cors')
const CartController = require('./app/controllers/CartController');
// const isLogged = require('./middleware/isLogged');
const compression = require('compression')


/******************************************** MODELS ************************************************/

/******************************************** ENV VARIABLES ************************************************/
const DATABASE_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@shop-vzyvr.mongodb.net/${process.env.DB_NAME}`;

/******************************************** EXPRESS ************************************************/
const app = express();

app.use(cors())



/******************************************** PACKAGES USAGE ************************************************/

/** SESSION STROING **/
    const store = new MongoDBStore({
        uri: DATABASE_URI,
        collection: 'sessions'
    }); // session in mongodb
    store.on('error', function(error) {
        console.error(new Error(error));
    });


/** STATIC FOLDER **/
    // Setting static folder 
    app.use(express.static('public'));

/** BODY PARSER **/
    // Parse the incoming request body
    app.use(bodyParser.urlencoded({extended: false}));
    // parse application/json
    app.use(bodyParser.json());

/** MULTER **/
    const fileStorage = multer.diskStorage({
        destination: (req, file ,cb) => {
            // Error   destainetion
            cb(null, './public/images');
        },
        filename: (req, file, cb) => {
            // hashing in sync mode because it takes time to hash file name 
            // so we're doing that to prevent an error.
            let hash = bcrypt.hashSync(file.originalname, 12);
            // error       filename
            cb(null, `${hash}${file.originalname}`);
        },
    });
    // filter for multer test test
    const fileFilter = (req, file, cb) => {
        if( file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
            ){
            cb(null, true);
        }else{
            cb(null, false);
        }
    }
    // middleware for handling files
    app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

/** METHOD OVERRIDE **/
    // override with POST having ?_method=DELETE
    app.use(methodOverride('_method'));

/** SESSION **/
    // Express session middleware
    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
        secret: 'my secret',
        store: store, // DECLATING WWHERE OUR SESSION WILL BE STOERD
        resave: false,// the session will not be saved on veevry request that is done
        saveUninitialized: false,
    }));

/** FLASH **/
app.use(flash());
// app.use(function(req, res, next){
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next(); // next peice of middlewae
// }); 


/******************************************** MIDDLEWARES ************************************************/
app.use(compression())
// Checking if user is logged in
app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.username = req.session.username;
    res.locals.isAdmin = req.session.isAdmin;
    next();
})
/** LOGGING AS USER **/
app.use(require('./middleware/loginUser'));
// Error Hanlding middleware
app.use(require('./middleware/errorMiddleware'));
    // app.use(require('./middleware/isAuth'));
/******************************************** TEMPLATES ************************************************/
/** Setting ejs template **/ 
    app.set('view engine', 'ejs');
    app.use(expressLayouts);


/** Routes Without CSRF Protection **/
app.post('/checkout', CartController.postCheckout);

/** CSRF **/
    // Important! using csrf after the session because csrf is using the session.
    app.use(csrf());
    app.use((req, res, next)=>{
        res.locals.csrfToken = req.csrfToken();
        next();
    })

    // custom EJS (CSRF, DELETE, PUT)
    app.use(require('./ejs_short_cuts/csrf'));
    app.use(require('./ejs_short_cuts/delete'));
    app.use(require('./ejs_short_cuts/put'));

/******************************************** GLOBAL VARIABLES ************************************************/
// app.use((req,res,next)=>{
//     console.log(req)
//     next();
// })

/******************************************** ROUTING ************************************************/
app.use(require('./routes/router'))


/******************************************** LISTENING TO PORT ************************************************/
mongoose.connect(DATABASE_URI, {useNewUrlParser: true,  useFindAndModify: false })
.then((result) => {
    if(process.env.ROUTE_LIST === true){
        app.listen(process.env.PORT, () => require('./routeTable')('', require('./routes/router').stack));
    }else{
        app.listen(process.env.PORT, () => console.log(`listening to: ${process.env.BASE_URL}:${process.env.PORT}`));
    }
}).catch((err) => {
    console.error(new Error(err));
});;