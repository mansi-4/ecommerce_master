import React,{useState,useEffect} from 'react'
import {Link,useSearchParams,useParams, useNavigate} from 'react-router-dom'
import {Form,Button,Row,Col} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import Loader from "../components/Loader"
import Message from "../components/Message"
import FormContainer from "../components/FormContainer"

import {updateUserPassword} from '../actions/userAction'
function PasswordResetScreen() {
    const { token } = useParams();

    let history = useNavigate()
    const [password,setPassword] = useState("")
    const [confirm_password,setConfirmPassword] = useState("")
    const [message,setMessage] = useState("")


    
    
    
    const userUpdatePassword=useSelector(state => state.userUpdatePassword)
    const {error,loading,success} = userUpdatePassword

    useEffect(()=>{
        if(success){
            history('/login')
        } 
    },[history,success])

    // to submit data using useDispatch
    const dispatch= useDispatch()
    const submitHandler = (e) => {
        e.preventDefault()
        if(password!=confirm_password){
          setMessage("Passwords do not match")
      }
      else{
        console.log(token)
          dispatch(updateUserPassword(token,password))
          setMessage("")
      }
        
    }
  return (
    <FormContainer>
      <h1>Forgot Password</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader/>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="npassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            ></Form.Control>
        </Form.Group>
        <Form.Group controlId="cpassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
            type="password"
            placeholder="Enter confirm password"
            value={confirm_password}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            required
            ></Form.Control>
        </Form.Group>
        <Button type="submit" className="m-2" variant="primary">Reset Password</Button>
      </Form>
      <Row className="py-3">
        <Col>
            <Link to='/login'>Back to Login </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default PasswordResetScreen
