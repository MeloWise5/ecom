import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { listMyOrders } from '../actions/orderActions'
function ProfileScreen() {
    const [userProfileDetails, setUserProfileDetails] = useState("")
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")

    //his catches the redirect in the url
    const redirect = '/login'
    // grabbing the userLogin State from the store.js
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin
    const userDetails = useSelector(state => state.userDetails)
    const {error, loading, user} = userDetails
    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const {success} = userUpdateProfile
    const orderListMy = useSelector(state => state.orderListMy)
    const {orders, error:ordersMyListError, loading:ordersMyListLoading} = orderListMy

    useEffect(()=>{
        //if user is logged in, redirect them away from this page since there is no need to login again
        if(!userInfo) {
            navigate(redirect)
        }else{
            // the userInfo._id !== user._id is from the ability to move pages as an admin
            // you can be on the edit user screen then click profile. and the state has already been
            // set from the previous admin page. Here you should only see your (the person logged in) profile. 
            // so that is why we check for the user._id matching
            if(!user?.name || success || userInfo._id !== user._id){
                dispatch({type:USER_UPDATE_PROFILE_RESET})
                dispatch(getUserDetails('profile'))// this updates the user state
                dispatch(listMyOrders())// this loads the users orders.
            }else{
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch,navigate,userInfo, user,success])

    const submitHandler = (e) => {
        e.preventDefault()
        //DISPATCH LOGIN
        if (password !== confirmPassword){
            setMessage('Passwords do not match!')
        }else{
            dispatch(updateUserProfile({
                'id': user._id,
                'id': user._id,
                'name': name,
                'email': email,
                'password':password,
            }))
        }
    }
    const html_orders = () => {
        return orders.map(order => {
            const localDateTime = new Date(order.createdAt).toLocaleString();
            const paidDateTime = new Date(order.paidAt).toLocaleString();
            const deliveredDateTime = new Date(order.deliveredAt).toLocaleString();
            return (
                <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{localDateTime}</td>
                    <td>${order.totalPrice}</td>
                    <td>{order.isPaid ? <><i className="fas fa-dollar" style={{ color: 'green'}} />{paidDateTime}</> : <i className="fas fa-times" style={{ color: 'red'}} />}</td>
                    <td>{
                        order.isDelivered ? (
                            <><i className="fas fa-truck" style={{ color: 'blue'}} />  {deliveredDateTime} </>
                            ) : (
                                <LinkContainer to={`/order/${order._id}`}>
                                    <Button className="btn-sm">Details</Button>
                                </LinkContainer>
                            )
                        }
                    </td>
                    <td></td>
                </tr>
            )
        })
    }
    return (
        <Row>
            <Col md='3'>
                <h2>User Profile</h2>
                {
                    success && <Message variant='warning'>{success}</Message>
                }
                {
                    error && <Message variant='danger'>{error}</Message>
                }
                {
                    loading && <Loader />
                }
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            
                            type='name' 
                            placeholder='Enter name' 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control 
                            
                            type='email' 
                            placeholder='Enter email' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            
                            type='password' 
                            placeholder='Enter password' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='passwordConfirm'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control 
                            
                            type='password' 
                            placeholder='Confirm password' 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button type='submit' variant='primary' className='my-2'>
                        Update Profile
                    </Button>
                </Form>
            </Col>
            <Col md='9'>
                <h2>My Orders</h2>
                {ordersMyListLoading ? (<Loader />
                ): ordersMyListError ? (
                    <Message variant='danger'>{ordersMyListError}</Message>
                ) : (
                    <Table>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th></th>
                        </tr>
                        <tbody>
                            {
                                html_orders()
                            }
                            
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    )
}

export default ProfileScreen
