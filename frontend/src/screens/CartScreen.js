import React,{useEffect} from 'react'
import {Link,useSearchParams,useParams, useNavigate} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import {Row,Col,ListGroup,Form,Card,Button,Image} from 'react-bootstrap'
import Loader from "../components/Loader"
import Message from "../components/Message"
import Rating from '../components/Rating'
import {addToCart,removeFromCart} from '../actions/cartActions'
function CartScreen() {
    let history = useNavigate()
    const { id } = useParams();
    const [searchParms] = useSearchParams();
    const qty = Number(searchParms.get("qty"));
    
    const cart = useSelector(state => state.cart)
    const {cartItems} = cart
    const dispatch = useDispatch()
    
    useEffect(()=>{
        // if condition is checking whether product id is there or not
        if(id){
            dispatch(addToCart(id,qty))
        }
    },[dispatch,id,qty])

    function removeFromCartHandler(id){
        dispatch(removeFromCart(id))
    }

    // getting the state of userLogin from store for that we are using useSelector hook
    const userLogin=useSelector(state => state.userLogin)
    // destructuring the response what we get from reducer 
    const {error,loading,userInfo} = userLogin
    function checkoutHandler(){
        if(userInfo){
            history("/shipping")
        }else{
            history("/login")
        }
    }
  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length ===0 ? (
            <Message variant="info">
                Your Cart is Empty <Link to="/">Go Back</Link>
            </Message>
        ):(
            <ListGroup variant="flush">
                {cartItems.map((item)=>(
                    <ListGroup.Item key={item.product}>
                        <Row>
                            <Col md={2}>
                                <Image src={`http://localhost:8003/${item.image}`} alt={item.name} fluid rounded/>
                            </Col>
                            <Col md={3}>
                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                            </Col>
                            <Col md={2}>
                                ${item.price}
                            </Col>
                            <Col md={3}>
                                    <Form.Control as="select" 
                                        value={item.qty} 
                                        onChange={(e)=>dispatch(addToCart(item.product,Number(e.target.value)))}>
                                        {
                                            [...Array(item.countInStock).keys()].map((x)=>(
                                                <option key={x+1} value={x+1}>
                                                    {x+1}
                                                </option>
                                            ))
                                        } 
                                    </Form.Control>
                            </Col>
                            <Col md={1}>
                                <Button
                                type="button"
                                variant="light"
                                onClick={()=>removeFromCartHandler(item.product)}
                                >
                                    <i className='fas fa-trash'></i>
                                </Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <h2>SubTotal ({cartItems.reduce((acc,item) => acc+item.qty,0)}) items</h2>
                    ${cartItems.reduce((acc,item) => acc+item.qty*item.price,0).toFixed(2)}
                </ListGroup.Item>
            </ListGroup>
            <ListGroup.Item className="text-center">
                <Button type="button" 
                    className="btn-block"
                    disabled={cartItems.length===0}
                    onClick={checkoutHandler}
                    >Proceed to Checkout</Button>
            </ListGroup.Item>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
