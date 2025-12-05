import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { listProducts,deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET,PRODUCT_DELETE_RESET } from '../constants/productConstants'

function UserListScreen() {
    const dispatch = useDispatch()
    const navigator = useNavigate()
    const location = useLocation()
    const userLogin = useSelector(state => state.userLogin )
    const { userInfo } = userLogin
    const productList = useSelector(state => state.productList )
    const { products, error, loading, page, pages } = productList
    const productDelete = useSelector(state => state.productDelete )
    const { error:errorDelete, loading:loadingDelete, success:successDelete } = productDelete
    const productCreate = useSelector(state => state.productCreate )
    const { error:errorCreate, loading:loadingCreate, success:successCreate, product:newProduct } = productCreate
    const keyword = location.search
    useEffect(()=>{
        // when you leave the page this clears the state.
       return () => {
            dispatch({type: PRODUCT_DELETE_RESET})
            dispatch({type: PRODUCT_CREATE_RESET})
        } 
    },[dispatch])
    useEffect(()=>{
        if(userInfo && userInfo.isAdmin){
            if(successCreate){
                navigator(`/admin/product/${newProduct._id}/edit`)
            }else{
                dispatch(listProducts(keyword))
            }
        }else{
            navigator('/login')
        }
    },[dispatch, navigator,userInfo,successDelete,successCreate,newProduct,keyword])
    // we add the successDelete so when it updates AKA item is removed or edited. 
    // this will auto trigger a refresh
    
    const deleteProductHandler = (id) => {
        if(window.confirm('Are you sure you want to delete this product?'))
        {
            dispatch(deleteProduct(id))
        }
    }
    return (
        <div>
            <h1>Products</h1>
            {successDelete && (<Message variant='success'>Successfully Removed</Message>)}
            {loadingDelete ? (<Loader /> ) :
            errorDelete ? (<Message variant='danger'>{errorDelete}</Message>) :
            loading || loadingDelete ? 
            (<Loader /> ) : 
            error || errorDelete ? 
            (<Message variant='danger'>{error}{errorDelete}</Message>) : 
            (
                <>
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>E-MAIL</th>
                        <th>ADMIN</th>
                        <th>
                            {errorCreate && (<Message variant='danger'>{errorDelete}</Message>) }
                            {loadingCreate ? (
                                <Loader />
                            ):(
                                <Button variant='dark' className='btn-sm' onClick={()=>{dispatch(createProduct())}}>
                                    <i className='fas fa-plus' style={{ color: 'yellow' }}></i> CREATE PRODUCT
                                </Button>)
                            }
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product?._id || 'nan'}>
                                <td>{product?._id || 'nan'}</td>
                                <td>{product?.name || 'nan'}</td>
                                <td>{product?.price || 'nan'}</td>
                                <td>{product.image ? 
                                        (
                                            <i className='fas fa-check' style={{ color: 'green' }}></i>
                                        ) : (
                                            <i className='fas fa-check' style={{ color: 'red' }}></i>
                                        )}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product?._id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit' style={{ color: 'blue' }}></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={()=>{deleteProductHandler(product?._id)}}>
                                        <i className='fas fa-trash' style={{ color: 'white' }}></i>
                                    </Button>
                                </td>
                            </tr>    
                        ))}
                    </tbody>
                </Table>
                <Paginate pages={pages} page={page} isAdmin={true} />
                </>
            )}
        
        </div>
    )
}

export default UserListScreen
