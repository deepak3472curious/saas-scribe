import { Recognition } from "@/types/speech";

interface SpeechRecognitionToastActionsProps {
  recognition: Recognition | null;
  setIsRecording: (value: boolean) => void;
  startRecording: (callback: (text: string) => void) => void;
  onTextCaptured: (text: string) => void;
}

const SpeechRecognitionToastActions = ({
  recognition,
  setIsRecording,
  startRecording,
  onTextCaptured,
}: SpeechRecognitionToastActionsProps) => {
  const handleTryAgain = () => {
    console.log('Try Again clicked');
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      startRecording(onTextCaptured);
    }
  };

  const handleGoBack = () => {
    console.log('Back clicked');
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleTryAgain}
        className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-xs"
      >
        Try Again
      </button>
      <button
        onClick={handleGoBack}
        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 rounded-md px-3 text-xs"
      >
        Go Back
      </button>
    </div>
  );
};

export default SpeechRecognitionToastActions;