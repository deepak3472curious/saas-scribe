import { toast } from "@/components/ui/use-toast";

export const createSpeechRecognition = () => {
  if (!('webkitSpeechRecognition' in window)) {
    toast({
      title: "Error",
      description: "Speech recognition is not supported in your browser.",
      variant: "destructive",
    });
    return null;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  return recognition;
};

export const handleSilence = (
  hasSpoken: boolean,
  isRecording: boolean,
  recognition: SpeechRecognition | null,
  setIsRecording: (value: boolean) => void,
  startRecording: () => void
) => {
  console.log('Silence timeout triggered');
  console.log('Has spoken:', hasSpoken);
  console.log('Is recording:', isRecording);

  if (!hasSpoken && isRecording) {
    console.log('Showing silence toast');
    toast({
      title: "Are you saying something?",
      description: "I'm not able to recognize anything. Please check your microphone.",
      action: (
        <div className="flex gap-2">
          <button
            onClick={() => {
              console.log('Try Again clicked');
              if (recognition) {
                recognition.stop();
                setIsRecording(false);
                startRecording();
              }
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-xs"
          >
            Try Again
          </button>
          <button
            onClick={() => {
              console.log('Back clicked');
              if (recognition) {
                recognition.stop();
                setIsRecording(false);
              }
            }}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 rounded-md px-3 text-xs"
          >
            Back
          </button>
        </div>
      ),
      variant: "destructive",
    });
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  }
};