import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import { selectIsAuthenticated, selectCurrentUser, logout } from '../../store/slices/authSlice'
import { selectCartItemCount } from '../../store/slices/ordersSlice'
import { toggleMobileMenu, openModal } from '../../store/slices/uiSlice'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: white;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  z-index: 1000;
  box-shadow: ${props => props.theme.shadows.sm};
`

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Logo = styled(Link)`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
  }
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
  }
`

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`

const IconButton = styled.button`
  position: relative;
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.surface};
  }
`

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${props => props.theme.colors.error};
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  padding: 2px 6px;
  border-radius: ${props => props.theme.borderRadius.full};
  min-width: 18px;
  text-align: center;
`

const Button = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.variant === 'outline' ? props.theme.colors.primary : 'transparent'};
  background: ${props => props.variant === 'outline' ? 'transparent' : props.theme.colors.primary};
  color: ${props => props.variant === 'outline' ? props.theme.colors.primary : 'white'};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.variant === 'outline' ? props.theme.colors.primary : props.theme.colors.primaryDark};
    color: white;
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.sm};
  cursor: pointer;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`

const UserMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  min-width: 200px;
  padding: ${props => props.theme.spacing.sm} 0;
  z-index: 1001;
`

const MenuItem = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.surface};
  }
`

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const currentUser = useSelector(selectCurrentUser)
  const cartItemCount = useSelector(selectCartItemCount)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)

  const handleLogout = () => {
    dispatch(logout())
    setUserMenuOpen(false)
    navigate('/')
  }

  const handleLogin = () => {
    dispatch(openModal('login'))
  }

  const handleRegister = () => {
    dispatch(openModal('register'))
  }

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          ShopBot
        </Logo>

        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/orders">Orders</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </>
          )}
        </Nav>

        <UserActions>
          <IconButton onClick={() => navigate('/products')}>
            🔍
          </IconButton>

          <IconButton onClick={() => dispatch(openModal('cart'))}>
            🛒
            {cartItemCount > 0 && <Badge>{cartItemCount}</Badge>}
          </IconButton>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <IconButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
                👤
              </IconButton>
              
              {userMenuOpen && (
                <UserMenu
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <MenuItem onClick={() => {
                    navigate('/profile')
                    setUserMenuOpen(false)
                  }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => {
                    navigate('/orders')
                    setUserMenuOpen(false)
                  }}>
                    My Orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </UserMenu>
              )}
            </div>
          ) : (
            <>
              <Button variant="outline" onClick={handleLogin}>
                Login
              </Button>
              <Button onClick={handleRegister}>
                Sign Up
              </Button>
            </>
          )}

          <MobileMenuButton onClick={() => dispatch(toggleMobileMenu())}>
            ☰
          </MobileMenuButton>
        </UserActions>
      </HeaderContent>
    </HeaderContainer>
  )
}

export default Header
