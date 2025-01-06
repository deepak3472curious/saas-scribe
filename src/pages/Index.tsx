import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Book } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MainNav from "@/components/MainNav";
import { decryptText } from "@/utils/encryption";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EncryptedNote {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  encryption_iv?: string; // Made optional with ?
}

interface DecryptedNote {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedNote, setSelectedNote] = useState<DecryptedNote | null>(null);

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Decrypt the notes
      const decryptedNotes = await Promise.all((data as EncryptedNote[]).map(async (note) => {
        // Handle cases where encryption_iv might be undefined
        if (!note.encryption_iv) {
          return {
            ...note,
            title: note.title,
            content: note.content,
          };
        }

        const ivs = JSON.parse(note.encryption_iv);
        const decryptedTitle = await decryptText(note.title, ivs.title);
        const decryptedContent = note.content ? await decryptText(note.content, ivs.content) : null;

        return {
          ...note,
          title: decryptedTitle,
          content: decryptedContent,
        };
      }));

      return decryptedNotes as DecryptedNote[];
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Your Notes</h2>
            <Button onClick={() => navigate("/notes/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>
          {notes && notes.length > 0 ? (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notes.map((note) => (
                    <TableRow
                      key={note.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/notes/${note.id}`)}
                    >
                      <TableCell className="font-medium">{note.title}</TableCell>
                      <TableCell>
                        {new Date(note.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Book className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No notes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new note.
              </p>
              <div className="mt-6">
                <Button onClick={() => navigate("/notes/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Note
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;