import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const BottomBar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
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
      </div>
    </div>
  );
};

export default BottomBar;