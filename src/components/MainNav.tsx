import { Book, Home, LogOut, User, LogIn, Plus, Search, Menu, X } from "lucide-react";
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
    </>
  );

  const ActionButtons = () => (
    <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex items-center space-x-4'}`}>
      {isAuthenticated && (
        <>
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => console.log("Search functionality coming soon")}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            className="flex items-center"
            onClick={() => navigate("/notes/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </>
      )}
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
  );

  return (
    <nav className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => navigate(isAuthenticated ? "/notes" : "/")}
            >
              <Book className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-xl font-bold">Founder's Diary</h1>
            </div>
            {!isMobile && <div className="ml-8"><NavLinks /></div>}
          </div>
          
          {isMobile ? (
            <div className="flex items-center">
              <Button variant="ghost" onClick={toggleMobileMenu}>
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
        <div className="px-4 pt-2 pb-4 space-y-4 bg-white border-t">
          <NavLinks />
          <ActionButtons />
        </div>
      )}
    </nav>
  );
};

export default MainNav;