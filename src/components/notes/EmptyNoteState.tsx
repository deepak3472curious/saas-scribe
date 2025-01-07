import { Book } from "lucide-react";

interface EmptyNoteStateProps {
  hasSearchTerm: boolean;
}

const EmptyNoteState = ({ hasSearchTerm }: EmptyNoteStateProps) => {
  return (
    <div className="text-center py-12">
      <Book className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No notes found</h3>
      <p className="mt-1 text-sm text-gray-500">
        {hasSearchTerm ? "Try adjusting your search or filters." : "Get started by creating a new note."}
      </p>
    </div>
  );
};

export default EmptyNoteState;