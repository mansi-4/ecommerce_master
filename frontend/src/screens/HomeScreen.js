import React, {useState,useEffect} from 'react'
import { Row,Col,Form } from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import products from '../products'
import Product from "../components/Product"
import { listProducts } from '../actions/productActions'
import Loader from "../components/Loader"
import Message from "../components/Message"
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import {useLocation} from "react-router-dom"
import { listCategories } from '../actions/categoryActions'


function HomeScreen() {
  const location = useLocation()
  const dispatch=useDispatch()
  const productList = useSelector(state=>state.productList)
  const {error,loading,products,
    // page,
    // pages
  }= productList
  // let keyword=location.search
  const [category_id,setCategoryId]=useState("0")
  const [keyword,setKeyword]=useState("")
  useEffect(()=>{
    dispatch(listCategories())
   dispatch(listProducts(keyword,category_id))
  },[dispatch,keyword,category_id])
  const categoryList = useSelector(state => state.categoryList)
  const { loading:loadingCategories, error:errorCategories, categories } = categoryList
  return (
    <div>
      {keyword==="" && category_id =="0" ? <ProductCarousel/> : ""}
      <h1>Latest Products</h1>
      <Row className='gy-2'>
        <Col md={3}>
          <Form.Control 
          type='text'
          placeholder='Type Product Name to Search...'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          >
          </Form.Control>
        </Col>
        <Col md={3}>
            <Form.Select  value={category_id} onChange={(e)=>setCategoryId(e.target.value)} >
              <option value="0">Select categories</option>
              {categories.map((category,index)=>(
                  <option value={category.id}>{category.category}</option>
              ))}
            </Form.Select>
        </Col>
      </Row>
      {loading ? <Loader/>
        :error ? <Message variant="danger">{error}</Message>
          :
          <div> 
          <Row className='gy-4'>
          {products.map(product=>(
              <Col sm={12} md={6} lg={4} xl={3} key={product.product_id}>
                  {/* creating component for products and passing products array as prop */}
                  <Product product={product}/>
              </Col>
          ))}
        </Row>
        {/* <Paginate page={page} pages={pages} keyword={keyword}/> */}
        </div>
      }
    </div>
  )
}

export default HomeScreen
