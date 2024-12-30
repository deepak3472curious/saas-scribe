import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          // Clear any stale session data
          await supabase.auth.signOut({ scope: 'local' });
          navigate("/");
        }
      } catch (error) {
        console.error("Session check error:", error);
        // Clear any stale session data
        await supabase.auth.signOut({ scope: 'local' });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    // Run initial session check
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED' && !session) {
        // If token refresh failed, sign out locally
        await supabase.auth.signOut({ scope: 'local' });
        navigate("/");
      }
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;