import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setAuthenticated(!!user);
      setLoading(false);
    }

    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!authenticated)
    return <Navigate to="/" />;

  return <>{children}</>;
}