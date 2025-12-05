import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listUserProfile, deleteUser } from '../actions/userActions'
import { USER_DELETE_RESET } from '../constants/userConstants'

function UserListScreen() {
    const dispatch = useDispatch()
    const navigator = useNavigate()
    const userLogin = useSelector(state => state.userLogin )
    const { userInfo } = userLogin
    const userList = useSelector(state => state.userList )
    const { users, error, loading } = userList
    const userDelete = useSelector(state => state.userDelete )
    const { success:successDelete, error:errorDelete, loading:loadingDelete } = userDelete
    useEffect(() => {
        // Runs ONCE on mount
        return () => {
            // ← Runs ONLY on UNMOUNT (page reload, tab close, app unmount)
            dispatch({ type: USER_DELETE_RESET });// remove the messages or errors.
        };}, [dispatch]);
    useEffect(()=>{
        if(userInfo && userInfo.isAdmin){
            dispatch(listUserProfile())
        }else{
            navigator('/login')
        }
    },[dispatch, navigator,userInfo,successDelete])

    const deleteUserHandler = (id) => {
        if(window.confirm('Are you sure you want to remove this users.')){
            dispatch(deleteUser(id))
        }
    }
    
    return (
        <div>
            <h1>Users</h1>
            
             {loadingDelete && (<Loader /> )}
             {errorDelete && (<Message variant='danger'>{errorDelete}</Message>)}
             {successDelete && (<Message variant='success'>Successful Remove</Message>)}
            {loading 
            ? (<Loader /> )
            : error 
            ? (<Message variant='danger'>{error}</Message>) 
            : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>E-MAIL</th>
                        <th>ADMIN</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user?._id || 'nan'}>
                                <td>{user?._id || 'nan'}</td>
                                <td>{user?.name || 'nan'}</td>
                                <td>{user?.email || 'nan'}</td>
                                <td>{user.isAdmin ? 
                                        (
                                            <i className='fas fa-check' style={{ color: 'green' }}></i>
                                        ) : (
                                            <i className='fas fa-check' style={{ color: 'red' }}></i>
                                        )}</td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit' style={{ color: 'blue' }}></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={()=>{deleteUserHandler(user._id)}}>
                                        <i className='fas fa-trash' style={{ color: 'white' }}></i>
                                    </Button>
                                </td>
                            </tr>    
                        ))}
                    </tbody>
                </Table>
            )}
        
        </div>
    )
}

export default UserListScreen
