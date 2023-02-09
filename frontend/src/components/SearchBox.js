import React, { useState } from 'react'
import { Button, Form,Row ,Col} from 'react-bootstrap'
import { useNavigate,useLocation  } from 'react-router-dom'

function SearchBox() {
    const [keyword, setKeyword] = useState('')

    let history = useNavigate()
    let location =useLocation()

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword) {
            // history(`/?keyword=${keyword}&page=1`)
            history(`/?keyword=${keyword}`)

        } else {
            history(history(location.search))
        }
    }
    return (
        <Form onSubmit={submitHandler}>
            <Row>
                <Col md={8}>
                    <Form.Control
                        type='text'
                        name='q'
                        onChange={(e) => setKeyword(e.target.value)}
                        className='mr-sm-2 ml-sm-5'
                    ></Form.Control>
                </Col>
                <Col md={4}>
                <Button
                type='submit'
                variant='outline-success'
                className='p-2'
            >
                Submit
            </Button>    
                </Col>
            
            </Row>
        </Form>
    )
}

export default SearchBox