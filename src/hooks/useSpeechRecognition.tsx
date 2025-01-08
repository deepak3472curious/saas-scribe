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
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      if (!hasSpokenRef.current && isRecording) {
        toast({
          title: "Are you saying something?",
          description: "I'm not able to recognize anything. Please check your microphone.",
          action: (
            <div className="flex gap-2">
              <button
                onClick={() => {
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
      
      if (transcript.trim()) {
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