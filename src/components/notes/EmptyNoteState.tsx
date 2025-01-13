import { Book } from "lucide-react";

interface EmptyNoteStateProps {
  hasSearchTerm: boolean;
}

const EmptyNoteState = ({ hasSearchTerm }: EmptyNoteStateProps) => {
  return (
    <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800">
      <Book className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
        No notes found
      </h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {hasSearchTerm 
          ? "Try adjusting your search or filters." 
          : "Get started by creating a new note."}
      </p>
    </div>
  );
};

export default EmptyNoteState;