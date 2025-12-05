import React from 'react'
import {Pagination, PageItem} from 'react-bootstrap'
import {LinkContainer}from 'react-router-bootstrap'
import { NavLink, useLocation } from 'react-router-dom';

function Paginate({pages,page,keyword='',isAdmin=false}) {

    if(keyword){
        keyword = keyword.split('?keyword=')[1].split('&')[0]
    }
    // active={x+1===page} 
    return (
        pages>1 && (
            <Pagination>
            <Pagination.First disabled={page === 1}
            as={NavLink}
            to={`?keyword=${keyword}&page=1`}
            />
                {[...Array(pages).keys()].map((x)=> (
                    <Pagination.Item
                        key={x+1}
                        active={x+1===page}
                        disabled={x+1===page}
                        as={NavLink}
                        to={
                            !isAdmin ? 
                                `/?keyword=${keyword}&page=${x+1}` 
                                : `/admin/productlist/?keyword=${keyword}&page=${x+1}`}
                    >
                        
                          
                            {x+1}{page}
                        </Pagination.Item>
                ))}
                <Pagination.Last disabled={page === pages}
                as={NavLink}
                to={`?keyword=${keyword}&page=${pages}`}
                />
            </Pagination>
        )
    )
}

export default Paginate
