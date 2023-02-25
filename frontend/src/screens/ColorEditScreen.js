import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link ,useNavigate,useSearchParams,useParams} from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { listColorDetails, updateColor } from '../actions/colorActions'
import { COLOR_UPDATE_RESET } from '../constants/colorConstants'

function ColorEditScreen() {
    let history=useNavigate()
    const { productId } = useParams();
    const { id } = useParams();
    

    const [color_name, setColor] = useState('')
   

    const dispatch = useDispatch()

    const colorDetails = useSelector(state => state.colorDetails)
    const { error, loading, color } = colorDetails

    const colorUpdate = useSelector(state => state.colorUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = colorUpdate
   
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
       if (successUpdate) {
            dispatch({ type: COLOR_UPDATE_RESET })
            history('/admin/colorlist')
        } else {
            if (!color.color || color.id !== Number(id)) {
                dispatch(listColorDetails(id))
            } else {
                setColor(color.color)
                

            }
        }
    }, [dispatch,color, id, history,successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateColor({
            id: id,
            color:color_name,
        }))
    }

    
    return (
        <div>
            <Link to='/admin/colorlist' className='btn btn-light my-3'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Color</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={submitHandler}>

                        <Form.Group controlId='name'>
                            <Form.Label>Color Name</Form.Label>
                            <Form.Control

                                type='name'
                                placeholder='Enter name'
                                value={color_name}
                                onChange={(e) => setColor(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                        <br></br>
                        <Button type='submit' variant='primary'>
                            Update
                        </Button>

                    </Form>
                    )}

            </FormContainer >
        </div>

    )
}

export default ColorEditScreen;