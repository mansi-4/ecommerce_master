import React from 'react'
import {Link} from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from "./Rating"
function Product({product}) {
    console.log(product.image)
  return (
    <Card className="my-3 p-3 rounded">
        <Link to={`/product/${product.product_id}`}>
            <Card.Img src={`http://localhost:8003/${product.image}`}></Card.Img>
        </Link>
        <Card.Body>
            <Link to={`/product/${product.product_id}`}>
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
                ${product.price}
               
            </Card.Text>
        </Card.Body>
        
    </Card>
  )
}

export default Product
