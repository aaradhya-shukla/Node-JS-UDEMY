const { json } = require('body-parser');
const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports=class cart{
    static addProduct(id,price){
        fs.readFile(p,(err,fileContent)=>{
            let cart={product:[],totalPrice:0};
            if (!err){
                cart=JSON.parse(fileContent);
            }
            const existingProductIndex=cart.product.findIndex(p=>p.id===id)
            const existingProduct=cart.product[existingProductIndex];
            if (existingProduct){
                const updatedProduct={...existingProduct};
                updatedProduct.qty=updatedProduct.qty+1;
                cart.product=[...cart.product]
                cart.product[existingProductIndex]=updatedProduct;
                
            }
            else{
                let updatedProduct={id:id,qty:1}
                cart.product=[...cart.product,updatedProduct];

            }
            cart.totalPrice= cart.totalPrice + + price;
            fs.writeFile(p,JSON.stringify(cart),(err)=>{
                console.log(err)
            })
        })
    }
}