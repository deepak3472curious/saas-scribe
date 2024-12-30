import { Book, Home, LogOut, User, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const MainNav = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session exists, just update the UI state
        setIsAuthenticated(false);
        navigate('/');
        return;
      }

      // Clear the session from browser storage
      await supabase.auth.signOut();
      
      // Update UI state and navigate
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, we should reset the UI state
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  return (
    <nav className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => navigate(isAuthenticated ? "/notes" : "/")}
            >
              <Book className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-xl font-bold">Founder's Diary</h1>
            </div>
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate("/notes")} className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Notes
                </Button>
                <Button variant="ghost" onClick={() => navigate("/profile")} className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout} className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button variant="outline" onClick={handleLogin} className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;