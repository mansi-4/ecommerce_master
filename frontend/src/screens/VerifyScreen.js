import React,{useState,useEffect} from 'react'
import {Link,useSearchParams, useNavigate} from 'react-router-dom'
import {Form,Button,Row,Col} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import Loader from "../components/Loader"
import Message from "../components/Message"
import FormContainer from "../components/FormContainer"
import {verifyUser} from '../actions/userAction'

function VerifyScreen() {
    
    let history = useNavigate()
    const [searchParms] = useSearchParams();
    const [email,setEmail] = useState("")
    
    
    const userVerify=useSelector(state => state.userVerify)
    const {error,loading,verify} = userVerify
    
    useEffect(()=>{
        // if user is logged in then he should not see verify page
        // if(userInfo){
        //     history(redirect)
        // } 
    },[history])

    // to submit data using useDispatch
    const dispatch= useDispatch()
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(verifyUser(email))
    }
  return (
    <FormContainer>
      <h1>Forgot Password</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader/>}
      {verify && <Message variant="info">{verify}</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            ></Form.Control>
        </Form.Group>
        <Button type="submit" className="m-2" variant="primary">Send Email</Button>
      </Form>
      <Row className="py-3">
        <Col>
            <Link to='/login'>Back to Login </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default VerifyScreen
