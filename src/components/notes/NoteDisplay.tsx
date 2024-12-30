import { Button } from "@/components/ui/button";
import { Note } from "@/types/note";

interface NoteDisplayProps {
  note: Note;
  onEdit: () => void;
}

const NoteDisplay = ({ note, onEdit }: NoteDisplayProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
      </div>
      <div className="mt-6 text-sm text-gray-500">
        Last updated:{" "}
        {note.updated_at ? new Date(note.updated_at).toLocaleDateString() : "N/A"}
      </div>
      <div className="mt-4">
        <Button onClick={onEdit}>Edit Note</Button>
      </div>
    </>
  );
};

export default NoteDisplay;