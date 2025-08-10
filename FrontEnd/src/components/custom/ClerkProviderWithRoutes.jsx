import { useNavigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';

// ClerkProvider wrapper to integrate with React Router
export function ClerkProviderWithRoutes({ children, publishableKey }) {
  const navigate = useNavigate();
  
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      navigate={navigate}
    >
      {children}
    </ClerkProvider>
  );
} 