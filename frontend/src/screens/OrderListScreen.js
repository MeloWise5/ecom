import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listOrders, deliveredOrder } from '../actions/orderActions'
import { ORDER_DELIVERED_RESET, ORDER_LIST_RESET } from '../constants/orderConstants'

function OrderListScreen() {
    const dispatch = useDispatch()
    const navigator = useNavigate()
    const userLogin = useSelector(state => state.userLogin )
    const { userInfo } = userLogin
    const orderList = useSelector(state => state.orderList )
    const { orders, error, loading } = orderList
    const orderDelivered = useSelector(state => state.orderDelivered )
    const { success:successDelivered, error:errorDelivered, loading:loadingDelivered } = orderDelivered
    
    useEffect(()=>{
        return ()=> {
            // helps with lingering errors
            dispatch({type: ORDER_DELIVERED_RESET})
            dispatch({type: ORDER_LIST_RESET})
        }
    },[dispatch])
    useEffect(()=>{
        if(userInfo && userInfo.isAdmin){
            dispatch(listOrders())
        }else{
            navigator('/login')
        }
    },[dispatch, navigator,userInfo,successDelivered])
    const orderDeliveredHandler = (id) => {
        dispatch(deliveredOrder(id))
    }
    const html_orders = () => {
            return orders.map(order => {
                const localDateTime = new Date(order.createdAt).toLocaleString();
                let paidDateTime = "Not Paid"
                if(order.paidAt){
                    paidDateTime = new Date(order.paidAt).toLocaleString();
                }
                let deliveredDateTime = "Not Delivered"
                if(order.deliveredAt){
                    deliveredDateTime = new Date(order.deliveredAt).toLocaleString();
                }
                return (
                    <tr key={order?._id || 'nan'}>
                        <td title={`Created At:\n${localDateTime}`}>{order?._id || 'nan'}</td>
                        <td>{order?.paymentMethod || 'nan'}</td>
                        <td>{order?.createdAt || 'nan'}</td>
                        <td title={`Tax: $${order.taxPrice}\nShipping: $${order?.shippingPrice}`}>{order?.totalPrice || 'nan'}</td>
                        <td>{order?.orderItems.length || '0'}</td>
                        <td title={`Date Paid:\n ${paidDateTime || 'Not Paid Yet'}`}>{order.isPaid ? 
                                (
                                    <i className='fas fa-check' style={{ color: 'green' }}></i>
                                ) : (
                                    <i className='fas fa-check' style={{ color: 'red' }}></i>
                                )}</td>
                            <td title={`Ship Date:\n ${deliveredDateTime || 'Has Not Shipped'}`}>
                                {order.isDelivered ?
                                (
                                    <>
                                        {deliveredDateTime}
                                    </>
                                ) : (
                                    <Button 
                                        variant={!order.isPaid ? 'danger' : 'success'} 
                                        disabled={!order.isPaid} 
                                        className='btn-sm rounded' 
                                        title="Confirm Delivered" 
                                        onClick={()=>{orderDeliveredHandler(order._id)}}>
                                        <i className='fas fa-truck' style={!order.isPaid ? ({ color: 'black' }) : ({ color: 'white' })}></i>
                                    </Button>
                                )}
                                </td>
                        <td>
                            <Button 
                                variant='info'  
                                className='btn-sm rounded' 
                                title="View Order Details" 
                                onClick={()=>{navigator(`/order/${order._id}`)}}>
                                <i className='fas fa-search' style={{ color: 'white' }}></i>
                            </Button>
                                
                        </td>
                    </tr>    
                )
            })
        }
    return (
        <div>
            <h1>Orders</h1>
            <Link to={'/'}>{'<<< Go Back'} </Link>
            <Table striped bordered hover responsive className="table-sm">
                <thead>
                    
                    <tr>
                    <th>ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>ITEM COUNT</th>
                    <th>PAID</th>
                    <th>DELIVERED <i className='fas fa-clock' style={{ color: 'green' }}></i></th>
                    <th></th>
                    </tr>
                    
                </thead>
                <tbody>
                    {successDelivered && (<tr><td colSpan={8}><Message variant='success'>Order Delivered</Message></td></tr>) }
                    {errorDelivered && (<tr><td colSpan={8}><Message variant='danger'>{errorDelivered}</Message></td></tr>) }
                    {error && (<tr><td colSpan={8}><Message variant='danger'>{error}</Message></td></tr>) }
                    {loading || loadingDelivered ? (<Loader />) : (html_orders())}
                </tbody>
            </Table>
        
        </div>
    )
}

export default OrderListScreen
