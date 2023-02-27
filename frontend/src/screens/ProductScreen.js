import React,{useState,useEffect} from 'react'
import {Link,useParams,useNavigate } from 'react-router-dom'
import {Row,Col,Image,ListGroup,Button,Card,Form} from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import { listProductDetails,createProductReview, listDistinctProductDetails, listProductSizesByColor, listProductVariationBySize } from '../actions/productActions'
import {PRODUCT_CREATE_REVIEW_RESET,PRODUCT_SIZE_BY_COLOR_RESET} from '../constants/productConstants'
import Loader from "../components/Loader"
import Message from "../components/Message"
import Rating from '../components/Rating'


function ProductScreen() {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    // to match url id with product id from array
    const { id } = useParams();
    const dispatch=useDispatch()
    const productDistinctDetails = useSelector(state=>state.productDistinctDetails)
    const {error,loading,product}= productDistinctDetails

    const productSizesByColor = useSelector(state=>state.productSizesByColor)
    const {error:errorProductSizesByColor,loading:loadingProductSizesByColor,sizes}= productSizesByColor

    const productVariationBySize = useSelector(state=>state.productVariationBySize)
    const {error:errorProductVariationBySize,loading:loadingProductVariationBySize,variation}= productVariationBySize

    const [images,setImages]=useState([]);
    const [colors,setColors]=useState([]);
    
    const [color_id,setColorId]=useState("")
    const [size_id,setSizeId]=useState("")
    const [price,setPrice]=useState(0)
    const [stock,setStock]=useState(0)
    

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const {
        loading: loadingProductReview,
        error: errorProductReview,
        success: successProductReview,
    } = productReviewCreate

    
    useEffect(()=>{
        if (successProductReview) {
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }else{
            if(Number(id)!==product.product_id){
                dispatch(listDistinctProductDetails(id))
            }
            else{
                setImages(product.images)
                setColors(product.colors)
                
            }
        }
    },[dispatch,successProductReview,id,product,color_id,size_id,sizes,variation])
    // 
    // add to cart quantity
    const [qty,setQty] = useState(1)
    let history=useNavigate();

    function addToCartHandler() {
        history(`/cart/${variation.product_variation_id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(
            id, {
            rating,
            comment
        }
        ))
    }
    function handleColorChange(e){
        setColorId(e.target.value)
        const obj={
            "color_id":e.target.value,
            "product_id":id
        }
        dispatch({type:PRODUCT_SIZE_BY_COLOR_RESET})
        setSizeId("")
        dispatch(listProductSizesByColor(obj))
    }
    function handleSizeChange(e){
        setSizeId(e.target.value)
        const obj={
            "size_id":e.target.value,
            "color_id":color_id,
            "product_id":id
        }
        dispatch(listProductVariationBySize(obj))
    }
    var ProductImg =document.getElementById("ProductImg");
    var SmallImg= document.getElementsByClassName("small-img");
    function handleClick(e){
        ProductImg.src=e.target.src
    }
    
  return (
    <div>
        <Link to="/" className='btn btn-light my-3'>Go Back</Link>
        {loading ? <Loader/>
            :error ? <Message variant="danger">{error}</Message>
                :
                (
                    <div>
                    <Row>
                        <Col md={5}>
                            <div>
                            <img src={`http://localhost:8003/${images[0]}`} style={{ width: '100%',height:'100%'}} id="ProductImg"/>

                                <div className='small-img-row'>
                                    {images.map((image,index)=>(
                                        <div className='small-img-col'>
                                            <img src={`http://localhost:8003/${image}`} onClick={handleClick} style={{ width: '100%'}}  className="small-img" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                        <Col md={4}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h5>{product.brand}</h5>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.num_reviews} reviews`} color={'#f8e825'}/>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Form.Select name="color_id" value={color_id} onChange={(e)=>handleColorChange(e)}>
                                        <option >Colors</option>
                                        {colors.map((color,index)=>(
                                            <option value={color.color_id}>{color.color}</option>
                                        ))}
                                    </Form.Select>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Form.Select name="size_id" value={size_id} onChange={(e)=>handleSizeChange(e)}>
                                        <option>Size</option>
                                        {sizes.map((size,index)=>(
                                            <option value={size.size_id}>{size.size}</option>
                                        ))}
                                    </Form.Select>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Description: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        {loadingProductVariationBySize ? <Loader/>
                            :errorProductVariationBySize ? <Message variant="danger">{errorProductVariationBySize}</Message>
                            :
                            Object.keys(variation).length!==0 && size_id > 0? (
                                <Col md={3}>
                                <Card>
                                <ListGroup variant="flush">
                                        {variation.price===0 ? (""):(
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>
                                                    <strong>&#8377; {variation.price}</strong>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>)}
                                        
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:</Col>
                                                <Col>
                                                {variation.countInStock>0? "In Stock" : "Out of Stock"}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {/* to make select qty dropdown dynamic */}
                                        {variation.countInStock > 0 && (
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Qty</Col>
                                                    <Col  className='my-1'>
                                                        {variation.countInStock > 10 ?(
                                                            <Form.Control as="select" 
                                                            value={qty} 
                                                            onChange={(e)=>setQty(e.target.value)}>
                                                            {
                                                                [...Array(10).keys()].map((x)=>
                                                                (
                                                                    <option key={x+1} value={x+1}>
                                                                        {x+1}
                                                                    </option>
                                                                ))
                                                            } 
                                                            </Form.Control>
                                                            ):(
                                                            <Form.Control as="select" 
                                                            value={qty} 
                                                            onChange={(e)=>setQty(e.target.value)}>
                                                            {
                                                                [...Array(variation.countInStock).keys()].map((x)=>
                                                                (
                                                                    <option key={x+1} value={x+1}>
                                                                        {x+1}
                                                                    </option>
                                                                ))
                                                            } 
                                                            </Form.Control>
                                                        )}
                                                        
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )}
                                        <ListGroup.Item className="text-center">
                                            <Button onClick={addToCartHandler} className='btn btn-block' disabled={variation.countInStock == 0} type='button'>Add to Cart</Button>
                                        </ListGroup.Item>
                                </ListGroup>
                                </Card>
                                </Col>
                            ):("")
                        }
                        
                    </Row>
                    <Row>
                                <Col md={6} className="mt-3">
                                    <h4>Reviews</h4>
                                    {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}

                                    <ListGroup variant='flush'>
                                        {product.reviews.map((review) => (
                                            <ListGroup.Item key={review._id}>
                                                <strong>{review.name}</strong>
                                                <Rating value={review.rating} color='#f8e825' />
                                                <p>{review.createdAt.substring(0, 10)}</p>
                                                <p>{review.comment}</p>
                                            </ListGroup.Item>
                                        ))}

                                        <ListGroup.Item>
                                            <h4>Write a review</h4>

                                            {loadingProductReview && <Loader />}
                                            {successProductReview && <Message variant='success'>Review Submitted</Message>}
                                            {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

                                            {userInfo ? (
                                                <Form onSubmit={submitHandler}>
                                                    <Form.Group controlId='rating'>
                                                        <Form.Label>Rating</Form.Label>
                                                        <Form.Control
                                                            as='select'
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                            required
                                                        >
                                                            <option value=''>Select...</option>
                                                            <option value='1'>1 - Poor</option>
                                                            <option value='2'>2 - Fair</option>
                                                            <option value='3'>3 - Good</option>
                                                            <option value='4'>4 - Very Good</option>
                                                            <option value='5'>5 - Excellent</option>
                                                        </Form.Control>
                                                    </Form.Group>

                                                    <Form.Group controlId='comment'>
                                                        <Form.Label>Review</Form.Label>
                                                        <Form.Control
                                                            as='textarea'
                                                            row='5'
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                            required
                                                        ></Form.Control>
                                                    </Form.Group>

                                                    <Button
                                                        disabled={loadingProductReview}
                                                        type='submit'
                                                        variant='primary'
                                                        className="mt-3"
                                                    >
                                                        Submit
                                                    </Button>

                                                </Form>
                                            ) : (
                                                    <Message variant='info'>Please <Link to='/login'>login</Link> to write a review</Message>
                                                )}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                    </div>
                    
                )
        }
        
    </div>
  )
}

export default ProductScreen
