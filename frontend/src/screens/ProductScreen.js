import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
//import axios from 'axios'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
//import products from '../products'
import { listProductDetails, createReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

function ProductScreen() {
  const params = useParams()
  const dispatch = useDispatch()
  const history = useNavigate()
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const userLogin = useSelector(state => state.userLogin)// comes from the store.js
  const { userInfo } = userLogin
  const productCreateReview = useSelector(state => state.productCreateReview)// comes from the store.js
  const { loading:loadingReview, error:errorReview, success:successReview } = productCreateReview
  const productDetails = useSelector(state => state.productDetails)// comes from the store.js
  const { loading, error, product } = productDetails

  useEffect(() => {
    return () => {
      dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
    }
  },[dispatch])
  useEffect(() => {
    if(successReview){
      setRating(0)
      setComment('')
      dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
    }
    dispatch(listProductDetails(params.id))
  }, [dispatch,params,successReview])
  
  const addToCartHandler = () => {
    history(`/cart/${params.id}?qty=${qty}`)
  }
  const addReviewHandler = (e) => {
    e.preventDefault()
    dispatch(createReview({rating,comment},params.id))
  }
  // the first load the product is empty so we need to handle that in the ?. JSX below
  return (
    
    <div>
      <Link className='btn btn-light my-3' to='/'>Go Back</Link>
      { 
        // conditional rendering all the states of the product fetch
        loading ? <Loader /> 
          : error ? <Message variant='danger'>{error}</Message> 
          : (
            <div>
            <Row>
              <Col md={6}>
                <Image src={product?.image} alt={product?.name} fluid />
              </Col>
              <Col md={3}>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h3>{product?.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating value={product?.rating} text={`${product?.numReviews} reviews`} color={'#f8e825'}/>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Price: ${product?.price}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Description: {product?.description}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col><strong>${product?.price}</strong></Col>
                      </Row>  

                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>  
                        <Col>{product?.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                      </Row>  
                    </ListGroup.Item>

                      { product?.countInStock > 0 && (
                        <ListGroup.Item>
                          <Row>
                            <Col>Qty</Col>
                            <Col xs='auto' className='my-1'>
                              <select value={qty} onChange={(e) => setQty(e.target.value)}>
                                {
                                  [...Array(product.countInStock).keys()].map(x => (  
                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                  ))
                                }
                              </select>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ) }


                    <ListGroup.Item>
                      <Button 
                        onClick={addToCartHandler}
                        className='btn-block' type='button' disabled={product?.countInStock === 0}>Add To Cart</Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <h4>{product?.name}</h4>
                {product?.reviews?.length === 0 && <Message variant='info'>No Reviews</Message>}

                <ListGroup variant='flush'>
                  {product?.reviews?.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review?.name}</strong>
                      <Rating value={review?.rating} color='#f8e825' />
                      <p>{review?.comment}</p>
                      <p>{new Date(review?.createdAt).toLocaleString()}</p>


                    </ListGroup.Item>
                  ))}

                
                <ListGroup.Item>
                  <h4>Write a review</h4>
                  {loadingReview && <Loader /> }
                  {successReview && <Message variant='success'>Review Submitted</Message> }
                  {errorReview && <Message variant='warning'>{errorReview}</Message> }
                  {userInfo ? (
                    <Form onSubmit={addReviewHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>
                          Rating
                        </Form.Label>
                        <Form.Control 
                          as='select'
                          value={rating}
                          onChange={(e)=> setRating(e.target.value)}>
                            <option value=''>Select...</option>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                            <option value='4'>4</option>
                            <option value='5'>5</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>
                          Review
                        </Form.Label>
                        <Form.Control
                          as='textarea'
                          rows='5'
                          value={comment}
                          onChange={(e)=> setComment(e.target.value)}>
                      </Form.Control>
                      <Button 
                        disabled={loadingReview}
                        type='submit'
                        variant='primary'>Submit</Button>

                      </Form.Group>
                    </Form>
                  ) : (
                    <Message variant='info'>Please <Link to='/login'>Login</Link> to place a review.</Message>
                  )}
                </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
            </div>
            ) 
          
      }
      
      
    </div>
  )
}

export default ProductScreen
