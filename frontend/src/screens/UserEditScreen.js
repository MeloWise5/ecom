import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails, updateUser } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { USER_UPDATE_RESET } from '../constants/userConstants'

function UserEditScreen() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)
    const [message, setMessage] = useState("")
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()

    //his catches the redirect in the url
    const redirect = location.search ? location.search.split('=')[1] : '/'
    // grabbing the userLogin State from the store.js
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin
    const userDetails = useSelector(state => state.userDetails)
    const {loading, error, user} = userDetails
    const userUpdate = useSelector(state => state.userUpdate)
    const {loading:loadingUpdate, error:errorUpdate, success:successUpdate} = userUpdate
    
    useEffect(()=>{
        // admin only
        if(!userInfo?.isAdmin){
            navigate('/login')
        }
        if(successUpdate){
            dispatch({type:USER_UPDATE_RESET})
            navigate('/admin/userList/')
        }else{
            const userId = Number(params.id)//all items from the url are strings
            if(user?.name && user._id === userId){
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }else {
                dispatch(getUserDetails(userId))
            }
        }
        
        
    }, [dispatch, navigate, userInfo,params,user,loading,successUpdate])

    const submitHandler = (e) => {
        e.preventDefault() 
        // when the variale names below are the same as the key in the object. 
        // its ok to pass just the variable.
        dispatch(updateUser({
            _id:user._id,
            name,
            email,
            isAdmin
        }))
    }
    return (
        <div>
            <Link to={`/admin/userList`}> {`<<< Go Back`}</Link>
            
            <h1>Edit User:</h1>
            {
                error ? (<Message variant='danger'>{error}</Message>) :
                loading ? (<Loader />) :
                loadingUpdate ? (<Loader /> ) :
                errorUpdate ? (<Message variant='danger'>{errorUpdate}</Message>) :
                (
                    <FormContainer>
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
                            <Form.Group controlId='isadmin'>
                                <Form.Label>Password</Form.Label>
                                <Form.Check 
                                    type='checkbox' 
                                    label='Is Admin' 
                                    checked={isAdmin} 
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                ></Form.Check>
                            </Form.Group>
                            <Button type='submit' variant='primary' className='my-2'>
                                Update
                            </Button>
                        </Form>
                    </FormContainer>
                )
            }
        </div>
    )
}

export default UserEditScreen
