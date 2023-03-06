import React, { useState, useEffect,useForm } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link ,useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import {createOrder} from '../actions/orderActions'
import {ORDER_CREATE_RESET} from '../constants/orderConstants'
import {logout} from "../actions/userAction"
import jwt_decode from "jwt-decode";



function PlaceOrderScreen() {
    let history=useNavigate()
    const orderCreate = useSelector(state => state.orderCreate)
    const { order, error, success } = orderCreate
    const userLogin=useSelector(state => state.userLogin)
    // destructuring the response what we get from reducer 
    const {error:erroruserlogin,loading,userInfo} = userLogin

    const dispatch=useDispatch()
    // fetched the cart details
    const cart = useSelector(state => state.cart)
    // added extra values to cart
    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2)
    cart.taxPrice = Number((0.082) * cart.itemsPrice).toFixed(2)

    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

    if (!cart.paymentMethod) {
        history('/payment')
    }

    useEffect(() => {
        if(userInfo){
            var decodedHeader=jwt_decode(userInfo.token)
            if(decodedHeader.exp*1000 < Date.now()){
                dispatch(logout())
            }
            else{
                if (success) {
                    history(`/order/${order._id}`)
                    dispatch({ type: ORDER_CREATE_RESET })
                }
            }
        }
        else{
            history('/login')
        }
    }, [success, history,userInfo])

    const placeOrder = () =>{
        console.log("hi")
            
        switch (cart.paymentMethod) {
            case 'Cash On Delivery':
                dispatch(createOrder({
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                }))

                break;
            case 'RazorPay':
                        var options = {
                            "key": "YOUR_KEY_ID", // Enter the Key ID generated from the Dashboard
                            "amount": cart.totalPrice * 1000, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                            "currency": "INR",
                            "name": "OFFLINE 2 ONLINE", //your business name
                            "description": "ECOMMERCE",
                            "image": "https://example.com/your_logo",
                            "handler": function (response){
                                alert(response.razorpay_payment_id);
                               
                            },
                            "prefill": {
                                "name": userInfo.name, //your customer's name
                                "email": userInfo.email,
                            },
                            "theme": {
                                "color": "#3399cc"
                            }
                        };
                        var rzp = new window.Razorpay(options);
                        // rzp.on('payment.failed', function (response){
                        //     alert(response.error.code + "payment failed try again");
                        // });
                        rzp.open();
                        break;
                }
            }
   return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Shipping: </strong>
                            {cart.shippingAddress.address},  {cart.shippingAddress.city}
                            {'  '}
                            {cart.shippingAddress.postalCode},
                            {'  '}
                            {cart.shippingAddress.country}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {cart.cartItems.length === 0 ? <Message variant='info'>
                            Your cart is empty
                        </Message> : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col>
                                                    <Image src= {`http://localhost:8003/${item.image}`} alt={item.name} fluid rounded style={{width:"100px"}} />
                                                </Col>

                                                <Col >
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col>
                                                    {item.color}
                                                </Col>
                                                <Col>
                                                    {item.size}
                                                </Col>
                                                <Col>
                                                    {item.qty} X &#8377;{item.price} = &#8377;{(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                    </ListGroup.Item>

                </ListGroup>

            </Col>
            <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>&#8377;{cart.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>&#8377;{cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>&#8377;{cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>&#8377;{cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {error?(
                                <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroup.Item>
                            ):("")}            
                            

                            <ListGroup.Item className='text-center m-2'>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrder}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>
      </Row>
    </div>
  )
}

export default PlaceOrderScreen
