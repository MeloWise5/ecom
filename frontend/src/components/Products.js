import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
function Products( { product }) {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
        <Card.Title as='div'>
          <strong>{product.name}</strong>
        </Card.Title>
        </Link>
        <Card.Text as='div'>
          <div className='my-3'>
            <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'}/>
          </div>
        </Card.Text>
        <Card.Text as='h3' className='pt-2 pb-1'>${product.price}</Card.Text>
      </Card.Body>
      <Link to={`/product/${product._id}`}>
        <button className='btn btn-primary btn-block'>View Details</button>
      </Link>
    </Card>
  )
}

export default Products
