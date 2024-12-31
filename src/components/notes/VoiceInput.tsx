import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import VoiceConfirmDialog from "./VoiceConfirmDialog";

interface VoiceInputProps {
  onTextCapture: (text: string) => void;
}

const VoiceInput = ({ onTextCapture }: VoiceInputProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const {
    isRecording,
    capturedText,
    setCapturedText,
    startRecording,
    stopRecording
  } = useSpeechRecognition();

  const handleStartRecording = () => {
    startRecording((text) => {
      setShowConfirmDialog(true);
    });
  };

  const handleConfirm = () => {
    onTextCapture(capturedText);
    setCapturedText("");
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setCapturedText("");
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={isRecording ? stopRecording : handleStartRecording}
        className="flex items-center gap-2"
      >
        {isRecording ? (
          <>
            <Square className="h-4 w-4" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            Record Voice
          </>
        )}
      </Button>

      <VoiceConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        capturedText={capturedText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default VoiceInput;