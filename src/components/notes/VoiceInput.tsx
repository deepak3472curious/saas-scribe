import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, RefreshCw } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import VoiceConfirmDialog from "./VoiceConfirmDialog";
import { Toaster } from "@/components/ui/sonner";

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

  const handleConfirm = (editedText: string) => {
    onTextCapture(editedText);
    setCapturedText("");
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setCapturedText("");
    setShowConfirmDialog(false);
  };

  const handleRetry = () => {
    setCapturedText("");
    handleStartRecording();
  };

  return (
    <>
      <Toaster />
      <div className="flex gap-2">
        {isRecording ? (
          <Button
            type="button"
            variant="outline"
            onClick={stopRecording}
            className="flex items-center gap-2"
          >
            <Square className="h-4 w-4" />
            Stop Recording
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleStartRecording}
              className="flex items-center gap-2"
            >
              <Mic className="h-4 w-4" />
              Voice to Text
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </>
        )}
      </div>

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