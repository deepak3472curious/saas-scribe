import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MainNav from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Button
            variant="ghost"
            onClick={() => navigate("/notes")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notes
          </Button>
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {note?.title}
            </h1>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{note?.content}</p>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              Last updated:{" "}
              {note?.updated_at
                ? new Date(note.updated_at).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewNote;