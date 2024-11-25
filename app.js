const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const app = express();


async function connect_to_mongo()  {

  try {

    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('connected to db');
    
  } catch (error) {
    console.log(error);
    
  }
}

connect_to_mongo();



const product_schema = new mongoose.Schema({
  name: String,
  quantity: Number,
});

const Product = mongoose.model('Product', product_schema);

app.use(morgan('dev'));
app.use(express.json());



app.post('/products', async (request, response) => {
  // 1. Destructure data from request.body
  const data = request.body;

  // 2. Save data to the database

  const new_product = new Product(data);

  try {
    await new_product.save();

    // 3. Respond to the client

    response.status(201).json({
      message: 'Created a product',
    });
  } catch (error) {
    console.log(error);

    response.status(400).json({
      message: 'Something went wrong!',
    });
  }
});

/**
 * Path:            /products
 * CRUD:            Read
 * HTTP Method:     Get
 * Description:     gets products
 * Payload:         no data
 */

app.get('/products', async (request, response) => {
  try {
    const products = await Product.find();

    response.status(200).json({
      message: 'All products',
      data: products,
    });
  } catch (error) {
    console.log(error);

    response.status(400).json({
      message: 'Something went wrong! ',
    });
  }
});


app.get('/products/:id', async (request, response) => {
  console.log(request.params);

  try {
    const product = await Product.findById(request.params.id);

    response.status(200).json({
      message: 'One product',
      data: product,
    });
  } catch (error) {
    console.log(error);

    response.status(400).json({
      message: 'Something went wrong',
    });
  }
});



app.put('/products/:id', async (request, response) => {
  const data = request.body;
  const params = request.params;

  try {
    await Product.findByIdAndUpdate(params.id, data);

    response.status(204).json({
      message: 'Product updated!',
    });
  } catch (error) {
    console.log(error);

    response.status(400).json({
      message: 'Something went wrong!',
    });
  }
});


app.delete('/products/:id', async (request, response) => {
  const params = request.params;

  try {
    await Product.findByIdAndDelete(params.id);

    response.status(200).json({
      message: 'Deleted!',
    });
  } catch (error) {
    console.log(error);

    response.status(400).json({
      message: 'Something went wrong!',
    });
  }
});

app.listen(3000, () => console.log('server is running...'));
