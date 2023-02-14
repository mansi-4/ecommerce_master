import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import {useNavigate } from 'react-router-dom'
import { Table, Button, Row,Col} from 'react-bootstrap' 

import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listCategories,deleteCategory,createCategory } from '../actions/categoryActions'
import {CATEGORY_CREATE_RESET} from "../constants/categoryConstants"
function CategoryListScreen() {
    let history=useNavigate()
    const dispatch = useDispatch()

    const categoryList = useSelector(state => state.categoryList)
    const { loading, error, categories } = categoryList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const categoryDelete = useSelector(state => state.categoryDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = categoryDelete

    const categoryCreate = useSelector(state => state.categoryCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, category: createdCategory } = categoryCreate


    useEffect(() => {
        dispatch({ type: CATEGORY_CREATE_RESET })
        if (!userInfo.isAdmin) {
            history('/login')
        }
        if (successCreate) { 
            history(`/admin/category/${createdCategory.id}/edit`)
        }else {
            dispatch(listCategories())
        }

    }, [dispatch, history, successDelete,successCreate,userInfo,createdCategory])


    const deleteHandler = (id) => {

        if (window.confirm('Are you sure you want to delete this category?')) {
            dispatch(deleteCategory(id))
        }
    }
    const createCategoryHandler = () => {
        // create product
        dispatch(createCategory())
    }
    return (
        <div>
           <Row className='align-items-center'>
                <Col md={10}>
                    <h1>Categories</h1>
                </Col>

                <Col md={2}>
                    <Button className='my-3' onClick={createCategoryHandler}>
                        <i className='fas fa-plus'></i> Create category
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>CATEGORY</th>
                                        
                                </tr>
                            </thead>

                            <tbody>
                                {categories.map(category => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>
                                        <td>{category.category}</td>
                                        
                                        

                                        <td>
                                            <LinkContainer to={`/admin/category/${category.id}/edit`}>
                                                <Button variant='light' className='btn-sm'>
                                                    <i className='fas fa-edit'></i>
                                                </Button>
                                            </LinkContainer>

                                            <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(category.id)}>
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
        </div>
    )
}

export default CategoryListScreen