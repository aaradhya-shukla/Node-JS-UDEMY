const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products)=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err=>console.log(err));
};

exports.getProduct=(req,res,next)=>{
  const prodId=req.params.productId;
  Product.findByPk(prodId).
  then((product)=>{
    console.log("yesss")
    console.log(product)
    res.render('shop/product-detail',{product:product,pageTitle:product.title,path: '/products'});
  }).
  catch(err=>console.log(err))
  
}

exports.getIndex = (req, res, next) => {
  Product.findAll().then((products)=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err=>console.log(err))
    
};

exports.getCart = (req, res, next) => {
  req.user.getCart().
  then((cart)=>{
    return cart.getProducts()
  }).then((products)=>{
    console.log(products)
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products:products
    });
  })
  .catch(err=>console.log(err))
};

exports.postCart=(req,res,next)=>{
  const prodId=req.body.productId;
  let fetchedCart;
  let newQuantity=1;
  req.user.getCart().then((cart)=>{
    fetchedCart=cart
    return fetchedCart.getProducts({where : {id:prodId}})
  }).then((products)=>{
      let product;
      if (products.length>0){
        product=products[0];
      }

      if (product){
        let oldQuantity= product.cartItem.quantity;
        newQuantity = oldQuantity+1;
        return product;
      }
      return  Product.findByPk(prodId)
  }).then((product)=>{
      fetchedCart.addProduct(product, {through : {quantity : newQuantity}})
      
  }).then(()=>{
    res.redirect('/cart')
  }).catch(err=>console.log(err));
}

exports.postCartDeleteProduct=((req,res,next)=>{
  const prodId = req.body.productId;
  let newQuantity;
  req.user.getCart().
  then((cart)=>{
    return cart.getProducts({where:{id : prodId}})
  }).then((products)=>{
    let product =products[0]
    return product.cartItem.destroy();
  }).then(()=>{
    res.redirect('/cart');
  })
  .catch(err=>console.log(err))
})

exports.postOrder=(req,res,next)=>{
  let products;
  req.user.getCart().
  then((cart)=>{
    return cart.getProducts();
    }
  ).then((product)=>{
    products=product;
    return req.user.createOrder();
  }).then((order)=>{
    console.log(products)
    order.addProduct(products.map(product=>{
        product.orderItem={quantity:product.cartItem.quantity};
        return product
    }))
  }).then(()=>{
    res.redirect('/orders')
  })
  .catch(err=>console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include:['products']}).then((order)=>{
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders:order
    });
  }).catch(err=>console.log(err))
  
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
