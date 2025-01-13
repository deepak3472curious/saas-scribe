import { Book, Home, LogOut, User, LogIn, Plus, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const MainNav = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' });
      setIsAuthenticated(false);
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        console.error('Server logout error:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    } finally {
      navigate('/');
    }
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLinks = () => (
    <>
      {isAuthenticated && (
        <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex items-center space-x-4'}`}>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/notes")} 
            className="flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Home className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-gray-700 dark:text-gray-200">Notes</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/profile")} 
            className="flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <User className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-gray-700 dark:text-gray-200">Profile</span>
          </Button>
        </div>
      )}
    </>
  );

  const ActionButtons = () => (
    <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex items-center space-x-4'}`}>
      {isAuthenticated && (
        <Button
          variant="default"
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => navigate("/notes/new")}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      )}
      {isAuthenticated ? (
        <Button 
          variant="outline" 
          onClick={handleLogout} 
          className="flex items-center border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <LogOut className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
          Sign Out
        </Button>
      ) : (
        <Button 
          variant="outline" 
          onClick={handleLogin} 
          className="flex items-center border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <LogIn className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
          Sign In
        </Button>
      )}
    </div>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer group" 
              onClick={() => navigate(isAuthenticated ? "/notes" : "/")}
            >
              <Book className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                ThoughtScribe
              </h1>
            </div>
            {!isMobile && <div className="ml-8"><NavLinks /></div>}
          </div>
          
          {isMobile ? (
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          ) : (
            <ActionButtons />
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="px-4 pt-2 pb-4 space-y-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <NavLinks />
          <ActionButtons />
        </div>
      )}
    </nav>
  );
};

export default MainNav;