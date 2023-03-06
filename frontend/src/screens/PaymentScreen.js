import React, { useState, useEffect } from 'react'
import { useNavigate} from 'react-router-dom'

import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import {savePaymentMethod} from '../actions/cartActions'
import {logout} from "../actions/userAction"
import jwt_decode from "jwt-decode";

function PaymentScreen() {
    let history = useNavigate()
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState()
    
    useEffect(() => {
        if(userInfo){
            var decodedHeader=jwt_decode(userInfo.token)
            if(decodedHeader.exp*1000 < Date.now()){
                dispatch(logout())
            }
        }else{
            history('/login')
        }
    },[userInfo])
    
    if (!shippingAddress.address) {
        history('/shipping')
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history('/placeorder')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />

            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Payment Method</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            label='Cash On Delivery'
                            id='cod'
                            name='paymentMethod'
                            value="Cash On Delivery"
                            // checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                        </Form.Check>
                    </Col>
                    <Col>
                        <Form.Check
                            type='radio'
                            label='RazorPay'
                            id='rpay'
                            name='paymentMethod'
                            value="RazorPay"

                            // checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                        </Form.Check>
                    </Col>
                </Form.Group>

                

                <Button type='submit' className="m-3" variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
  
}

export default PaymentScreen
