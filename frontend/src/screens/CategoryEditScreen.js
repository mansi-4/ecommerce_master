import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link ,useNavigate,useSearchParams,useParams} from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { listCategoryDetails, updateCategory } from '../actions/categoryActions'
import { CATEGORY_UPDATE_RESET } from '../constants/categoryConstants'

function CategoryEditScreen() {
    let history=useNavigate()
    const { productId } = useParams();
    const { id } = useParams();
    

    const [category_name, setCategory] = useState('')
   

    const dispatch = useDispatch()

    const categoryDetails = useSelector(state => state.categoryDetails)
    const { error, loading, category } = categoryDetails

    const categoryUpdate = useSelector(state => state.categoryUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = categoryUpdate
   
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
       if (successUpdate) {
            dispatch({ type: CATEGORY_UPDATE_RESET })
            history('/admin/categorylist')
        } else {
            if (!category.category || category.id !== Number(id)) {
                dispatch(listCategoryDetails(id))
            } else {
                setCategory(category.category)
                

            }
        }
    }, [dispatch,category, id, history,successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateCategory({
            id: id,
            category:category_name,
        }))
    }

    
    return (
        <div>
            <Link to='/admin/categorylist'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Category</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={submitHandler}>

                        <Form.Group controlId='name'>
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control

                                type='name'
                                placeholder='Enter name'
                                value={category_name}
                                onChange={(e) => setCategory(e.target.value)}
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

export default CategoryEditScreen;