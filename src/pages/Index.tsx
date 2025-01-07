import { Book } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MainNav from "@/components/MainNav";
import { decryptText } from "@/utils/encryption";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchFilters, type SearchFilters as SearchFiltersType } from "@/components/notes/SearchFilters";
import NotesTable from "@/components/notes/NotesTable";
import NotesList from "@/components/notes/NotesList";
import EmptyNoteState from "@/components/notes/EmptyNoteState";
import { DecryptedNote } from "@/types/note";

interface EncryptedNote {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
  encryption_iv?: string;
}

const Index = () => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<SearchFiltersType>({
    searchTerm: "",
    dateRange: undefined,
    sortBy: "newest",
  });

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes", filters],
    queryFn: async () => {
      let query = supabase
        .from("notes")
        .select("*");

      if (filters.dateRange?.from && filters.dateRange?.to) {
        query = query
          .gte('created_at', filters.dateRange.from.toISOString())
          .lte('created_at', filters.dateRange.to.toISOString());
      }

      switch (filters.sortBy) {
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "title":
          query = query.order("title", { ascending: true });
          break;
        default:
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

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Your Notes</h2>
          </div>
          
          <SearchFilters onSearch={setFilters} />
          
          {notes && notes.length > 0 ? (
            isMobile ? <NotesList notes={notes} /> : <NotesTable notes={notes} />
          ) : (
            <EmptyNoteState hasSearchTerm={!!filters.searchTerm} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;