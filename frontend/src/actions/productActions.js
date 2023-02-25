import axios from 'axios'
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

    PRODUCT_VARIATION_BY_SIZE_REQUEST,
    PRODUCT_VARIATION_BY_SIZE_SUCCESS,
    PRODUCT_VARIATION_BY_SIZE_FAIL,

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

export const listProducts = (keyword,category_id) => async (dispatch) => {
    try{
        dispatch({type:PRODUCT_LIST_REQUEST})
        const {data} = await axios.get(`http://localhost:8003/api/products/?keyword=${keyword===undefined?"":keyword}&category_id=${category_id===undefined?"0":category_id}`)
        dispatch({
            type:PRODUCT_LIST_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:PRODUCT_LIST_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}


export const listTopProducts = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_TOP_REQUEST })

        const { data } = await axios.get(`http://localhost:8003/api/products/top/`)

        dispatch({
            type: PRODUCT_TOP_SUCCESS,
            payload: data
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


export const listProductDetails = (id) =>async (dispatch) => {
    try{
        dispatch({type:PRODUCT_DETAILS_REQUEST})
        const {data} = await axios.get(`http://localhost:8003/api/products/${id}`)
        dispatch({
            type:PRODUCT_DETAILS_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:PRODUCT_DETAILS_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}

export const listDistinctProductDetails = (id) =>async (dispatch) => {
    try{
        dispatch({type:PRODUCT_DISTINCT_DETAILS_REQUEST})
        const {data} = await axios.get(`http://localhost:8003/api/products/${id}/distinct`)
        dispatch({
            type:PRODUCT_DISTINCT_DETAILS_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:PRODUCT_DISTINCT_DETAILS_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}

export const listProductSizesByColor = (obj) =>async (dispatch) => {
    try{
        dispatch({type:PRODUCT_SIZE_BY_COLOR_REQUEST})
        const {data} = await axios.get(`http://localhost:8003/api/products/size_by_color/`,{params: {
            color_id: obj.color_id,
            product_id: obj.product_id 
          }})
        dispatch({
            type:PRODUCT_SIZE_BY_COLOR_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:PRODUCT_SIZE_BY_COLOR_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}

export const listProductVariationBySize = (obj) =>async (dispatch) => {
    try{
        dispatch({type:PRODUCT_VARIATION_BY_SIZE_REQUEST})
        const {data} = await axios.get(`http://localhost:8003/api/products/variation_by_size/`,{params: {
            size_id: obj.size_id,
            color_id:obj.color_id,
            product_id: obj.product_id 
          }})
        dispatch({
            type:PRODUCT_VARIATION_BY_SIZE_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:PRODUCT_VARIATION_BY_SIZE_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}

export const listProductVariationDetails = (id) =>async (dispatch,getState) => {
    try{
        dispatch({type:PRODUCT_VARIATION_DETAILS_REQUEST})
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: userInfo.token
            }
        }
        const {data} = await axios.get(`http://localhost:8003/api/products/${id}/variations`,config)
        dispatch({
            type:PRODUCT_VARIATION_DETAILS_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:PRODUCT_VARIATION_DETAILS_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}

export const listProductVariationDetail = (id) =>async (dispatch,getState) => {
    try{
        dispatch({type:PRODUCT_VARIATION_DETAIL_REQUEST})
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: userInfo.token
            }
        }
        const {data} = await axios.get(`http://localhost:8003/api/products/${id}/variation`,config)
        dispatch({
            type:PRODUCT_VARIATION_DETAIL_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:PRODUCT_VARIATION_DETAIL_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}

export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_DELETE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: userInfo.token
            }
        }

        const { data } = await axios.delete(
            `http://localhost:8003/api/products/delete/${id}/`,
            config
        )

        dispatch({
            type: PRODUCT_DELETE_SUCCESS,
        })


    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
export const deleteProductVariation = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_VARIATION_DELETE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: userInfo.token
            }
        }

        const { data } = await axios.delete(
            `http://localhost:8003/api/products/delete/variation/${id}/`,
            config
        )

        dispatch({
            type: PRODUCT_VARIATION_DELETE_SUCCESS,
        })


    } catch (error) {
        dispatch({
            type: PRODUCT_VARIATION_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createProduct = (formData) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_CREATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: userInfo.token
            }
        }
        const { data } = await axios.post(
            `http://localhost:8003/api/products/create/`,
            formData,
            config
        )
        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: data,
        })


    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createProductVariation = (variation) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_VARIATION_CREATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: userInfo.token
            }
        }
        const { data } = await axios.post(
            `http://localhost:8003/api/products/${variation.product_id}/create_variation/`,
            variation,
            config
        )
        dispatch({
            type: PRODUCT_VARIATION_CREATE_SUCCESS,
            payload: data,
        })


    } catch (error) {
        dispatch({
            type: PRODUCT_VARIATION_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_UPDATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: userInfo.token
            }
        }

        const { data } = await axios.put(
            `http://localhost:8003/api/products/update/${product._id}/`,
            product,
            config
        )
        dispatch({
            type: PRODUCT_UPDATE_SUCCESS,
            payload: data,
        })


        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateProductVariation = (variation) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_VARIATION_UPDATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: userInfo.token
            }
        }

        const { data } = await axios.put(
            `http://localhost:8003/api/products/update/variation/${variation.product_variation_id}/`,
            variation,
            config
        )
        dispatch({
            type: PRODUCT_VARIATION_UPDATE_SUCCESS,
            payload: data,
        })


        // dispatch({
        //     type: PRODUCT_VARIATION_DETAILS_SUCCESS,
        //     payload: data
        // })


    } catch (error) {
        dispatch({
            type: PRODUCT_VARIATION_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createProductReview = (productId, review) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: userInfo.token
            }
        }

        const { data } = await axios.post(
            `http://localhost:8003/api/products/${productId}/reviews/`,
            review,
            config
        )
        dispatch({
            type: PRODUCT_CREATE_REVIEW_SUCCESS,
            payload: data,
        })



    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}