import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'

//import axios from 'axios'
import ProductCarousel from '../components/Carousel'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import Products from '../components/Products'
import { listProducts } from '../actions/productActions'
//import products from '../products.js'
function HomeScreen() {
  const location = useLocation()
  //const [products, setProducts] = useState([])
  const dispatch = useDispatch()
  const productList = useSelector(state => state.productList)
  const { loading, error, products, page, pages } = productList

  let keyword = location.search
  // ?keyword=dennis
  //console.log(keyword)
  useEffect(() => {
    // this calls the list action from productActions.js
    dispatch(listProducts(keyword))
    // before redux
    // const fetchProducts = async () => {
    //   // 'http"//127.0.0.1:8000/api/products/'
    //   const { data } = await axios.get('/api/products/')
    //   //const { data } = await axios.get('/api/products/')
    //   setProducts(data)
    // }
    // fetchProducts()
  }, [dispatch,keyword])
  return (
    <div>
      {!keyword && <ProductCarousel />}
      <h1>Latest Products</h1>
      { 
        // conditional rendering all the states of the product fetch
        loading ? <Loader /> 
          : error ? <Message variant='danger'>{error}</Message> 
          : 
          <>
            <Row>
              {products.map((product) => (
                  <>
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                      <Products product={product}/>
                  </Col>
                  </>
              ))}
            </Row>  
            <Row>
              <Paginate pages={pages} page={page} keyword={keyword} />
            </Row>
          </>
      }
    </div>
  )
}

export default HomeScreen
