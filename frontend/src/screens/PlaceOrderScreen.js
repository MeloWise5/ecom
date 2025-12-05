import React, { useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'

function PlaceorderScreen({}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const orderCreate = useSelector(state => state.orderCreate)
    const { order, error, success } = orderCreate
    //creating custom attributes for this page only
    cart.itemsPrice = cart.cartItems.reduce((acc,item) => Number(acc + item.price *item.qty), 0).toFixed(2)
    cart.shippingPrice = Number(cart.itemsPrice > 100 ? 0 : 19).toFixed(2)
    cart.taxPrice = Number((0.075) * cart.itemsPrice).toFixed(2)
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

    if(!cart.paymentMethod){
        navigate('/payment')
    }
    const placeOrder = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress:cart.shippingAddress,
            paymentMethod:cart.paymentMethod,
            itemsPrice:cart.itemsPrice,
            shippingPrice:cart.shippingPrice,
            taxPrice:cart.taxPrice,
            totalPrice:cart.totalPrice,
        }))
    }
    // redirect user to profile order section if the order is success already.
    useEffect(() => {
        if(success) {
            navigate(`/order/${order._id}`)
            // we need to now clear the state and the local storage
            dispatch({type: ORDER_CREATE_RESET })
        }
    },[success,navigate])
  return (
    <div>
        <FormContainer>
            <CheckoutSteps step1 step2 step3 step4 />
        </FormContainer>
        
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item className='border-top'>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Shipping:</strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}
                            {'    '}
                            {cart.shippingAddress.postalCode}
                            {'    '}
                            {cart.shippingAddress.country}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item className='border border-success'>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method:</strong>
                            {cart.paymentMethod}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item className='border-4'>
                        <h2>Order Items</h2>
                        {cart.cartItems.length === 0 ? <Message variant="info">Your Cart is empty</Message> : (
                            <ListGroup variant='flush'>
                                {cart.cartItems.map((item,index)=> (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} X ${item.price} = ${(item.qty*item.price).toFixed(2)}
                                            </Col>
                                        </Row>

                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <hr2>Order Summary</hr2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items:</Col>
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping:</Col>
                                <Col>${cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax:</Col>
                                <Col>${cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total:</Col>
                                <Col>${cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {
                                error && <Message variant='danger'>{error}</Message>
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button 
                                type='button' 
                                className='btn-block'
                                disabled={cart.cartItems===0}
                                onClick={placeOrder}
                            >
                                Place Order
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>     
            
            </Col>
        </Row>
    </div>
  )
}

export default PlaceorderScreen
