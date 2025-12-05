import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

function RegisterScreen() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    //his catches the redirect in the url
    const redirect = location.search ? location.search.split('=')[1] : '/'
    // grabbing the userLogin State from the store.js
    const userRegister = useSelector(state => state.userRegister)
    const {loading, error, userInfo} = userRegister

    useEffect(()=>{
        //if user is logged in, redirect them away from this page since there is no need to login again
        if(userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        //DISPATCH LOGIN
        if (password != confirmPassword){
            setMessage('Passwords do not match!')
        }else{
            dispatch(register(name,email,password))
        }

        
    }
  return (
    <FormContainer>
      <h1>Register</h1>
      {
        message && <Message variant='warning'>{message}</Message>
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
                required
                type='name' 
                placeholder='Enter name' 
                value={name} 
                onChange={(e) => setName(e.target.value)}
            ></Form.Control>
        </Form.Group>
        <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control 
                required
                type='email' 
                placeholder='Enter email' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control 
                required
                type='password' 
                placeholder='Enter password' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
        </Form.Group>
         <Form.Group controlId='passwordConfirm'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
                required
                type='password' 
                placeholder='Confirm password' 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-2'>
            Register
        </Button>

      </Form>
      <Row className='py-3'>
        <Col>
            Have an account? {' '}
            <Link to={redirect ? `/login/${redirect}` : '/login'}>
                Login
            </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
