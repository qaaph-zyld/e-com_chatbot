import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const HomeContainer = styled.div`
  min-height: calc(100vh - 160px); /* Account for header and footer */
`

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing['3xl']} 0;
  text-align: center;
`

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`

const HeroTitle = styled(motion.h1)`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: ${props => props.theme.typography.lineHeight.tight};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize['3xl']};
  }
`

const HeroSubtitle = styled(motion.p)`
  font-size: ${props => props.theme.typography.fontSize.xl};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  opacity: 0.9;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.lg};
  }
`

const CTAButton = styled(motion(Link))`
  display: inline-block;
  background: white;
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.xl};
    text-decoration: none;
  }
`

const FeaturesSection = styled.section`
  padding: ${props => props.theme.spacing['3xl']} 0;
  background: ${props => props.theme.colors.surface};
`

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`

const SectionTitle = styled.h2`
  text-align: center;
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.text};
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
`

const FeatureCard = styled(motion.div)`
  background: white;
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.md};
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.lg};
`

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
`

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`

const StatsSection = styled.section`
  padding: ${props => props.theme.spacing['3xl']} 0;
  background: white;
`

const StatsGrid = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  text-align: center;
`

const StatCard = styled(motion.div)`
  padding: ${props => props.theme.spacing.lg};
`

const StatNumber = styled.div`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`

function Home() {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Assistant',
      description: 'Get personalized product recommendations and instant answers to your shopping questions.'
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find exactly what you\'re looking for with our intelligent search and filtering system.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Browse thousands of products and get instant responses from our chatbot assistant.'
    },
    {
      icon: '🛡️',
      title: 'Secure Shopping',
      description: 'Shop with confidence using our secure payment processing and data protection.'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Products' },
    { number: '5K+', label: 'Happy Customers' },
    { number: '24/7', label: 'Support' },
    { number: '99.9%', label: 'Uptime' }
  ]

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Your AI Shopping Assistant
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover the perfect products with intelligent recommendations, 
            instant answers, and personalized shopping experiences.
          </HeroSubtitle>
          <CTAButton
            to="/products"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Shopping
          </CTAButton>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Choose ShopBot?</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <StatsSection>
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>
    </HomeContainer>
  )
}

export default Home
