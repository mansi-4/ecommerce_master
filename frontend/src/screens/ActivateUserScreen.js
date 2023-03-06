import React,{useState,useEffect} from 'react'
import {Link,useNavigate, useParams} from 'react-router-dom'
import {Card,Row,Col} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import Loader from "../components/Loader"
import Message from "../components/Message"
import FormContainer from "../components/FormContainer"
import {activateUser} from '../actions/userAction'

function ActivateUser() {
    const {token} = useParams();
    let history = useNavigate();
   console.log(token)
    const dispatch= useDispatch()
    
    
    const userActivation=useSelector(state => state.userActivation)
    const {error,loading,activation} = userActivation
    
    useEffect(()=>{
        dispatch(activateUser(token))
       
    },[])

    
  return (
    <FormContainer>
      <h1>Account Activation</h1>
      
      
      <Card className="h-70 my-3 p-3 rounded">
        
        <Card.Body>
            <Card.Title as="div">
                <h5>Your Account is being activated...</h5>
            </Card.Title>
            <Card.Text as="div">
              <div>
                {error && <Message variant="danger">{error}</Message>}
                {loading && <Loader/>}  
                {activation && <Message variant="info">{activation}</Message>}
                {activation === "Account Activated Successfully" ? 
                <Row className='py-3'>
                  <Col>
                      <Link
                          to={'/login'}>
                          Sign In
                          </Link>
                  </Col>
                </Row>:""}
              </div>
            </Card.Text>
           
        </Card.Body>
        
    </Card>
    </FormContainer>
  )
}

export default ActivateUser
