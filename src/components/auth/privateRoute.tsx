import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/features/hooks";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const rehydrated = useAppSelector((state) => (state as any)._persist?.rehydrated);

  if (!rehydrated) {
    return null; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
