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
  );
};

export default NotesTable;