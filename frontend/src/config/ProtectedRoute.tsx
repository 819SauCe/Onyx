import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

type Props = { children: JSX.Element };

export function ProtectedRoute({ children }: Props) {
  const user = useUser();
  if (user === undefined) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
