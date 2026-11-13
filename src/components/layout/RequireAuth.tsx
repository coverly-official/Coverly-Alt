import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/Skeleton';

export interface RequireAuthProps {
  children: React.ReactNode;
  allowedRole?: 'buyer' | 'seller' | 'both';
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, allowedRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <Skeleton className="w-16 h-16 rounded-2xl mx-auto" />
          <Skeleton variant="text" className="w-3/4 mx-auto h-5" />
          <Skeleton variant="text" className="w-1/2 mx-auto h-4" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/sign-in?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If role check requested, allow 'both' or match
  if (allowedRole && allowedRole !== 'both' && user.role !== 'both' && user.role !== allowedRole) {
    // Redirect to the appropriate dashboard
    return <Navigate to={user.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer'} replace />;
  }

  return <>{children}</>;
};
