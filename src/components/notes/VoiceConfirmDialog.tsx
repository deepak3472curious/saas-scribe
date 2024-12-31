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

interface VoiceConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  capturedText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const VoiceConfirmDialog = ({
  open,
  onOpenChange,
  capturedText,
  onConfirm,
  onCancel,
}: VoiceConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Voice Input</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to add the following text to your note?
            <div className="mt-2 p-3 bg-muted rounded-md">
              {capturedText}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Add Text</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VoiceConfirmDialog;