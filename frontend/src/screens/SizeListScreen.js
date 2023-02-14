import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import {useNavigate } from 'react-router-dom'
import { Table, Button, Row,Col} from 'react-bootstrap' 

import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listSizes,deleteSize,createSize } from '../actions/sizeActions'
import {SIZE_CREATE_RESET} from "../constants/sizeConstants"

function SizeListScreen() {
    let history=useNavigate()
    const dispatch = useDispatch()

    const sizeList = useSelector(state => state.sizeList)
    const { loading, error, sizes } = sizeList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const sizeDelete = useSelector(state => state.sizeDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = sizeDelete

    const sizeCreate = useSelector(state => state.sizeCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, size: createdSize } = sizeCreate


    useEffect(() => {
        dispatch({ type: SIZE_CREATE_RESET })
        if (!userInfo.isAdmin) {
            history('/login')
        }
        if (successCreate) { 
            history(`/admin/size/${createdSize.id}/edit`)
        }else {
            dispatch(listSizes())
        }

    }, [dispatch, history, successDelete,successCreate,userInfo,createdSize])


    const deleteHandler = (id) => {

        if (window.confirm('Are you sure you want to delete this size?')) {
            dispatch(deleteSize(id))
        }
    }
    const createSizeHandler = () => {
        // create product
        dispatch(createSize())
    }
    return (
        <div>
           <Row className='align-items-center'>
                <Col md={10}>
                    <h1>Sizes</h1>
                </Col>

                <Col md={2}>
                    <Button className='my-3' onClick={createSizeHandler}>
                        <i className='fas fa-plus'></i> Create Size
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
                                    <th>SIZE</th>
                                        
                                </tr>
                            </thead>

                            <tbody>
                                {sizes.map(size => (
                                    <tr key={size.id}>
                                        <td>{size.id}</td>
                                        <td>{size.size}</td>
                                        
                                        

                                        <td>
                                            <LinkContainer to={`/admin/size/${size.id}/edit`}>
                                                <Button variant='light' className='btn-sm'>
                                                    <i className='fas fa-edit'></i>
                                                </Button>
                                            </LinkContainer>

                                            <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(size.id)}>
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

export default SizeListScreen