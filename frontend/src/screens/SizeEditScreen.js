import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link ,useNavigate,useSearchParams,useParams} from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { listSizeDetails, updateSize } from '../actions/sizeActions'
import { SIZE_UPDATE_RESET } from '../constants/sizeConstants'

function SizeEditScreen() {
    let history=useNavigate()
    const { productId } = useParams();
    const { id } = useParams();
    

    const [size_name, setSize] = useState('')
   

    const dispatch = useDispatch()

    const sizeDetails = useSelector(state => state.sizeDetails)
    const { error, loading, size } = sizeDetails

    const sizeUpdate = useSelector(state => state.sizeUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = sizeUpdate
   
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
       if (successUpdate) {
            dispatch({ type: SIZE_UPDATE_RESET })
            history('/admin/sizelist')
        } else {
            if (!size.size || size.id !== Number(id)) {
                dispatch(listSizeDetails(id))
            } else {
                setSize(size.size)
                

            }
        }
    }, [dispatch,size, id, history,successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateSize({
            id: id,
            size:size_name,
        }))
    }

    
    return (
        <div>
            <Link to='/admin/sizelist'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Size</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={submitHandler}>

                        <Form.Group controlId='name'>
                            <Form.Label>Size Name</Form.Label>
                            <Form.Control

                                type='name'
                                placeholder='Enter name'
                                value={size_name}
                                onChange={(e) => setSize(e.target.value)}
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

export default SizeEditScreen;