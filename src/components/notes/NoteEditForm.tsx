import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/types/note";
import VoiceInput from "./VoiceInput";
import { useIsMobile } from "@/hooks/use-mobile";

interface NoteEditFormProps {
  note: Note;
  editedTitle: string;
  editedContent: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

const NoteEditForm = ({
  note,
  editedTitle,
  editedContent,
  onTitleChange,
  onContentChange,
  onSave,
  onCancel,
  isSaving,
}: NoteEditFormProps) => {
  const isMobile = useIsMobile();
  
  const handleVoiceCapture = (text: string) => {
    onContentChange(editedContent ? `${editedContent}\n\n${text}` : text);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <Input
          id="title"
          value={editedTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <div className="space-y-2">
          <Textarea
            id="content"
            value={editedContent}
            onChange={(e) => onContentChange(e.target.value)}
            rows={isMobile ? 6 : 8}
            className="w-full"
          />
          <div className="flex justify-start">
            <VoiceInput onTextCapture={handleVoiceCapture} />
          </div>
        </div>
      </div>
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-end space-x-4'}`}>
        <Button
          onClick={onCancel}
          variant="outline"
          className={isMobile ? 'w-full' : ''}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={isSaving}
          className={isMobile ? 'w-full' : ''}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default NoteEditForm;