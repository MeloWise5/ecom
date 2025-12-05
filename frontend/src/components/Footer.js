import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
  return (
      <footer>
        <Container>
          <Row>
            <Col className="text-center py-3">
            Copyright &copy; My eCommerce Site
            </Col>
          </Row>
        <h1>Footer</h1>
        </Container>
      </footer>
  )
}

export default Footer
