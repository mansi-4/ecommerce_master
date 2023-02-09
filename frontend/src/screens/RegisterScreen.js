import React,{useState,useEffect} from 'react'
import {Link,useSearchParams, useNavigate} from 'react-router-dom'
import {Form,Button,Row,Col} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import Loader from "../components/Loader"
import Message from "../components/Message"
import FormContainer from "../components/FormContainer"

import {register} from '../actions/userAction'


function RegisterScreen() {
    let history = useNavigate()
    const [searchParms] = useSearchParams();
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [message,setMessage] = useState("")

    
    const redirect = searchParms.get("redirect") ? searchParms.get("redirect") : '/';

    // getting the state of userLogin from store for that we are using useSelector hook
    const userRegister=useSelector(state => state.userRegister)
    // destructuring the response what we get from reducer
    const {error,loading,userInfo} = userRegister

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
        if(password!=confirmPassword){
            setMessage("Passwords do not match")
        }
        else{
        dispatch(register(name,email,password))
        setMessage("")

        }
    }
  return (
    <FormContainer>
        <h1>Sign In</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>

            <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    required
                    type='name'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    required
                    type='email'
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    required
                    type='password'
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='passwordConfirm'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    required
                    type='password'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>

            <Button type='submit' className="m-2" variant='primary'>
                Register
            </Button>
        </Form>

        <Row className='py-3'>
            <Col>
                Have an Account? <Link
                    to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                    Sign In
                    </Link>
            </Col>
        </Row>
</FormContainer >
  )
}

export default RegisterScreen
