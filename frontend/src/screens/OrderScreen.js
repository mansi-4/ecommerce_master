import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card,Form } from 'react-bootstrap'
import { Link ,useNavigate,useParams} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from "../components/Loader"
import {getOrderDetails,payOrder,deliverOrder} from '../actions/orderActions'
import { ORDER_PAY_RESET,ORDER_DELIVER_RESET} from '../constants/orderConstants'
function OrderScreen() {
    const { id } = useParams();
    let history=useNavigate()
    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch=useDispatch();
    if(!loading && !error){
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }
    const [shipping_status,setShippingStatus]=useState("")
    useEffect(() => {
        if(!userInfo){
            history("/login")
        }
        else{
            if(!order || order._id!==Number(id) || successDeliver || successPay){
                dispatch({ type: ORDER_PAY_RESET }) 
                dispatch({ type: ORDER_DELIVER_RESET })
                dispatch(getOrderDetails(id))
            }
            else{
                setShippingStatus(order.shipping_status)
            }
        }
        
    }, [order,id,successDeliver,successPay])
    
    const deliverHandler = (e) => {
        setShippingStatus(e.target.value)
        const obj={
            "shipping_status":e.target.value
        }
        dispatch(deliverOrder(id,obj))
    }
    const payHandler = () => {
        dispatch(payOrder(id))
    }


  return loading ? (
            <Loader />
        ) : error ? (
            <Message variant='danger'>{error}</Message>
        ) : (
            <div>
                <h1>Order: {order._id}</h1>
            <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p><strong>Name: </strong> {order.user.name}</p>
                                <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                                <p>
                                    <strong>Shipping: </strong>
                                    {order.shippingAddress.address},  {order.shippingAddress.city}
                                    {'  '}
                                    {order.shippingAddress.postalCode},
                                    {'  '}
                                    {order.shippingAddress.country}
                                </p>
                                {order.isDelivered ? (
                                        <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                                    ) : order.shipping_status === "Not Delivered" ?(
                                            <Message variant='danger'>{order.shipping_status}</Message>
                                        ): (
                                            <Message variant='info'>{order.shipping_status}</Message>
                                        )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                        <Message variant='success'>Paid on {order.paidAt}</Message>
                                    ) : (
                                            <Message variant='warning'>Not Paid</Message>
                                        )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {order.orderItems.length === 0 ? <Message variant='info'>
                                    Order is empty
                                </Message> : (
                                        <ListGroup variant='flush'>
                                            {order.orderItems.map((item, index) => (
                                                <ListGroup.Item key={index}>
                                                    <Row> 
                                                        <Col md={1}>
                                                            <Image src={`http://localhost:8003/${item.image}`} alt={item.name} fluid rounded />
                                                        </Col>

                                                        <Col>
                                                            <Link to={`/product/${item.product_id}`}>{item.name}</Link>
                                                        </Col>

                                                        <Col>
                                                            {item.color}
                                                        </Col>

                                                        <Col>
                                                            {item.size}
                                                        </Col>

                                                        <Col md={4}>
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
                                            <Col>&#8377;{order.itemsPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Shipping:</Col>
                                            <Col>&#8377;{order.shippingPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax:</Col>
                                            <Col>&#8377;{order.taxPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Total:</Col>
                                            <Col>&#8377;{order.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>


                                </ListGroup>
                                
                                {/* paid buttons will come here */}
                                {loadingPay && <Loader />}
                                {userInfo && userInfo.isAdmin && !order.isPaid && (
                                    <ListGroup.Item className="text-center">
                                        <Button
                                            type='button'
                                            className='btn btn-block m-3'
                                            onClick={payHandler}
                                        >
                                            Mark as Paid
                                        </Button>
                                    </ListGroup.Item>
                                )}
                                {/* deliver buttons will come here */}
                                {loadingDeliver && <Loader />}
                                {userInfo && userInfo.isAdmin && !order.isDelivered && (
                                    <ListGroup.Item className="text-center">
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverHandler}
                                        >
                                            Mark As Delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </Card>
                            <br></br>
                            {userInfo && userInfo.isAdmin && !order.isDelivered && (<Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h2>Shipping Status</h2>
                                    </ListGroup.Item>

                                    <ListGroup.Item className='m-3'>
                                    <Form.Group>
                                       
                                        <Form.Select name="shipping_status" value={shipping_status} onChange={(e)=>deliverHandler(e)}>
                                            <option selected disabled>Select Shipping Status</option>
                                            <option value="In-Progress">In-Progress</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                            <option value="Not Delivered">Not Delivered</option>
                                            <option value="Delivered">Delivered</option>
                                        </Form.Select>
                                    </Form.Group>
                                        
                                    </ListGroup.Item>

                                    

                                </ListGroup>
                                
                                
                            </Card>)}
                            
                    </Col>
            </Row>
            </div>
        )
  
}

export default OrderScreen;
