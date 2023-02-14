import {legacy_createStore as createStore ,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {productListReducer,productTopRatedReducer,productDetailsReducer,productDeleteReducer,productCreateReducer,productUpdateReducer,productReviewCreateReducer} from './reducers/productReducers'
import {cartReducer} from './reducers/cartReducers'
import {userLoginReducer,userRegisterReducer,userDetailsReducer,userUpdateProfileReducer,userListReducer,userDeleteReducer,userUpdateReducer} from './reducers/userReducers'
import {colorListReducer,colorDetailsReducer,colorCreateReducer,colorDeleteReducer,colorUpdateReducer} from "./reducers/colorReducers"
import {sizeListReducer,sizeDetailsReducer,sizeCreateReducer,sizeDeleteReducer,sizeUpdateReducer} from "./reducers/sizeReducers"
import {categoryListReducer,categoryDetailsReducer,categoryCreateReducer,categoryDeleteReducer,categoryUpdateReducer} from "./reducers/categoryReducers"
import {orderCreateReducer,orderDetailsReducer,orderPayReducer,orderListMyReducer,orderListReducer,orderDeliverReducer} from './reducers/orderReducers'
const reducer=combineReducers({
    productList:productListReducer,
    productTopRated:productTopRatedReducer,
    productDetails:productDetailsReducer,
    productDelete:productDeleteReducer,
    productCreate:productCreateReducer,
    productUpdate:productUpdateReducer,
    productReviewCreate:productReviewCreateReducer,

    cart:cartReducer,
    
    userLogin:userLoginReducer,
    userRegister:userRegisterReducer,
    userDetails:userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList:userListReducer,
    userDelete:userDeleteReducer,
    userUpdate:userUpdateReducer,

    colorList:colorListReducer,
    colorCreate:colorCreateReducer,
    colorDelete:colorDeleteReducer,
    colorUpdate:colorUpdateReducer,
    colorDetails:colorDetailsReducer,

    sizeList:sizeListReducer,
    sizeCreate:sizeCreateReducer,
    sizeDelete:sizeDeleteReducer,
    sizeUpdate:sizeUpdateReducer,
    sizeDetails:sizeDetailsReducer,

    categoryList:categoryListReducer,
    categoryCreate:categoryCreateReducer,
    categoryDelete:categoryDeleteReducer,
    categoryUpdate:categoryUpdateReducer,
    categoryDetails:categoryDetailsReducer,

    orderCreate:orderCreateReducer,
    orderDetails:orderDetailsReducer,
    orderPay:orderPayReducer,
    orderListMy:orderListMyReducer,
    orderList:orderListReducer,
    orderDeliver:orderDeliverReducer,
})

const cartItemsFromStorage=localStorage.getItem("cartItems") ?
        JSON.parse(localStorage.getItem("cartItems")) : []

const userInfoFromStorage=localStorage.getItem("userInfo") ?
    JSON.parse(localStorage.getItem("userInfo")) : null

const shippingAddressFromStorage=localStorage.getItem("shippingAddress") ?
    JSON.parse(localStorage.getItem("shippingAddress")) : {}

const initialState={
    cart:{
        cartItems:cartItemsFromStorage,
        shippingAddress:shippingAddressFromStorage
    },
    userLogin:{userInfo:userInfoFromStorage}
    

}
const middleware=[thunk]
const store=createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))

export default store;