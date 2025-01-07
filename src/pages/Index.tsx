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
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchFilters, type SearchFilters as SearchFiltersType } from "@/components/notes/SearchFilters";

interface EncryptedNote {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  encryption_iv?: string;
}

interface DecryptedNote {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<SearchFiltersType>({
    searchTerm: "",
    dateRange: null,
    sortBy: "newest",
  });

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes", filters],
    queryFn: async () => {
      let query = supabase
        .from("notes")
        .select("*");

      // Apply date range filter if present
      if (filters.dateRange?.from && filters.dateRange?.to) {
        query = query
          .gte('created_at', filters.dateRange.from.toISOString())
          .lte('created_at', filters.dateRange.to.toISOString());
      }

      // Apply sorting
      switch (filters.sortBy) {
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "title":
          query = query.order("title", { ascending: true });
          break;
        default: // "newest"
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      const decryptedNotes = await Promise.all((data as EncryptedNote[]).map(async (note) => {
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

      // Apply search filter after decryption
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return decryptedNotes.filter(note => 
          note.title.toLowerCase().includes(searchLower) ||
          (note.content && note.content.toLowerCase().includes(searchLower))
        );
      }

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

  const NotesList = () => {
    if (isMobile) {
      return (
        <div className="space-y-4">
          {notes?.map((note) => (
            <div
              key={note.id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              <h3 className="font-medium text-gray-900">{note.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(note.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes?.map((note) => (
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
    );
  };

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
          
          <SearchFilters onSearch={setFilters} />
          
          {notes && notes.length > 0 ? (
            <NotesList />
          ) : (
            <div className="text-center py-12">
              <Book className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No notes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.searchTerm ? "Try adjusting your search or filters." : "Get started by creating a new note."}
              </p>
              {!filters.searchTerm && (
                <div className="mt-6">
                  <Button onClick={() => navigate("/notes/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Note
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;