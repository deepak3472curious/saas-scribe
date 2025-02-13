import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import MainNav from "@/components/MainNav";
import VoiceInput from "@/components/notes/VoiceInput";
import { encryptText } from "@/utils/encryption";

const NewNote = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }
      setUserId(user.id);
    };

    getUserId();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to create notes",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Encrypt title and content
      const { encryptedText: encryptedTitle, iv: titleIv } = await encryptText(title);
      let encryptedContent = null;
      let contentIv = null;
      
      if (content) {
        const result = await encryptText(content);
        encryptedContent = result.encryptedText;
        contentIv = result.iv;
      }

      // Create the note with encrypted data
      const { error } = await supabase.from("notes").insert({
        title: encryptedTitle,
        content: encryptedContent,
        user_id: userId,
        encryption_iv: JSON.stringify({
          title: titleIv,
          content: contentIv
        })
      });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Note created successfully",
      });
      navigate("/notes");
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceCapture = (text: string) => {
    setContent(content ? `${content}\n\n${text}` : text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Note</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <div className="space-y-2">
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1"
                  rows={8}
                />
                <div className="flex justify-start">
                  <VoiceInput onTextCapture={handleVoiceCapture} />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/notes")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Note"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewNote;