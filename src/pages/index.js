import Dashboard from '@/components/Dashboard';
import Login from '@/components/Login';
import { AuthContext, AuthProvider } from '@/context/AuthContext';
import React, { useContext } from 'react'


function AppContent() {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? <Dashboard /> : <Login />;
}


const index = () => {
  return (
   <AuthProvider>
            <AppContent />
    </AuthProvider>
  )
}

export default index