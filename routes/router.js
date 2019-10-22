const express = require('express'),
      router = express.Router();
const { check } = require('express-validator');

/************************************** Middlewares ************************************/ 
const isAdmin = require('../middleware/isAdmin');
const isAuth = require('../middleware/isAuth');
const isLogged = require('../middleware/isLogged');
const registerMiddleware = require('../middleware/registerMiddleware');
const loginMiddleware = require('../middleware/loginMiddleware');
const addCategoryMiddleware = require('../middleware/addCategoryMiddleware');
const addProductMiddleware = require('../middleware/addProductMiddleware');


/************************************** Controllers ************************************/
const PagesController = require('../app/controllers/PagesController');
const ShopController = require('../app/controllers/ShopController');
const CmsController = require('../app/controllers/CmsController');
const CategoriesController = require('../app/controllers/CategoriesController');
const ProductsController = require('../app/controllers/ProductsController');
const UsersController = require('../app/controllers/UsersController');
const CartController = require('../app/controllers/CartController');
const OrdersController = require('../app/controllers/OrdersController');
const ProfileController = require('../app/controllers/ProfileController');

/**
 **
 *****************************
 *-----------WEBSITE----------
 *****************************
 */

/************************************** PagesController ************************************/ 
router.get('/', PagesController.index);
router.get('/about', PagesController.about);
router.get('/contact', PagesController.contact);

/************************************** ProductsController ************************************/
router.get('/shop/:category_slug/:product_slug', ProductsController.show);

/************************************** UsersController ************************************/
//       ||     -- URL --      ||     ||-- MIDDLEWARE --||  || -- CONTROLLER --          ||                        //

router.get('/register',                                         UsersController.register);
router.post('/register',                registerMiddleware ,    UsersController.store);
router.get('/login',                                            UsersController.login);
router.post('/login',                   loginMiddleware ,       UsersController.postLogin);
router.post('/logout',                                          UsersController.logout);
router.get('/reset-password',                                   UsersController.resetPasword);
router.post('/reset-password',                                  UsersController.postResetPassword);
router.get('/new-password/:token',                              UsersController.newPassword);
router.post('/new-password',                                    UsersController.storeNewPassword);

/************************************** ProfileController ************************************/
//       ||     -- URL --      ||     ||-- MIDDLEWARE --||  || -- CONTROLLER --          ||                        //
router.get('/profile',                      isLogged,       ProfileController.index);
router.get('/profile/orders',               isLogged,       ProfileController.orders);
router.get('/profile/orders/:order_id',     isLogged,       ProfileController.showInvoice);
router.get('/profile/wish-lists',           isLogged,       ProfileController.wishList);
router.get('/profile/update-user-settings', isLogged,       ProfileController.updateUser);
router.put('/profile/update-user-name',     isLogged,       ProfileController.updateUsername);
router.put('/profile/update-user-email',    isLogged,       ProfileController.updateUserEmail);
router.put('/profile/update-user-password', isLogged,       ProfileController.updateUserPassword);

/************************************** ShopController ************************************/
router.get('/shop', ShopController.index);
router.get('/shop/:category_slug', ShopController.show);

/************************************** CartController ************************************/
router.post('/shop/:category_slug/:product_slug/:id/addtocart', CartController.storeProduct); 
router.get('/cart', CartController.index);
// router.get('/checkout', CartController.checkout);
router.put('/cart/:id', CartController.updateQty);
router.delete('/cart/:id', CartController.destroy);

/************************************** OrdersController ************************************/

/**
 **
 *****************************
 *-----------CMS--------------
 *****************************
 */

/************************************** CmsController ************************************/
//            -- URL --           ||  -- MIDDLEWARE --   ||        -- CONTROLLER --              ||
router.get('/cms',                      isAdmin,                CmsController.index);
router.get('/cms/categories',           isAdmin,                CmsController.showCategories);
router.get('/cms/products',             isAdmin,                CmsController.showProducts);
router.get('/cms/users',                isAdmin,                CmsController.showCustomers);


/************************************** CategoriesController ************************************/ 
//            -- URL --           ||  -- MIDDLEWARE --   ||        -- CONTROLLER --              ||
router.get('/cms/categories/create',    isAdmin,                CategoriesController.create);
router.get('/cms/categories/:id',       isAdmin,                CategoriesController.edit);
// Storing a Category
router.post('/cms/categories', isAdmin, addCategoryMiddleware , CategoriesController.store);

router.delete('/cms/categories/:id',    isAdmin,                CategoriesController.destroy);
router.put('/cms/categories/:id',       isAdmin, addCategoryMiddleware,                CategoriesController.update);

/************************************** ProductsController ************************************/
//            -- URL --          ||  -- MIDDLEWARE --   ||        -- CONTROLLER --              ||
router.get('/cms/products/create',      isAdmin,                ProductsController.create);
router.post('/cms/products', isAdmin, addProductMiddleware,     ProductsController.store);
router.get('/cms/products/:id',         isAdmin,                ProductsController.edit);
router.put('/cms/products/:id',         isAdmin,                ProductsController.update);
router.delete('/cms/products/:id',      isAdmin,                ProductsController.destroy);

/************************************** UsersController ************************************/
//            -- URL --           ||  -- MIDDLEWARE --   ||        -- CONTROLLER --              ||
router.get('/cms/users/:id',            isAdmin,                UsersController.edit);
router.put('/cms/users/:id',            isAdmin,                UsersController.update);
router.delete('/cms/users/:id',         isAdmin,                UsersController.destroy);
/************************************** OrdersController ************************************/
//            -- URL --           ||  -- MIDDLEWARE --           -- CONTROLLER --              ||
router.get('/cms/orders',               isAdmin,                OrdersController.index);
router.get('/cms/orders',               isAdmin,                OrdersController.index);
router.get('/cms/orders/:id',           isAdmin,                OrdersController.edit);
router.put('/cms/orders/:order/:product',           isAdmin,                OrdersController.update);
router.delete('/cms/orders/:id',        isAdmin,                OrdersController.destroy);



// 500 Server Error
router.get('/500', PagesController.serverError);
router.get('/403', PagesController.unauthorized);

// 404 Not found
router.use(PagesController.pageNotFound);



module.exports = router;