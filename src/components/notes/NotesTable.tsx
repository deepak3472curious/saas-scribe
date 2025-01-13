import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DecryptedNote } from "@/types/note";

interface NotesTableProps {
  notes: DecryptedNote[];
}

const NotesTable = ({ notes }: NotesTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800/50">
            <TableHead className="text-gray-700 dark:text-gray-300">Title</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map((note) => (
            <TableRow
              key={note.id}
              className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                {note.title}
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">
                {new Date(note.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotesTable;