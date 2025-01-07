import { useNavigate } from "react-router-dom";
import { DecryptedNote } from "@/types/note";

interface NotesListProps {
  notes: DecryptedNote[];
}

const NotesList = ({ notes }: NotesListProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {notes.map((note) => (
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
};

export default NotesList;