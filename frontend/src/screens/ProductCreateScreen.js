import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import {useNavigate,Link } from 'react-router-dom'
import { Table, Button, Row,Col,Form} from 'react-bootstrap' 
import FormContainer from '../components/FormContainer'

import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listCategories } from '../actions/categoryActions'
import { listColors } from '../actions/colorActions'
import { listSizes } from '../actions/sizeActions'
import axios from 'axios'
import {CATEGORY_CREATE_RESET} from "../constants/categoryConstants"
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import { createProduct } from '../actions/productActions'
import {logout} from '../actions/userAction'
import jwt_decode from "jwt-decode";
function ProductCreateScreen() {
    let history=useNavigate()
    const dispatch = useDispatch()

    const categoryList = useSelector(state => state.categoryList)
    const { loading, error, categories } = categoryList

    const colorList = useSelector(state => state.colorList)
    const { loading:loadingColor, error:errorColor, colors } = colorList
    
    const sizeList = useSelector(state => state.sizeList)
    const { loading:loadingSize, error:errorSize, sizes } = sizeList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productCreate = useSelector(state => state.productCreate)
    const { product: createdProduct, loading: loadingCreate,error:errorCreate, success: successCreate } = productCreate
    
    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            // to check if token is expired or not 
            var decodedHeader=jwt_decode(userInfo.token)
            if(decodedHeader.exp*1000 < Date.now()){
                dispatch(logout())
            }
            else{
                if(successCreate){
                    dispatch({ type: PRODUCT_CREATE_RESET })
                    history('/admin/productlist')
                    
                    setVariationsListArr([])
                    setProductVariations({
                        color_id:"",
                        size_id:"",
                        stock:"",
                        price:""
                    })
                    setProduct({
                        name:"",
                        brand:"",
                        category_id:"",
                        description:""                
                    })
                    setImages([])
        
                    
                }else{
                    dispatch(listCategories())
                    dispatch(listColors())
                    dispatch(listSizes())
                }
            }
        }
        else{
            history('/login')
        }
        
    }, [dispatch, history, userInfo,successCreate])

    const [images, setImages] = useState([])
    const [product, setProduct] = useState({
        name:"",
        brand:"",
        category_id:"",
        description:""
    });
    
      const {
        name,
        brand,
        category_id,
        description
      } = product;
    
    const [productVariations,setProductVariations]=useState({
        color_id:"",
        size_id:"",
        stock:"",
        price:""
    })
    
    const {
        color_id,
        size_id,
        stock,
        price
      } = productVariations;

      function handleChange(event) {
        setProduct({
          ...product,
          [event.target.name]: event.target.value
        });
      }
    function handleChangeList(event) {
        setProductVariations({
          ...productVariations,
          [event.target.name]: event.target.value
        });
      }
      const [variationsListArr,setVariationsListArr]=useState([]);
      function addVariationsList(){
        variationsListArr.push(productVariations)
        setProductVariations({
            color_id:"",
            size_id:"",
            stock:"",
            price:""
        })
      }
      function deleteProductVariationsArrItem(id){
        setVariationsListArr(variationsListArr.filter((i,index)=>(index!== id)))
      }

      const submitHandler = (e) => {
        e.preventDefault()
        if(images.length > 5){
            alert("you can upload images max upto 5...");
        }else if(variationsListArr.length < 0){
            alert("Please add at least one product variation");

        }
        else{
            const formData = new FormData();
            formData.append('name', name);
            formData.append('brand', brand);
            for (let i = 0 ; i < images.length ; i++) {
                formData.append("images", images[i]);
            }
            formData.append('category_id', category_id);
            formData.append('description', description);
            formData.append('productVariations', JSON.stringify(variationsListArr));
            dispatch(createProduct(
                formData
            ))
        }
    }
    return (
        <div>
        <Link to='/admin/productlist' className='btn btn-light my-3'>
            Go Back
        </Link>
        <Form onSubmit={submitHandler}>
                {loadingCreate && <Loader />}
                {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
                <FormContainer>
                    <h1>Create Product</h1>
                            
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            type='name'
                            placeholder='Enter name'
                            name="name"
                            value={name}
                            onChange={handleChange}
                        >
                        </Form.Control>
                    </Form.Group>


                    <Form.Group controlId='image'>
                        <Form.Label>Images</Form.Label>
                        <Form.Control
                                type="file"
                                id='image-file'
                                label='Choose File'
                                onChange={(e)=>setImages(e.target.files)}
                                multiple
                                required
                            ></Form.Control>
                    </Form.Group>


                    <Form.Group controlId='brand'>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control

                            type='text'
                            placeholder='Enter brand'
                            name="brand"
                            value={brand}
                            onChange={handleChange}
                            required
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='category'>
                        <Form.Label>Category</Form.Label>
                        <Form.Select name="category_id" value={category_id} onChange={handleChange} required>
                            <option>Select categories</option>
                            {categories.map((category,index)=>(
                                <option value={category.id}>{category.category}</option>
                            ))}
                        </Form.Select>
                    </Form.Group> 

                    <Form.Group controlId='description'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            // type='text'
                            placeholder='Enter description'
                            name="description"
                            value={description}
                            onChange={handleChange}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                
                </FormContainer >
                    <br></br>
                    <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                        <tr>                                
                                            <td>
                                                <Form.Select name="color_id" value={color_id} onChange={handleChangeList}>
                                                    <option>Colors</option>
                                                    {colors.map((color,index)=>(
                                                        <option value={color.id+'_'+color.color}>{color.color}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>
                                            <td>
                                                <Form.Select name="size_id" value={size_id} onChange={handleChangeList}>
                                                    <option>Sizes</option>
                                                    {sizes.map((size,index)=>(
                                                        <option value={size.id+'_'+size.size}>{size.size}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>
                                            <td>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter Stock'
                                                name="stock"
                                                value={stock}
                                                onChange={handleChangeList}
                                                >
                                            </Form.Control>
                                            </td>
                                            <td>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter Price'
                                                name="price"
                                                value={price}
                                                onChange={handleChangeList}
                                                >
                                            </Form.Control>
                                            </td>
                                            <td>
                                            <Button type='button' variant='dark' className='btn-sm' onClick={addVariationsList}>
                                            <i class="fa fa-plus"></i>

                                            </Button>
                                            </td>
                                        </tr>
                                    </thead>
                    </Table>
                    <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                        <tr>                                
                                            <th>
                                                Color
                                            </th>
                                            <th>
                                                Size
                                            </th>
                                            <th>
                                                Stock
                                            </th>
                                            <th>
                                                Price
                                            </th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variationsListArr.map((productVariation,index)=>{
                                                var color=productVariation.color_id.split("_");
                                                var color=color[1];
                                                var size=productVariation.size_id.split("_");
                                                var size=size[1];
                                                return(
                                                <tr>
                                                    <td>{color}</td>
                                                    <td>{size}</td>
                                                    <td>{productVariation.stock}</td>
                                                    <td>{productVariation.price}</td>
                                                    <td><Button type="button" variant='danger' onClick={()=>deleteProductVariationsArrItem(index)}>
                                                            <i class="fa fa-trash"></i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                                );
                                        })}
                                    </tbody>
                    </Table>
                    <br></br>
                    <Button type='submit' className="float-right" variant='primary'>
                        Save
                    </Button>
                
        </Form>
        
    </div>
    )
}

export default ProductCreateScreen