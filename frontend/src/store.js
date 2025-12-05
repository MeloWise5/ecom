import { createStore, combineReducers, applyMiddleware} from 'redux'
import { thunk }  from 'redux-thunk'
import { cartReducer } from './reducers/cartReducers'
import { 
    productListReducer,productDetailsReducer,
    productDeleteReducer, productCreateReducer, 
    productUpdateReducer, productCreateReviewReducer,productTopRatedReducer } from './reducers/productReducers'
import { 
    userLoginReducer,    userRegisterReducer,
    userDetailsReducer,     userUpdateProfileReducer,
    userListReducer,     userDeleteReducer,
    userUpdateReducer  } from './reducers/userReducers'
import { 
    orderCreateReducer, orderDetailsReducer, 
    orderPayReducer, orderListMyReducer, 
    orderListReducer, orderDeliveredReducer } from './reducers/orderReducers'

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productCreate: productCreateReducer,
    productDelete:productDeleteReducer,
    productUpdate: productUpdateReducer,
    productCreateReview: productCreateReviewReducer,
    productTopRated: productTopRatedReducer,
    
    cart: cartReducer,

    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userUpdate: userUpdateReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,

    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
    orderDelivered: orderDeliveredReducer,

})

// local storage logic
// this is to persist cart items in local storage
// it pulls from the users browser local storage
// if nothing there it sets to empty array
const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []
const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}
const paymentMethodFromStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}
const initialState = {
    cart: { 
        cartItems: cartItemsFromStorage, 
        shippingAddress:shippingAddressFromStorage,
        paymentMethod:paymentMethodFromStorage,
    },
    userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(reducer, initialState, applyMiddleware(...middleware))

export default store