import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily.primary};
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.background};
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    line-height: ${props => props.theme.typography.lineHeight.tight};
    margin-bottom: ${props => props.theme.spacing.md};
  }

  h1 {
    font-size: ${props => props.theme.typography.fontSize['3xl']};
  }

  h2 {
    font-size: ${props => props.theme.typography.fontSize['2xl']};
  }

  h3 {
    font-size: ${props => props.theme.typography.fontSize.xl};
  }

  h4 {
    font-size: ${props => props.theme.typography.fontSize.lg};
  }

  h5 {
    font-size: ${props => props.theme.typography.fontSize.base};
  }

  h6 {
    font-size: ${props => props.theme.typography.fontSize.sm};
  }

  p {
    margin-bottom: ${props => props.theme.spacing.md};
    line-height: ${props => props.theme.typography.lineHeight.normal};
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${props => props.theme.colors.primaryDark};
      text-decoration: underline;
    }
  }

  /* Form elements */
  button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    &:disabled {
      background-color: ${props => props.theme.colors.surface};
      cursor: not-allowed;
    }
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.full};

    &:hover {
      background: ${props => props.theme.colors.secondary};
    }
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing.md};
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-sm {
    gap: ${props => props.theme.spacing.sm};
  }

  .gap-md {
    gap: ${props => props.theme.spacing.md};
  }

  .gap-lg {
    gap: ${props => props.theme.spacing.lg};
  }

  .mb-sm {
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  .mb-md {
    margin-bottom: ${props => props.theme.spacing.md};
  }

  .mb-lg {
    margin-bottom: ${props => props.theme.spacing.lg};
  }

  .mt-sm {
    margin-top: ${props => props.theme.spacing.sm};
  }

  .mt-md {
    margin-top: ${props => props.theme.spacing.md};
  }

  .mt-lg {
    margin-top: ${props => props.theme.spacing.lg};
  }

  /* Animation utilities */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Responsive utilities */
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    .container {
      padding: 0 ${props => props.theme.spacing.sm};
    }
    
    h1 {
      font-size: ${props => props.theme.typography.fontSize['2xl']};
    }
    
    h2 {
      font-size: ${props => props.theme.typography.fontSize.xl};
    }
  }
`

export default GlobalStyles
