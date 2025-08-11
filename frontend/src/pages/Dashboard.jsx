import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  min-height: calc(100vh - 160px);
  padding: ${props => props.theme.spacing.xl} 0;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
`

const Placeholder = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']} 0;
  color: ${props => props.theme.colors.textSecondary};
`

function Dashboard() {
  return (
    <Container>
      <Placeholder>
        <h1>📊 Dashboard</h1>
        <p>Analytics dashboard will be implemented here.</p>
      </Placeholder>
    </Container>
  )
}

export default Dashboard
