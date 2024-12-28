import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Book, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Note {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Book className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-xl font-bold">Founder's Diary</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate("/notes/new")} className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Notes</h2>
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