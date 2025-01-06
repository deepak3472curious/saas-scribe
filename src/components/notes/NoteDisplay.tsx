import { Button } from "@/components/ui/button";
import { Note } from "@/types/note";
import { useIsMobile } from "@/hooks/use-mobile";

interface NoteDisplayProps {
  note: Note;
  onEdit: () => void;
}

const NoteDisplay = ({ note, onEdit }: NoteDisplayProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? 'space-y-4' : 'space-y-6'}>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{note.title}</h1>
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
      </div>
      <div className="text-sm text-gray-500">
        Last updated:{" "}
        {note.updated_at ? new Date(note.updated_at).toLocaleDateString() : "N/A"}
      </div>
      <div className="mt-4">
        <Button onClick={onEdit}>Edit Note</Button>
      </div>
    </div>
  );
};

export default NoteDisplay;