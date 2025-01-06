import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MainNav from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import NoteDisplay from "@/components/notes/NoteDisplay";
import NoteEditForm from "@/components/notes/NoteEditForm";
import { Note } from "@/types/note";
import { useIsMobile } from "@/hooks/use-mobile";

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const isMobile = useIsMobile();

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Note;
    },
    meta: {
      onSettled: (data) => {
        if (data) {
          setEditedTitle(data.title);
          setEditedContent(data.content || "");
        }
      }
    }
  });

  const updateNoteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notes")
        .update({
          title: editedTitle,
          content: editedContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note", id] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
      console.error("Error updating note:", error);
    },
  });

  const handleSave = async () => {
    if (!editedTitle.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    updateNoteMutation.mutate();
  };

  const handleEdit = () => {
    setEditedTitle(note?.title || "");
    setEditedContent(note?.content || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedTitle(note?.title || "");
    setEditedContent(note?.content || "");
    setIsEditing(false);
  };

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
      <main className={`max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24 ${isMobile ? 'px-4' : ''}`}>
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/notes")}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Notes
            </Button>
          </div>
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            {note && (
              isEditing ? (
                <NoteEditForm
                  note={note}
                  editedTitle={editedTitle}
                  editedContent={editedContent}
                  onTitleChange={setEditedTitle}
                  onContentChange={setEditedContent}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  isSaving={updateNoteMutation.isPending}
                />
              ) : (
                <NoteDisplay
                  note={note}
                  onEdit={handleEdit}
                />
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewNote;
