import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [capturedText, setCapturedText] = useState("");
  const { toast } = useToast();
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSpokenRef = useRef(false);

  const resetSilenceTimeout = useCallback(() => {
    console.log('Resetting silence timeout');
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      console.log('Silence timeout triggered');
      console.log('Has spoken:', hasSpokenRef.current);
      console.log('Is recording:', isRecording);
      
      if (!hasSpokenRef.current && isRecording) {
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
                    startRecording(() => {});
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
        stopRecording();
      }
    }, 4000); // 4 seconds of silence
  }, [isRecording, toast]);

  const startRecording = useCallback((onTextCaptured: (text: string) => void) => {
    console.log('Starting recording');
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    hasSpokenRef.current = false;
    resetSilenceTimeout();

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      console.log('Transcript received:', transcript);
      if (transcript.trim()) {
        console.log('Valid transcript detected, marking as spoken');
        hasSpokenRef.current = true;
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
      }
      
      setCapturedText(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast({
        title: "Error",
        description: "An error occurred during voice recognition.",
        variant: "destructive",
      });
      stopRecording();
    };

    recognition.onend = () => {
      console.log('Recognition ended');
      console.log('Final captured text:', capturedText);
      console.log('Has spoken:', hasSpokenRef.current);
      if (capturedText && hasSpokenRef.current) {
        onTextCaptured(capturedText);
      }
      setIsRecording(false);
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };

    recognition.start();
    setRecognition(recognition);
    setIsRecording(true);
  }, [capturedText, toast, resetSilenceTimeout]);

  const stopRecording = useCallback(() => {
    console.log('Stopping recording');
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
  }, [recognition]);

  return {
    isRecording,
    capturedText,
    setCapturedText,
    startRecording,
    stopRecording
  };
};