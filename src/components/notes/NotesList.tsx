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
          className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg cursor-pointer 
                   hover:shadow-xl transition-all duration-200 border border-gray-100 
                   dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800"
          onClick={() => navigate(`/notes/${note.id}`)}
        >
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{note.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {new Date(note.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NotesList;