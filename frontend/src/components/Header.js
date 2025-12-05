import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Form, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import SearchBox  from './SearchBox'
import { logout } from '../actions/userActions';




function Header() {
  //{[false, 'sm', 'md', 'lg', 'xl', 'xxl'].map((expand) => (
  //grabbing user info from state
  const dispatch = useDispatch()
  const userLogin = useSelector((state)=> state.userLogin)
  const {userInfo} = userLogin

  const logoutHandler = () => {
    //dispatch logout
    dispatch(logout())
  }

  return (
      <header>
      {['lg'].map((expand) => (
        <Navbar key={expand} expand={expand} variant='dark' className="bg-dark  mb-3" collapseOnSelect>
          <Container fluid>
            <LinkContainer to="/">
              <Navbar.Brand >Navbar Offcanvas</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>


                <SearchBox />


                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <LinkContainer to="/cart">
                    <Nav.Link href="#action1"><i className='fas fa-shopping-cart'></i>Cart</Nav.Link>
                  </LinkContainer>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id='username'>
                      <LinkContainer to="/profile">
                        <NavDropdown.Item><i className='fas fa-user'></i>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Item onClick={logoutHandler}><i className='fas fa-user'></i>Logout</NavDropdown.Item>
                    </NavDropdown>
                  ) : (<LinkContainer to="/login">
                    <Nav.Link href="#action2"><i className='fas fa-user'></i>Login</Nav.Link>
                  </LinkContainer>)
                }
                {userInfo && userInfo.isAdmin && (
                    <NavDropdown title={`Admin: ${userInfo.name}`} id='adminmenu'>
                      <LinkContainer to="/admin/userList">
                        <NavDropdown.Item><i className='fas fa-user'></i>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/productList">
                        <NavDropdown.Item><i className='fas fa-gavel'></i>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orderList">
                        <NavDropdown.Item><i className='fas fa-list-alt'></i>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )
                }
                  
                  <NavDropdown
                    title="Dropdown"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                  >
                    <LinkContainer to="/members">
                      <NavDropdown.Item href="#action3">
                        Members
                      </NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/profile">
                      <NavDropdown.Item href="#action4">
                        Profile
                      </NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/orders">
                      <NavDropdown.Item href="#action5">
                        Orders
                      </NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                </Nav>
                
                
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>))}
      </header>
  )
}

export default Header
