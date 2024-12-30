import { Book, Home, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";

const MainNav = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate("/notes")}>
              <Book className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-xl font-bold">Founder's Diary</h1>
            </div>
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
          </div>
          <div className="flex items-center space-x-4">
            {window.location.pathname !== "/auth/login" && (
              <Button variant="outline" onClick={handleLogout} className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;