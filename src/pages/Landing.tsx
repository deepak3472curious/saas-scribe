import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, BookOpen, Users, Lock } from "lucide-react";
import MainNav from "@/components/MainNav";

const Landing = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <BookOpen className="w-12 h-12 text-primary mb-4" />,
      title: "Brain Dump",
      description: "Transform your thoughts into organized insights and actionable plans."
    },
    {
      icon: <Users className="w-12 h-12 text-primary mb-4" />,
      title: "Personal AI Assistant",
      description: "Let AI help you organize and make sense of your daily thoughts and ideas."
    },
    {
      icon: <Lock className="w-12 h-12 text-primary mb-4" />,
      title: "Private & Secure",
      description: "Your thoughts are yours - we keep them private and secure."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <FileText className="w-16 h-16 text-primary mb-8 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Clear Your Mind.<br />
            <span className="text-primary">Focus Your Day</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Feeling overwhelmed? Brain dump your thoughts and let AI transform them into personalized insights and actionable to-dos.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth/login")}
            className="text-lg"
          >
            Declutter Your Mind
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;