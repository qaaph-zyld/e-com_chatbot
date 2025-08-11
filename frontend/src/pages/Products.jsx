import React from 'react'
import styled from 'styled-components'

const ProductsContainer = styled.div`
  min-height: calc(100vh - 160px);
  padding: ${props => props.theme.spacing.xl} 0;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.text};
`

const Placeholder = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']} 0;
  color: ${props => props.theme.colors.textSecondary};
  
  h2 {
    font-size: ${props => props.theme.typography.fontSize.xl};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  p {
    font-size: ${props => props.theme.typography.fontSize.lg};
  }
`

function Products() {
  return (
    <ProductsContainer>
      <Container>
        <Title>Products</Title>
        <Placeholder>
          <h2>🛍️ Products Page</h2>
          <p>Product listing, search, and filtering functionality will be implemented here.</p>
          <p>Use the chat widget to ask about products!</p>
        </Placeholder>
      </Container>
    </ProductsContainer>
  )
}

export default Products
