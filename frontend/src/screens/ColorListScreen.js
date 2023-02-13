import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import {useNavigate } from 'react-router-dom'
import { Table, Button, Row,Col} from 'react-bootstrap' 

import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listColors,deleteColor,createColor } from '../actions/colorActions'
import {COLOR_CREATE_RESET} from "../constants/colorConstants"
function UserListScreen() {
    let history=useNavigate()
    const dispatch = useDispatch()

    const colorList = useSelector(state => state.colorList)
    const { loading, error, colors } = colorList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const colorDelete = useSelector(state => state.colorDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = colorDelete

    const colorCreate = useSelector(state => state.colorCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, color: createdColor } = colorCreate


    useEffect(() => {
        dispatch({ type: COLOR_CREATE_RESET })
        if (!userInfo.isAdmin) {
            history('/login')
        }
        if (successCreate) { 
            history(`/admin/color/${createdColor.id}/edit`)
        }else {
            dispatch(listColors())
        }

    }, [dispatch, history, successDelete,successCreate,userInfo,createdColor])


    const deleteHandler = (id) => {

        if (window.confirm('Are you sure you want to delete this color?')) {
            dispatch(deleteColor(id))
        }
    }
    const createColorHandler = () => {
        // create product
        dispatch(createColor())
    }
    return (
        <div>
           <Row className='align-items-center'>
                <Col md={10}>
                    <h1>Colors</h1>
                </Col>

                <Col md={2}>
                    <Button className='my-3' onClick={createColorHandler}>
                        <i className='fas fa-plus'></i> Create Color
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
                                    <th>COLOR</th>
                                        
                                </tr>
                            </thead>

                            <tbody>
                                {colors.map(color => (
                                    <tr key={color.id}>
                                        <td>{color.id}</td>
                                        <td>{color.color}</td>
                                        
                                        

                                        <td>
                                            <LinkContainer to={`/admin/color/${color.id}/edit`}>
                                                <Button variant='light' className='btn-sm'>
                                                    <i className='fas fa-edit'></i>
                                                </Button>
                                            </LinkContainer>

                                            <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(color.id)}>
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

export default UserListScreen