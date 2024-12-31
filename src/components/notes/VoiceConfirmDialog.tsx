import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

interface VoiceConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  capturedText: string;
  onConfirm: (text: string) => void;
  onCancel: () => void;
}

const VoiceConfirmDialog = ({
  open,
  onOpenChange,
  capturedText,
  onConfirm,
  onCancel,
}: VoiceConfirmDialogProps) => {
  const [editedText, setEditedText] = useState(capturedText);

  // Update editedText when capturedText changes
  useState(() => {
    setEditedText(capturedText);
  }, [capturedText]);

  const handleConfirm = () => {
    onConfirm(editedText);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Review and Edit Voice Input</AlertDialogTitle>
          <AlertDialogDescription>
            Review and edit the captured text before adding it to your note:
            <div className="mt-2">
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="min-h-[100px]"
                placeholder="Edit your captured text here..."
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Add Text</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VoiceConfirmDialog;