import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { createSpeechRecognition } from "@/utils/speechUtils";
import type { SpeechRecognitionState, SpeechRecognitionCallback } from "@/types/speech";

export const useSpeechRecognition = (): SpeechRecognitionState => {
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
          title: "No Speech Detected",
          description: "Please check your microphone and try speaking again.",
          variant: "destructive",
        });
        if (recognition) {
          recognition.stop();
          setIsRecording(false);
        }
      }
    }, 4000);
  }, [isRecording, recognition, toast]);

  const startRecording = useCallback((onTextCaptured: SpeechRecognitionCallback) => {
    console.log('Starting recording');
    const newRecognition = createSpeechRecognition();
    if (!newRecognition) return;

    hasSpokenRef.current = false;
    resetSilenceTimeout();

    newRecognition.onresult = (event) => {
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

    newRecognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast({
        title: "Error",
        description: "An error occurred during voice recognition.",
        variant: "destructive",
      });
      stopRecording();
    };

    newRecognition.onend = () => {
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

    newRecognition.start();
    setRecognition(newRecognition);
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