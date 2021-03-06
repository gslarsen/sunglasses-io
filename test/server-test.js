const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server');
const should = chai.should();

chai.use(chaiHttp);

// BRANDS //
describe('Brands', () => {
  // GET /api/brands
  describe('/GET brands', () => {
    it('it should GET all the brands', done => {
      chai
        .request(server)
        .get('/api/brands')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(5);
          done();
        });
    });
  });

  // GET /api/brands/:id/products
  // valid brand id
  describe('/GET brands/:id/products with valid id param', () => {
    it('it should GET all the products associated with the given brand id', done => {
      chai
        .request(server)
        .get('/api/brands/1/products')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(3);
          done();
        });
    });
  });

  describe('/GET brands/:id/products with invalid id param', () => {
    it('it should return a 404 error', done => {
      chai
        .request(server)
        .get('/api/brands/products')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});

// PRODUCTS //
describe('Products', () => {
  // GET /api/products without keywords query
  describe('/GET products', () => {
    it('it should GET all the products', done => {
      chai
        .request(server)
        .get('/api/products')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(11);
          done();
        });
    });
  });

  // GET /api/products with keywords query to be implemented fully after learning about no-sql database solutions (e.g. Mongodb)
  describe('/GET products', () => {
    it('it should GET all the products', done => {
      chai
        .request(server)
        .get('/api/products')
        .query({
          keywords: 'random'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(11);
          done();
        });
    });
  });
});

// USER //
describe('User', () => {
  // POST /api/login for valid credentials
  describe('/POST login with valid creds', () => {
    it('it should return OK and a session token as a string with 16 chars', done => {
      chai
        .request(server)
        .post('/api/login')
        .send({
          email: 'susanna.richards@example.com',
          password: 'jonjon'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('token');
          res.body.token.should.be.a('string');
          res.body.token.length.should.eql(16);
          done();
        });
    });
  });

  // POST /api/login for invalid credentials
  describe('/POST login with invalid password', () => {
    it('it should return 401 error for invalid creds', done => {
      chai
        .request(server)
        .post('/api/login')
        .send({
          email: 'susanna.richards@example.com',
          password: 'blah'
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('/POST login with invalid email', () => {
    it('it should return 401 error for invalid creds', done => {
      chai
        .request(server)
        .post('/api/login')
        .send({
          email: 's.richards@example.com',
          password: 'jonjon'
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  // POST login with missing email credential parameter
  describe('/POST login with missing email', () => {
    it('it should return 400 error for incorrect request', done => {
      chai
        .request(server)
        .post('/api/login')
        .send({

          password: 'jonjon'
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  // POST login with missing password parameter
  describe('/POST login with missing password', () => {
    it('it should return 400 error for incorrect request', done => {
      chai
        .request(server)
        .post('/api/login')
        .send({
          email: 's.richards@example.com'
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  // GET cart
  // Valid session token
  describe('/GET logged-in user cart', () => {
    it('it should return cart for a valid session token', done => {
      chai
        .request(server)
        .get('/api/me/cart')
        .query({
          token: 'random1661modnar'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
  });

  // Missing session token
  describe('/GET logged-in user cart', () => {
    it('it should respond with 400 error if token not in request', done => {
      chai
        .request(server)
        .get('/api/me/cart')
        .query({
          
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  // Invalid session token
  describe('/GET logged-in user cart', () => {
    it('it should respond with 401 error if token is invalid', done => {
      chai
        .request(server)
        .get('/api/me/cart')
        .query({
          token: 'invalidtoken'
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  // POST cart
  // Valid token and product
  describe('/POST item to cart with valid token and product', () => {
    it('it should return cart with item included', done => {
      chai
        .request(server)
        .post('/api/me/cart')
        .query({
          token: 'random1661modnar'
        })
        .send({
          "id": "10",
          "categoryId": "5",
          "name": "Peanut Butter",
          "description": "The stickiest glasses in the world",
          "price":103,
          "imageUrls":["https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg"]
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.eql(1);
          done();
        });
    });
  });

  // Missing token
  describe('/POST item to cart with missing token', () => {
    it('it should return 400 error', done => {
      chai
        .request(server)
        .post('/api/me/cart')
        .query({
          
        })
        .send({
          "id": "10",
          "categoryId": "5",
          "name": "Peanut Butter",
          "description": "The stickiest glasses in the world",
          "price":103,
          "imageUrls":["https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg"]
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  // Invalid token
  describe('/POST item to cart with invalid token', () => {
    it('it should return 401 error', done => {
      chai
        .request(server)
        .post('/api/me/cart')
        .query({
          token: 'invalidtoken'
        })
        .send({
          "id": "10",
          "categoryId": "5",
          "name": "Peanut Butter",
          "description": "The stickiest glasses in the world",
          "price":103,
          "imageUrls":["https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg"]
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  // Invalid product
  describe('/POST item to cart with invalid product', () => {
    it('it should return 400 error - do not divulge more than necessary re: products', done => {
      chai
        .request(server)
        .post('/api/me/cart')
        .query({
          token: 'random1661modnar'
        })
        .send({
          "id": "10",
          "categoryId": "5",
          "name": "Peanut Butter!!!!!",
          "description": "The stickiest glasses in the world",
          "price":103,
          "imageUrls":["https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg"]
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  // Missing product
  describe('/POST item to cart with missing product', () => {
    it('it should return 400 error', done => {
      chai
        .request(server)
        .post('/api/me/cart')
        .query({
          token: 'random1661modnar'
        })
        .send()
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  // UPDATING a cart total
  describe('/POST update to cart with valid token and product, when item was previously added to cart', () => {
    it('it should respond with OK and the revised cart', done => {
      chai
        .request(server)
        .post('/api/me/cart/10')
        .query({token: 'random1661modnar', quantity: 3})
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(1);
          res.body[0].should.have.property('quantity').eql(3);
          done();
        });
    });
  });

  describe('/POST update to cart with valid token and product, when item was NOT previously added to cart', () => {
    it('it should respond with OK and the revised cart', done => {
      chai
        .request(server)
        .post('/api/me/cart/1')
        .query({token: 'random1661modnar', quantity: 6})
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(2);
          res.body[1].should.have.property('quantity').eql(6);
          done();
        });
    });
  });

  describe('/POST update to cart with invalid token', () => {
    it('it should respond with 401 error', done => {
      chai
        .request(server)
        .post('/api/me/cart/10')
        .query({token: 'zzz', quantity: 3})
        .send({})
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('/POST update to cart with missing token', () => {
    it('it should respond with 400 error', done => {
      chai
        .request(server)
        .post('/api/me/cart/10')
        .query({quantity: 3})
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/POST update to cart with invalid product', () => {
    it('it should respond with 400 error - do not divulge more than necessary re: products', done => {
      chai
        .request(server)
        .post('/api/me/cart/1z')
        .query({token: 'random1661modnar', quantity: 3})
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/POST update to cart with invalid quantity', () => {
    it('it should respond with 400 error', done => {
      chai
        .request(server)
        .post('/api/me/cart/10')
        .query({token: 'random1661modnar', quantity: -3})
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  // DELETING items from cart
  describe('/DELETE item from cart with valid token and product', () => {
    it('it should respond with OK and the revised cart', done => {
      chai
        .request(server)
        .delete('/api/me/cart/1')
        .query({token: 'random1661modnar'})
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(1);
          done();
        });
    });
  });

  describe('/DELETE item from cart when item is not in cart', () => {
    it('it should respond with 400 error', done => {
      chai
        .request(server)
        .delete('/api/me/cart/2')
        .query({token: 'random1661modnar'})
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/DELETE item from cart with invalid product parameter', () => {
    it('it should respond with 400 error', done => {
      chai
        .request(server)
        .delete('/api/me/cart/2z')
        .query({token: 'random1661modnar'})
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/DELETE item from cart with invalid token', () => {
    it('it should respond with 401 error', done => {
      chai
        .request(server)
        .delete('/api/me/cart/10')
        .query({token: 'random1661modnarblahblahblah'})
        .send({})
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('/DELETE item from cart with missing token', () => {
    it('it should respond with 400 error', done => {
      chai
        .request(server)
        .delete('/api/me/cart/10')
        .query({})
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

});
