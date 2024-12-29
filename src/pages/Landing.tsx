import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, BookOpen, Users, Lock } from "lucide-react";
import MainNav from "@/components/MainNav";

const Landing = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <BookOpen className="w-12 h-12 text-primary mb-4" />,
      title: "Document Your Journey",
      description: "Capture your entrepreneurial experiences, decisions, and learnings in one secure place."
    },
    {
      icon: <Users className="w-12 h-12 text-primary mb-4" />,
      title: "Personal Space",
      description: "Your private space to reflect on challenges, victories, and growth moments."
    },
    {
      icon: <Lock className="w-12 h-12 text-primary mb-4" />,
      title: "Secure & Private",
      description: "Your entries are protected and only accessible to you, ensuring complete privacy."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <FileText className="w-16 h-16 text-primary mb-8 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Founder's Diary
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
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