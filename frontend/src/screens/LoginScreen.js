import React,{useState,useEffect} from 'react'
import {Link,useSearchParams, useNavigate} from 'react-router-dom'
import {Form,Button,Row,Col} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import Loader from "../components/Loader"
import Message from "../components/Message"
import FormContainer from "../components/FormContainer"

import {login} from '../actions/userAction'
function LoginScreen() {
    let history = useNavigate()
    const [searchParms] = useSearchParams();
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    
    const redirect = searchParms.get("redirect") ? searchParms.get("redirect") : '/';

    // getting the state of userLogin from store for that we are using useSelector hook
    const userLogin=useSelector(state => state.userLogin)
    // destructuring the response what we get from reducer 
    const {error,loading,userInfo} = userLogin

    useEffect(()=>{
        // if user is logged in then he should not see login page
        if(userInfo){
            history(redirect)
        } 
    },[history,userInfo,redirect])

    // to submit data using useDispatch
    const dispatch= useDispatch()
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email,password))
        
    }
  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader/>}
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
        <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            ></Form.Control>
        </Form.Group>
        <Row className="float-end">
        <Col>
            {/* <Link to={redirect ? `/verify?redirect=${redirect}` : '/verify'}>Forgot Password ?</Link> */}
            <Link to='/verify'>Forgot Password ?</Link>

        </Col>
      </Row>
        <Button type="submit" className="m-2" variant="primary">Sign In</Button>
      </Form>
      
      <Row className="py-3">
        <Col>
            New Customer ? <Link to={ '/register'}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
