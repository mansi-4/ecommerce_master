import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import {Link,useSearchParams,useParams, useNavigate} from 'react-router-dom'

function Paginate({ pages, page, keyword = '', isAdmin = false }) {
    const [searchParms] = useSearchParams();
    const history = useNavigate();
    if (keyword) {
        
        // keyword = keyword.split('/?keyword=')[1].split('&')[0]

        // const keyword = searchParms.get("keyword");
        
        // console.log("keyword"+keyword)
    
    }
    const  goToPage =  (x) => {
        history(`/?keyword=${keyword}&page=${x+1}`)
    }

    return (pages > 1 && (
        <Pagination>
            {[...Array(pages).keys()].map((x) => (
                    <Link
                    to={`/?keyword=${keyword}&page=${x + 1}`}
                    >
                    
                    <Pagination.Item key={x+1} active={x + 1 === page} >{x + 1}</Pagination.Item>
                    </Link>
                
                
            ))}
        </Pagination>
    )
    )
}

export default Paginate