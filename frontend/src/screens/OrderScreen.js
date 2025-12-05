import React, { useState, useEffect } from 'react'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'

import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET } from '../constants/orderConstants'

// Ad4nxK4Lzhfg_OO6Iy9aEc3lf2DQsd7rIGK67Yx7d_qb21pYlhxmYCbegfipXuyhreT-3_nhf-6MCovc
const ButtonWrapper = ({order}) => {
    const dispatch = useDispatch()
    const [{ isPending }] = usePayPalScriptReducer()
    const [hasError,setHasError] = useState(false)
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(order._id,paymentResult))
    }
    // https://developer.paypal.com/docs/api/orders/v2/#orders_capture
    return (
        <>
            { isPending && <Loader /> }
            { hasError && <Message variant='danger'>Error with paypal. Try again later.</Message> }
            <PayPalButtons style={{ layout: "horizontal" }} 
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: order.totalPrice,
                                currency_code: "USD"
                            }
                        }]
                    });
                }} 
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                    console.log("Captured:", details.id);
                    console.log("data:", data);
                    alert("Paid!");
                    successPaymentHandler(details)
                    });
                }}
                onError={() => {
                    return (
                        setHasError(true)
                    )
                }}
            />
        </>
    );
}
function OrderScreen({}) {

    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails
    const userLogin = useSelector(state => state.userLogin )
    const { userInfo } = userLogin

    const orderPay = useSelector(state => state.orderPay)
    const { success:successPay, loading:loadingPay } = orderPay
    const api_id = 'Ad4nxK4Lzhfg_OO6Iy9aEc3lf2DQsd7rIGK67Yx7d_qb21pYlhxmYCbegfipXuyhreT-3_nhf-6MCovc'
    //creating custom attributes for this page only
    if(!loading && !error){
        order.itemsPrice = order.orderItems.reduce((acc,item) => Number(acc + item.price *item.qty), 0).toFixed(2)
    }
    useEffect(() => {
        if(!userInfo){
            navigator('/login')
        }
        if(successPay || order?._id !== Number(params.id)) {
            dispatch({type:ORDER_PAY_RESET})
            dispatch(getOrderDetails(params.id))
        }
    },[dispatch,order,params,navigate,successPay])

    const initialOptions = {
        clientId: api_id,
        currency: "USD",
        components: "buttons",
    };
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <div> 
        <h2>Order Id: {order._id}</h2>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item className='border-top'>
                        <h2>Shipping</h2>
                        <p><strong>Name:</strong> {order.user.name}</p>
                        <p><strong>e-Mail:</strong> {order.user.email}</p>
                        <p>
                            <strong>Shipping:</strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}
                            {'    '}
                            {order.shippingAddress.postalCode}
                            {'    '}
                            {order.shippingAddress.country}
                        </p>
                         {order.isDelivered ? (
                            <Message variant="success">
                                Delivered on: {order.deliveredAt}
                            </Message>
                        ):(
                            <Message variant="warning">
                                Not Delivered
                            </Message>
                        )}
                    </ListGroup.Item>
                    <ListGroup.Item className='border border-success'>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method:</strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <Message variant="success">
                                Paid on: {order.paidAt}
                            </Message>
                        ):(
                            <Message variant="warning">
                                Not Paid
                            </Message>
                        )}
                    </ListGroup.Item>
                    <ListGroup.Item className='border-4'>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? <Message variant="info">Your Order is empty</Message> : (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item,index)=> (
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
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items:</Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping:</Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax:</Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total:</Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid ? (
                            <ListGroup.Item>
                                {loadingPay && <Loader />}
                                <PayPalScriptProvider options={initialOptions}>
                                    <ButtonWrapper  order={order} />
                                </PayPalScriptProvider>
                            </ListGroup.Item>
                        ) : (
                            <ListGroup.Item>
                               <Message variant='info'>Order Has Been Paid. </Message>
                            </ListGroup.Item>
                        ) }
                    </ListGroup>
                </Card>     
            
            </Col>
        </Row>
    </div>
  )
}

export default OrderScreen
