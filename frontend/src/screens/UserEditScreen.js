import React, { useState, useEffect } from 'react'
import { Link ,useNavigate,useSearchParams,useParams} from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser ,logout} from '../actions/userAction'
import { USER_UPDATE_RESET } from '../constants/userConstants'
import jwt_decode from "jwt-decode";

function UserEditScreen() {
    let history=useNavigate()
    const { id } = useParams();



    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = userUpdate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            // to check if token is expired or not 
            var decodedHeader=jwt_decode(userInfo.token)
            if(decodedHeader.exp*1000 < Date.now()){
                dispatch(logout())
            }
            else{
                if (successUpdate) {
                    dispatch({ type: USER_UPDATE_RESET })
                    history('/admin/userlist')
                } else {

                    if (!user.name || user.user_id !== Number(id)) {
                        dispatch(getUserDetails(id))
                    } else {
                        setName(user.name)
                        setEmail(user.email)
                        setIsAdmin(user.isAdmin)
                    }
                }
            }
        } else {
            history('/login')
        }

    }, [user, id, successUpdate, history,userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ _id: user.user_id, name, email, isAdmin }))
    }

    return (
        <div>
            <Link to='/admin/userlist' className='btn btn-light my-3'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
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
                                    type='email'
                                    placeholder='Enter Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='isadmin' className="mt-3">
                                <Form.Check
                                    type='checkbox'
                                    label='Is Admin'
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                    required
                                >
                                </Form.Check>
                            </Form.Group>

                            <Button type='submit' className="m-3" variant='primary'>
                                Update
                        </Button>

                        </Form>
                    )}

            </FormContainer >
        </div>

    )
}

export default UserEditScreen;