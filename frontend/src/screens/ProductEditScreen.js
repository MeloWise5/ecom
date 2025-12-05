import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Form, Button, } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { updateProduct, listProductDetails } from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

function ProductEditScreen() {
    const [pid, setPid] = useState("")
    const [user, setUser] = useState("")
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0.00)
    const [image, setImage] = useState("")
    const [brand, setBrand] = useState("")
    const [countInStock, setCountInStock] = useState(0)
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [uploadingImage, setUploadingImage] = useState(false)
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()

    //his catches the redirect in the url
    const redirect = location.search ? location.search.split('=')[1] : '/'
    // grabbing the userLogin State from the store.js
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin
    const productDetails = useSelector(state => state.productDetails)
    const {loading:loadingProduct, error:errorProduct, product} = productDetails
    const productUpdate = useSelector(state => state.productUpdate)
    const {loading:loadingUpdate, error:errorUpdate, success:successUpdate} = productUpdate
    
    useEffect(()=>{
        // admin only
        if(!userInfo?.isAdmin){
            navigate('/login')
        }
        if(successUpdate){
            dispatch({type:PRODUCT_UPDATE_RESET})
            navigate('/admin/productList/')
        }else{
            const productId = Number(params.id)//all items from the url are strings
            if(product?.name && product._id === productId){
                setPid(product._id)
                setUser(product.user)
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }else {
                dispatch(listProductDetails(productId))
            }
        }
        
        
    }, [dispatch, navigate, userInfo,params,product,loadingProduct,successUpdate])

    const submitHandler = (e) => {
        e.preventDefault() 
        // when the variale names below are the same as the key in the object. 
        // its ok to pass just the variable.
        dispatch(updateProduct({
            _id:product._id,
            user,
            name,
            image,
            brand,
            category,
            countInStock,
            price,
            description
        }))
    }
    const uploadImageHandler = async (e) => {
        // grabbing the image uploaded
        const file = e.target.files[0]
        // grabbing all the other form data
        const formData = new FormData()
        // adding this image to the form data
        formData.append('image',file)
        // our api view in django also needs this attribute
        formData.append('product_id',params.id)
        // set the loading state of the image
        setUploadingImage(true)
        try{

            // making theaxios upload call
            const {data} = await axios.put(
                `/api/products/upload/`,
                formData
            )
            setImage(data)
            setUploadingImage(false)
        }
        catch(err){
            console.error('Upload failed:', err.response?.data || err.message);
            setUploadingImage(false)
        }
    }
    return (
        <div>
            <Link to={`/admin/productList`}> {`<<< Go Back to Product List`}</Link>
            
            <h1>Edit Product:</h1>
            {
                errorProduct ? (<Message variant='danger'>{errorProduct}</Message>) :
                loadingProduct ? (<Loader />) :
                loadingUpdate ? (<Loader /> ) :
                errorUpdate ? (<Message variant='danger'>{errorUpdate}</Message>) :
                (
                    <FormContainer>
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='user'>
                                <Form.Label>Creator</Form.Label>
                                <Form.Control 
                                    disabled
                                    type='user' 
                                    placeholder='Enter User' 
                                    value={user.email}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                    type='name' 
                                    placeholder='Enter Name' 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='price'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control 
                                    type='number' 
                                    placeholder='Enter Price' 
                                    value={price} 
                                    onChange={(e) => setPrice(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                             <Form.Group controlId='countInStock'>
                                <Form.Label>CountInStock</Form.Label>
                                <Form.Control 
                                    type='number' 
                                    placeholder='Enter CountInStock' 
                                    value={countInStock} 
                                    onChange={(e) => setCountInStock(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Enter Image' 
                                    value={image} 
                                    readOnly
                                ></Form.Control>
                                <Form.Control controlId='image-file'
                                    type='file' 
                                    label='Choose File'
                                    custom 
                                    onChange={(e) => {uploadImageHandler(e)}}
                                ></Form.Control>

                            </Form.Group>
                            <Form.Group controlId='brand'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Enter Brand' 
                                    value={brand} 
                                    onChange={(e) => setBrand(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='category'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Enter Category' 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='description'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control 
                                    type='description' 
                                    placeholder='Enter Description' 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)}
                                ></Form.Control>
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

export default ProductEditScreen
