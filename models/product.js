const db=require('../util/database');
module.exports = class Product {
  constructor(id,title, imageUrl, description, price) {
    this.id=id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
      return db.execute('INSERT INTO products (title,price,imageUrl,description) VALUES (?,?,?,?)',
      [this.title,this.price,this.imageUrl,this.description]);
    
  }
  
  update(product){
    console.log(product)
    return db.execute(`UPDATE products SET title=${product.title},price=${product.price},imageUrl=${product.imageUrl},description=${product.description} WHERE id=${product.id}`)
  }
  
  static delete(id) {
    return db.execute('DELETE FROM products where id=?',[id]);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }
  
  static findById(id){
    return db.execute('SELECT * FROM products where id= ?',[id])
}
}
