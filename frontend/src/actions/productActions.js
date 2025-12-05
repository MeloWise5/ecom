import axios from 'axios'

import { 
    PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL,
    PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAIL,
    PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_SUCCESS, PRODUCT_CREATE_FAIL,
    PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS, PRODUCT_UPDATE_FAIL,
    PRODUCT_CREATE_REVIEW_REQUEST, PRODUCT_CREATE_REVIEW_SUCCESS, PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_TOP_REQUEST, PRODUCT_TOP_SUCCESS, PRODUCT_TOP_FAIL,
 } from '../constants/productConstants'

export const listProducts = (keyword = '') => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_LIST_REQUEST })
        // /api/products?keyword=dennis
        const { data } = await axios.get(`/api/products${keyword}`)
        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,    
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
export const listProductDetails = (id) => async (dispatch) => {
    //console.log('listttttt'+id)
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })
        const { data } = await axios.get(`/api/products/${id}`)
        
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,    
            payload: error.response && error.response.data.detail // django server sends detail key for errors
                ? error.response.data.detail
                : error.message,
        })
    }
}
export const createProduct = () => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_CREATE_REQUEST })
        const { 
            userLogin: { userInfo }
         } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.post(
            `/api/products/create/`,
            {},
            config
        )
        dispatch({ 
            type: PRODUCT_CREATE_SUCCESS,
            payload: data,
         })
        
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,    
            payload: error.response && error.response.data.detail // django server sends detail key for errors
                ? error.response.data.detail
                : error.message,
        })
    }
}
export const deleteProduct = (id) => async (dispatch, getState) => {
    //console.log('listttttt'+id)
    try {
        dispatch({ type: PRODUCT_DELETE_REQUEST })
        const { 
            userLogin: { userInfo }
         } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.delete(
                `/api/products/delete/${id}/`,
                config
            )
        
        dispatch({
            type: PRODUCT_DELETE_SUCCESS,
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,    
            payload: error.response && error.response.data.detail // django server sends detail key for errors
                ? error.response.data.detail
                : error.message,
        })
    }
}
export const updateProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_UPDATE_REQUEST })
        const { 
            userLogin: { userInfo }
         } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.put(
            `/api/products/update/${product._id}/`,
            product,
            config
        )
        dispatch({ 
            type: PRODUCT_UPDATE_SUCCESS,
        })
        // this below makes sure the updated data gets loaded right away in the form
        // otherwise you would have to reload the data
        // we could use a reset since now this product is saved in this state even when not on the page
        // reset does seem a lot cleaner. 
        // well fuck it. we have it like this. 
        dispatch({ 
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,    
            payload: error.response && error.response.data.detail // django server sends detail key for errors
                ? error.response.data.detail
                : error.message,
        })
    }
}
export const createReview = (reviewData,id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST })
        const { 
            userLogin: { userInfo }
         } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.post(
            `/api/products/${id}/reviews/`,
            reviewData,
            config
        )
        dispatch({ 
            type: PRODUCT_CREATE_REVIEW_SUCCESS
         })
        
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_FAIL,    
            payload: error.response && error.response.data.detail // django server sends detail key for errors
                ? error.response.data.detail
                : error.message,
        })
    }
}
export const topRatedProducts = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_TOP_REQUEST })
        const { data } = await axios.get(`/api/products/top5/`)
        dispatch({
            type: PRODUCT_TOP_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_TOP_FAIL,    
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}