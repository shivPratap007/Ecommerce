const express=require('express');

const router=express.Router();

const {newOrder, getSingleOrder, myOrders, allOrders, updateOrder, deleteOrder}=require('../controllers/orderController');

const {auth,adminAuth}=require('../middlewares/auth');



// To get all the orders of logged in account
router.get('/order/me',auth,myOrders);

// To get single order
router.get('/order/:id',auth,adminAuth("admin"),getSingleOrder);

// To get all the orders
router.get('/admin/orders',auth,adminAuth("admin"),allOrders);

// To update the orders
router.put('/admin/order/:id',auth,adminAuth("admin"),updateOrder);

// To delete order
router.delete('/admin/order/:id',auth,adminAuth("admin"),deleteOrder);

// To create new Products
router.post('/order/new',auth,newOrder);





module.exports=router;