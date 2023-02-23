import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link ,useNavigate,useSearchParams,useParams} from 'react-router-dom'
import { Form, Button,Row,Col,Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct ,listProductVariationDetails,listProductVariationDetail,deleteProductVariation,createProductVariation, updateProductVariation} from '../actions/productActions'
import { PRODUCT_UPDATE_RESET,PRODUCT_VARIATION_CREATE_RESET,PRODUCT_VARIATION_UPDATE_RESET,PRODUCT_VARIATION_DETAIL_RESET } from '../constants/productConstants'
import { listCategories } from '../actions/categoryActions'
import { listColors } from '../actions/colorActions'
import { listSizes } from '../actions/sizeActions'
function ProductEditScreen() {
    let history=useNavigate();
    const { id } = useParams();
    
    const [action,setAction]=useState("Add")
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category_id, setCategoryId] = useState('')
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

    const dispatch = useDispatch()
    const categoryList = useSelector(state => state.categoryList)
    const { loading:loadingCategories, error:errorCategories, categories } = categoryList

    const colorList = useSelector(state => state.colorList)
    const { loading:loadingColor, error:errorColor, colors } = colorList
    
    const sizeList = useSelector(state => state.sizeList)
    const { loading:loadingSize, error:errorSize, sizes } = sizeList

    const productDetails = useSelector(state => state.productDetails)
    const { error, loading, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = productUpdate
    
    const productVariationDetails = useSelector(state => state.productVariationDetails)
    const { error:errorProductVariations, loading:loadingProductVariations, variations } = productVariationDetails

    const productVariationDetail = useSelector(state => state.productVariationDetail)
    const { error:errorProductVariation, loading:loadingProductVariation, variation } = productVariationDetail
    
    const productVariationCreate = useSelector(state => state.productVariationCreate)
    const { loading: loadingVariationCreate, error: errorVariationCreate, success: successVariationCreate, variation: createdVariation } = productVariationCreate
    
    const productVariationUpdate = useSelector(state => state.productVariationUpdate)
    const { error: errorVariationUpdate, loading: loadingVariationUpdate, success: successVariationUpdate } = productVariationUpdate

    const productVariationDelete = useSelector(state => state.productVariationDelete)
    const { loading: loadingVariationDelete, error: errorVariationDelete, success: successVariationDelete } = productVariationDelete

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        dispatch({ type: PRODUCT_VARIATION_CREATE_RESET })
       if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            history('/admin/productlist')
        } else {
            if (!product.name || product.product_id !== Number(id)) {
                dispatch(listProductDetails(id))
                dispatch(listProductVariationDetails(id))
            }else if(successVariationUpdate){
                dispatch({ type: PRODUCT_VARIATION_UPDATE_RESET })
                dispatch({type:PRODUCT_VARIATION_DETAIL_RESET})
                dispatch(listProductVariationDetails(id))
                setAction("Add")
            }
            else if(Object.keys(variation).length!==0 ){
                setProductVariation({
                    product_id:id,
                    product_variation_id:variation.product_variation_id,
                    color_id:variation.color_id,
                    size_id:variation.size_id,
                    stock:variation.countInStock,
                    price:variation.price 
                })

            } else {
                setName(product.name)
                setImage(product.image)
                setBrand(product.brand)
                setCategoryId(product.category_id)
                setDescription(product.description)
                dispatch(listCategories())
                dispatch(listColors())
                dispatch(listSizes())
                dispatch(listProductVariationDetails(id))
            }
        }
    }, [dispatch,product, id, history,successUpdate,successVariationDelete,successVariationCreate,variation,successVariationUpdate])
    const [productVariation,setProductVariation]=useState({
        product_id:id,
        product_variation_id:"",
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
      } = productVariation;

      function handleChangeList(event) {
        setProductVariation({
          ...productVariation,
          [event.target.name]: event.target.value
        });
      }
      function submitVariation(){
        switch(action){
            case "Add":
                dispatch(createProductVariation(productVariation)) 
                setProductVariation({
                    product_id:id,
                    product_variation_id:"",
                    color_id:"",
                    size_id:"",
                    stock:"",
                    price:""
                })
                break;
            case "Update":
                dispatch(updateProductVariation(productVariation))
                setProductVariation({
                    product_id:id,
                    product_variation_id:"",
                    color_id:"",
                    size_id:"",
                    stock:"",
                    price:""
                })
                break;
        }
       
      }
      function deleteVariation(id){
        dispatch(deleteProductVariation(id))
      }
      
    function getVariation(id){
        dispatch(listProductVariationDetail(id))
        setAction("Update")
        
    }
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id: id,
            name,
            brand,
            category_id,
            description
        }))
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files
        const formData = new FormData()

        formData.append('product_id', id)
        for (let i = 0 ; i < file.length ; i++) {
            formData.append("images", file[i]);
        }
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: userInfo.token
                }
            }

            const { data } = await axios.post('/api/products/upload/', formData, config)


            setImage(data)
            setUploading(false)

        } catch (error) {
            setUploading(false)
        }
    }
    return (
        <div>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <Row>
                <Col md={5}>
                    <h1>Edit Product</h1>
                    {loadingUpdate && <Loader />}
                    {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                    {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                        : (
                            <Form onSubmit={submitHandler}>

                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control

                                    type='name'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter image'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                >
                                </Form.Control>

                                <Form.Control
                                        type="file"
                                        id='image-file'
                                        label='Choose File'
                                        onChange={uploadFileHandler}
                                        multiple
                                    ></Form.Control>
                                {uploading && <Loader />}
                            </Form.Group>


                            <Form.Group controlId='brand'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter brand'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
 
                            

                            <Form.Group controlId='category'>
                                <Form.Label>Category</Form.Label>
                                <Form.Select  value={category_id} onChange={(e)=>setCategoryId(e.target.value)}>
                                    <option>Select categories</option>
                                    {categories.map((category,index)=>(
                                        <option value={category.id}>{category.category}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId='description'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <br></br>
                            <Button type='submit' variant='primary'>
                                Update
                            </Button>

                        </Form>
                        )}

                </Col>
                <Col md={7}>
                    <h1>Edit Variations</h1>
                    {loadingVariationDelete && <Loader />}
                    {errorVariationDelete && <Message variant='danger'>{errorVariationDelete}</Message>}
                    {loadingVariationCreate && <Loader />}
                    {errorVariationCreate && <Message variant='danger'>{errorVariationCreate}</Message>}
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>                                
                                <td>
                                    <Form.Select name="color_id" value={color_id} onChange={handleChangeList}>
                                        <option>Colors</option>
                                        {colors.map((color,index)=>(
                                            <option value={color.id}>{color.color}</option>
                                        ))}
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Select name="size_id" value={size_id} onChange={handleChangeList}>
                                        <option>Sizes</option>
                                        {sizes.map((size,index)=>(
                                            <option value={size.id}>{size.size}</option>
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
                                <Button type='button' variant='dark' className='btn-sm' onClick={submitVariation}>
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
                                        {variations.map((variation,index)=>{
                                                return(
                                                <tr>
                                                    <td>{variation.color}</td>
                                                    <td>{variation.size}</td>
                                                    <td>{variation.countInStock}</td>
                                                    <td>{variation.price}</td>
                                                    <td><Button variant='light' className='btn-sm' onClick={()=>getVariation(variation.product_variation_id)}>
                                                        <i className='fas fa-edit'></i>
                                                    </Button>
                                                    
                                                    <Button  variant='danger' className='btn-sm' onClick={()=>deleteVariation(variation.product_variation_id)}>
                                                            <i class="fa fa-trash"></i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                                );
                                        })}
                                    </tbody>
                    </Table>
                </Col>
            </Row>
            
        </div>

    )
}

export default ProductEditScreen