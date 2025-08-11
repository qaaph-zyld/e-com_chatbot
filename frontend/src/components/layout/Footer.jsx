import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.surface};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.xl} 0 ${props => props.theme.spacing.md};
  margin-top: auto;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const FooterSection = styled.div`
  h3 {
    font-size: ${props => props.theme.typography.fontSize.lg};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    margin-bottom: ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.text};
  }
`

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  a {
    color: ${props => props.theme.colors.textSecondary};
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`

const FooterBottom = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: ${props => props.theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    text-align: center;
  }
`

const Copyright = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin: 0;
`

const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  
  a {
    color: ${props => props.theme.colors.textSecondary};
    font-size: ${props => props.theme.typography.fontSize.lg};
    transition: color 0.2s ease;
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`

const CompanyInfo = styled.div`
  p {
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: ${props => props.theme.spacing.sm};
    line-height: ${props => props.theme.typography.lineHeight.relaxed};
  }
`

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3>ShopBot</h3>
            <CompanyInfo>
              <p>
                Your AI-powered shopping assistant. Find the perfect products with 
                intelligent recommendations and personalized service.
              </p>
              <p>
                Available 24/7 to help you discover, compare, and purchase the best products.
              </p>
            </CompanyInfo>
          </FooterSection>

          <FooterSection>
            <h3>Shop</h3>
            <FooterLinks>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=laptops">Laptops</Link></li>
              <li><Link to="/products?category=smartphones">Smartphones</Link></li>
              <li><Link to="/products?category=tablets">Tablets</Link></li>
              <li><Link to="/products?category=accessories">Accessories</Link></li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Account</h3>
            <FooterLinks>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/orders">Order History</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Support</h3>
            <FooterLinks>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/shipping">Shipping Info</a></li>
              <li><a href="/returns">Returns</a></li>
              <li><a href="/faq">FAQ</a></li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Company</h3>
            <FooterLinks>
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/press">Press</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <Copyright>
            © 2024 ShopBot. All rights reserved.
          </Copyright>
          
          <SocialLinks>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              🐦
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              📘
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              📷
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              💼
            </a>
          </SocialLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  )
}

export default Footer
