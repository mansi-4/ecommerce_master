import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,

    PRODUCT_DISTINCT_DETAILS_REQUEST,
    PRODUCT_DISTINCT_DETAILS_SUCCESS,
    PRODUCT_DISTINCT_DETAILS_FAIL,

    PRODUCT_SIZE_BY_COLOR_REQUEST,
    PRODUCT_SIZE_BY_COLOR_SUCCESS,
    PRODUCT_SIZE_BY_COLOR_FAIL,
    PRODUCT_SIZE_BY_COLOR_RESET,

    PRODUCT_VARIATION_BY_SIZE_REQUEST,
    PRODUCT_VARIATION_BY_SIZE_SUCCESS,
    PRODUCT_VARIATION_BY_SIZE_FAIL,
    PRODUCT_VARIATION_BY_SIZE_RESET,

    PRODUCT_VARIATION_DETAILS_REQUEST,
    PRODUCT_VARIATION_DETAILS_SUCCESS,
    PRODUCT_VARIATION_DETAILS_FAIL,

    PRODUCT_VARIATION_DETAIL_REQUEST,
    PRODUCT_VARIATION_DETAIL_SUCCESS,
    PRODUCT_VARIATION_DETAIL_FAIL,
    PRODUCT_VARIATION_DETAIL_RESET,

    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,

    PRODUCT_VARIATION_DELETE_REQUEST,
    PRODUCT_VARIATION_DELETE_SUCCESS,
    PRODUCT_VARIATION_DELETE_FAIL,

    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_CREATE_RESET,

    PRODUCT_VARIATION_CREATE_REQUEST,
    PRODUCT_VARIATION_CREATE_SUCCESS,
    PRODUCT_VARIATION_CREATE_FAIL,
    PRODUCT_VARIATION_CREATE_RESET,

    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_UPDATE_RESET,

    PRODUCT_VARIATION_UPDATE_REQUEST,
    PRODUCT_VARIATION_UPDATE_SUCCESS,
    PRODUCT_VARIATION_UPDATE_FAIL,
    PRODUCT_VARIATION_UPDATE_RESET,

    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_CREATE_REVIEW_RESET,

    PRODUCT_TOP_REQUEST,
    PRODUCT_TOP_SUCCESS,
    PRODUCT_TOP_FAIL,


} from '../constants/productConstants'
export const productListReducer= (state={products:[]},action)=>{
    switch(action.type){
        case PRODUCT_LIST_REQUEST:
            return {
                loading:true,
                products:[]
            }
        case PRODUCT_LIST_SUCCESS:
            return {
                loading:false,
                products:action.payload,

            }
        case PRODUCT_LIST_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        default:
            return state
    }
}
export const productDetailsReducer= (state={product:{reviews:[]}},action)=>{
    switch(action.type){
        case PRODUCT_DETAILS_REQUEST:
            return {
                loading:true,
                ...state
            }
        case PRODUCT_DETAILS_SUCCESS:
            return {
                loading:false,
                product:action.payload
            }
        case PRODUCT_DETAILS_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        default:
            return state
    }
}
export const productDistinctDetailsReducer= (state={product:{reviews:[]}},action)=>{
    switch(action.type){
        case PRODUCT_DISTINCT_DETAILS_REQUEST:
            return {
                loading:true,
                ...state
            }
        case PRODUCT_DISTINCT_DETAILS_SUCCESS:
            return {
                loading:false,
                product:action.payload
            }
        case PRODUCT_DISTINCT_DETAILS_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        default:
            return state
    }
}

export const productSizesByColorReducer= (state={sizes:[]},action)=>{
    switch(action.type){
        case PRODUCT_SIZE_BY_COLOR_REQUEST:
            return {
                loading:true,
                ...state
            }
        case PRODUCT_SIZE_BY_COLOR_SUCCESS:
            return {
                loading:false,
                sizes:action.payload
            }
        case PRODUCT_SIZE_BY_COLOR_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        case PRODUCT_SIZE_BY_COLOR_RESET:
            return {
                sizes:[]
            }
        default:
            return state
    }
}

export const productVariationBySizeReducer= (state={variation:{}},action)=>{
    switch(action.type){
        case PRODUCT_VARIATION_BY_SIZE_REQUEST:
            return {
                loading:true,
                ...state
            }
        case PRODUCT_VARIATION_BY_SIZE_SUCCESS:
            return {
                loading:false,
                variation:action.payload
            }
        case PRODUCT_VARIATION_BY_SIZE_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        case PRODUCT_VARIATION_BY_SIZE_RESET:
            return {
                variation:{}
            }
        default:
            return state
    }
}

export const productVariationDetailsReducer= (state={variations:[]},action)=>{
    switch(action.type){
        case PRODUCT_VARIATION_DETAILS_REQUEST:
            return {
                loading:true,
                ...state
            }
        case PRODUCT_VARIATION_DETAILS_SUCCESS:
            return {
                loading:false,
                variations:action.payload
            }
        case PRODUCT_VARIATION_DETAILS_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        default:
            return state
    }
}

export const productVariationDetailReducer= (state={variation:{}},action)=>{
    switch(action.type){
        case PRODUCT_VARIATION_DETAIL_REQUEST:
            return {
                loading:true,
                ...state
            }
        case PRODUCT_VARIATION_DETAIL_SUCCESS:
            return {
                loading:false,
                variation:action.payload
            }
        case PRODUCT_VARIATION_DETAIL_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        case PRODUCT_VARIATION_DETAIL_RESET:
            return {
                variation:{}
            }
        default:
            return state
    }
}

export const productDeleteReducer= (state={},action)=>{
    switch(action.type){
        case PRODUCT_DELETE_REQUEST:
            return {
                loading:true,
               
            }
        case PRODUCT_DELETE_SUCCESS:
            return {
                loading:false,
                success:true
            }
        case PRODUCT_DELETE_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        default:
            return state
    }
}

export const productVariationDeleteReducer= (state={},action)=>{
    switch(action.type){
        case PRODUCT_VARIATION_DELETE_REQUEST:
            return {
                loading:true,
               
            }
        case PRODUCT_VARIATION_DELETE_SUCCESS:
            return {
                loading:false,
                success:true
            }
        case PRODUCT_VARIATION_DELETE_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        default:
            return state
    }
}

export const productCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_CREATE_REQUEST:
            return { loading: true }

        case PRODUCT_CREATE_SUCCESS:
            return { loading: false, success: true, product: action.payload }

        case PRODUCT_CREATE_FAIL:
            return { loading: false, error: action.payload }

        case PRODUCT_CREATE_RESET:
            return {}

        default:
            return state
    }
}

export const productVariationCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_VARIATION_CREATE_REQUEST:
            return { loading: true }

        case PRODUCT_VARIATION_CREATE_SUCCESS:
            return { loading: false, success: true, variation: action.payload }

        case PRODUCT_VARIATION_CREATE_FAIL:
            return { loading: false, error: action.payload }

        case PRODUCT_VARIATION_CREATE_RESET:
            return {}

        default:
            return state
    }
}

export const productUpdateReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case PRODUCT_UPDATE_REQUEST:
            return { loading: true }

        case PRODUCT_UPDATE_SUCCESS:
            return { loading: false, success: true, product: action.payload }

        case PRODUCT_UPDATE_FAIL:
            return { loading: false, error: action.payload }

        case PRODUCT_UPDATE_RESET:
            return { product: {} }

        default:
            return state
    }
}

export const productVariationUpdateReducer = (state = { variation: {} }, action) => {
    switch (action.type) {
        case PRODUCT_VARIATION_UPDATE_REQUEST:
            return { loading: true }

        case PRODUCT_VARIATION_UPDATE_SUCCESS:
            return { loading: false, success: true, variation: action.payload }

        case PRODUCT_VARIATION_UPDATE_FAIL:
            return { loading: false, error: action.payload }

        case PRODUCT_VARIATION_UPDATE_RESET:
            return { variation: {} }

        default:
            return state
    }
}
export const productReviewCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_CREATE_REVIEW_REQUEST:
            return { loading: true }

        case PRODUCT_CREATE_REVIEW_SUCCESS:
            return { loading: false, success: true}

        case PRODUCT_CREATE_REVIEW_FAIL:
            return { loading: false, error: action.payload }

        case PRODUCT_CREATE_REVIEW_RESET:
            return {}

        default:
            return state
    }
}

export const productTopRatedReducer = (state = { products: [] }, action) => {
    switch (action.type) {
        case PRODUCT_TOP_REQUEST:
            return { loading: true, products: [] }

        case PRODUCT_TOP_SUCCESS:
            return { loading: false, products: action.payload, }

        case PRODUCT_TOP_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}