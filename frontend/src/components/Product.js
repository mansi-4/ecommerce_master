import React from 'react'
import {Link} from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from "./Rating"
function Product({product}) {
    const minPrice=Math.min(...product.variations.map(variation => variation.price));
    
  return (
    <Card className="h-100 my-3 p-3 rounded">
        <Link to={`/product/${product.product_id}`}>
            <Card.Img src={`http://localhost:8003/${product.images[0]}`}></Card.Img>
        </Link>
        <Card.Body>
            <Card.Title as="div">
                <h5>{product.brand}</h5>
            </Card.Title>
            <Link to={`/product/${product.product_id}`} style={{textDecoration:"none", color:"blue"}}>
                <Card.Title as="div">
                    <strong>{product.name}</strong>
                </Card.Title>    
            </Link>
            <Card.Text as="div">
                <div className="my-3">
                    {/* Rating component */}
                    <Rating value={product.rating} text={` ${product.num_reviews} reviews`} color={'#f8e825'}/>
                </div>
            </Card.Text>
            <Card.Text as="h3">
                &#8377;{minPrice}
                {/* &#8377;{product.variations[0].price} */}
               
            </Card.Text>
        </Card.Body>
        
    </Card>
  )
}

export default Product
