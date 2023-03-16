import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card,Form, Collapse } from 'react-bootstrap'
import { Link ,useNavigate,useParams} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from "../components/Loader"
import {getOrderDetails,payOrder,deliverOrder} from '../actions/orderActions'
import { ORDER_PAY_RESET,ORDER_DELIVER_RESET} from '../constants/orderConstants'
import {logout} from "../actions/userAction"
import jwt_decode from "jwt-decode";
import axios from 'axios'
import jsPDF from "jspdf"

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

    const [invoiceLoading,setinvoiceLoading]=useState(false)
    const [createdAt,setCreatedAt]=useState("")
    const dispatch=useDispatch();
    if(!loading && !error){
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
        // typeof(order.createdAt)
        // const date=order.createdAt.toISOString().split( "T" )
        // setCreatedAt(date[0])
    }

    const [shipping_status,setShippingStatus]=useState("")
    useEffect(() => {
        if (userInfo) {
            // to check if token is expired or not 
            var decodedHeader=jwt_decode(userInfo.token)
            if(decodedHeader.exp*1000 < Date.now()){
                dispatch(logout())
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
        }
        else{
            history("/login")
        }
        
    }, [order,id,successDeliver,successPay,userInfo])
    
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

    function downloadInvoice(){
        try{
            setinvoiceLoading(true)
            const Hide=document.getElementsByClassName("Hide")
            for (var i=0;i<Hide.length;i++){
                Hide[i].hidden=true
            }
            // Hide.hidden=true
            var htmlreport = document.querySelector("#htmlpdfreport").innerHTML; 
            axios .post( "http://localhost:8003/api/orders/invoice/", JSON.stringify(htmlreport), 
            { 
                responseType: "blob" 
            }) 
            .then(response => 
                { 
                    var url = window.URL.createObjectURL( new Blob([response.data], { type: "application/pdf" }) ),
                    anchor = document.createElement("a"); anchor.href = url; 
                    anchor.download = "invoice.pdf"; 
                    anchor.click(); 
                    setinvoiceLoading(false)
                    const Hide=document.getElementsByClassName("Hide")
                    for (var i=0;i<Hide.length;i++){
                        Hide[i].hidden=false
                    }
                });
        }catch(error){
            setinvoiceLoading(false)
        }
        

    }


  return loading ? (
            <Loader />
        ) : error ? (
            <Message variant='danger'>{error}</Message>
        ) : (
            <>
            {order.isDelivered ? (
                invoiceLoading?(
                    <Loader/>
                ):(

                    <Button
                    type='button'
                    className='float-end btn btn-sm'
                    onClick={downloadInvoice}
                    >
                    Download Invoice
                    </Button>
                )
            ):("")}
            
            <div id="htmlpdfreport">
                <h1 className='text-center'>
                    OfflineToOnline</h1>
                    {/* <Image src={`http://localhost:8003/static/multimedia/shopping.png`}  width="30px"/>                     */}
                <h1>Order: {order._id}</h1>
            <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h4>Order Date: {order.createdAt.split("T")[0]}</h4>
                            </ListGroup.Item>        
                        </ListGroup>
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
                                                        <Col>
                                                            <Image src={`http://localhost:8003/${item.image}`} alt={item.name} fluid rounded style={{width:"100px"}}/>
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
                                {userInfo && userInfo.isAdmin && order.paymentMethod==="Cash On Delivery" && (
                                    <ListGroup.Item className="text-center Hide" > 
                                        <Button
                                            type='button'
                                            className='btn btn-block m-3'
                                            onClick={payHandler}
                                        >
                                            Mark as Paid
                                        </Button>
                                    </ListGroup.Item>
                                )}
                                
                            </Card>
                            <br></br>
                            {userInfo && userInfo.isAdmin && !order.isDelivered && (<Card>
                                <ListGroup variant='flush' className="Hide">
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
            </>
        )
  
}

export default OrderScreen;
