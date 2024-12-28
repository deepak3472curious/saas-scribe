import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <FileText className="w-16 h-16 text-primary mb-8" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Founder's Diary
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Your personal space for capturing founder journey insights. Start writing your story today.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth/login")}
            className="text-lg"
          >
            Start Writing Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;