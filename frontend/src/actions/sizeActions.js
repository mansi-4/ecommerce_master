import axios from 'axios'
import {
    SIZE_LIST_REQUEST, 
    SIZE_LIST_SUCCESS,
    SIZE_LIST_FAIL,

    SIZE_DETAILS_REQUEST,
    SIZE_DETAILS_SUCCESS,
    SIZE_DETAILS_FAIL,

    SIZE_DELETE_REQUEST,
    SIZE_DELETE_SUCCESS,
    SIZE_DELETE_FAIL,

    SIZE_CREATE_REQUEST,
    SIZE_CREATE_SUCCESS,
    SIZE_CREATE_FAIL,
    SIZE_CREATE_RESET,

    SIZE_UPDATE_REQUEST,
    SIZE_UPDATE_SUCCESS,
    SIZE_UPDATE_FAIL,
    SIZE_UPDATE_RESET,

    
} from '../constants/sizeConstants'
export const listSizes = () => async (dispatch) => {
    try{
        dispatch({type:SIZE_LIST_REQUEST})
        const {data} = await axios.get(`http://localhost:8003/api/sizes/`)
        dispatch({
            type:SIZE_LIST_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:SIZE_LIST_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}


export const listSizeDetails = (id) =>async (dispatch) => {
    try{
        dispatch({type:SIZE_DETAILS_REQUEST})
        const {data} = await axios.get(`http://localhost:8003/api/sizes/${id}`)
        dispatch({
            type:SIZE_DETAILS_SUCCESS,
            payload:data
        })
    }catch(error){ 
        dispatch({
            type:SIZE_DETAILS_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
        })
    }
}


export const deleteSize = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: SIZE_DELETE_REQUEST
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
            `http://localhost:8003/api/sizes/delete/${id}/`,
            config
        )

        dispatch({
            type: SIZE_DELETE_SUCCESS,
        })


    } catch (error) {
        dispatch({
            type: SIZE_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const createSize = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: SIZE_CREATE_REQUEST
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
            `http://localhost:8003/api/sizes/create/`,
            {},
            config
        )
        dispatch({
            type: SIZE_CREATE_SUCCESS,
            payload: data,
        })


    } catch (error) {
        dispatch({
            type: SIZE_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateSize = (size) => async (dispatch, getState) => {
    try {
        dispatch({
            type: SIZE_UPDATE_REQUEST
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
            `http://localhost:8003/api/sizes/update/${size.id}/`,
            size,
            config
        )
        dispatch({
            type: SIZE_UPDATE_SUCCESS,
            payload: data,
        })


        dispatch({
            type: SIZE_DETAILS_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: SIZE_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}