import {
    COLOR_LIST_REQUEST,
    COLOR_LIST_SUCCESS,
    COLOR_LIST_FAIL,

    COLOR_DETAILS_REQUEST,
    COLOR_DETAILS_SUCCESS,
    COLOR_DETAILS_FAIL,

    COLOR_DELETE_REQUEST,
    COLOR_DELETE_SUCCESS,
    COLOR_DELETE_FAIL,

    COLOR_CREATE_REQUEST,
    COLOR_CREATE_SUCCESS,
    COLOR_CREATE_FAIL,
    COLOR_CREATE_RESET,

    COLOR_UPDATE_REQUEST,
    COLOR_UPDATE_SUCCESS,
    COLOR_UPDATE_FAIL,
    COLOR_UPDATE_RESET,
 
    


} from '../constants/colorConstants'
export const colorListReducer= (state={colors:[]},action)=>{
    switch(action.type){
        case COLOR_LIST_REQUEST:
            return {
                loading:true,
                colors:[]
            }
        case COLOR_LIST_SUCCESS:
            return {
                loading:false,
                colors:action.payload,

            }
        case COLOR_LIST_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        default:
            return state
    }
}
export const colorDetailsReducer= (state={color:{}},action)=>{
    switch(action.type){
        case COLOR_DETAILS_REQUEST:
            return {
                loading:true,
                ...state
            }
        case COLOR_DETAILS_SUCCESS:
            return {
                loading:false,
                color:action.payload
            }
        case COLOR_DETAILS_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        default:
            return state
    }
}

export const colorDeleteReducer= (state={},action)=>{
    switch(action.type){
        case COLOR_DELETE_REQUEST:
            return {
                loading:true,
               
            }
        case COLOR_DELETE_SUCCESS:
            return {
                loading:false,
                success:true
            }
        case COLOR_DELETE_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        default:
            return state
    }
}

export const colorCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case COLOR_CREATE_REQUEST:
            return { loading: true }

        case COLOR_CREATE_SUCCESS:
            return { loading: false, success: true, color: action.payload }

        case COLOR_CREATE_FAIL:
            return { loading: false, error: action.payload }

        case COLOR_CREATE_RESET:
            return {}

        default:
            return state
    }
}

export const colorUpdateReducer = (state = { color: {} }, action) => {
    switch (action.type) {
        case COLOR_UPDATE_REQUEST:
            return { loading: true }

        case COLOR_UPDATE_SUCCESS:
            return { loading: false, success: true, color: action.payload }

        case COLOR_UPDATE_FAIL:
            return { loading: false, error: action.payload }

        case COLOR_UPDATE_RESET:
            return { color: {} }

        default:
            return state
    }
}
