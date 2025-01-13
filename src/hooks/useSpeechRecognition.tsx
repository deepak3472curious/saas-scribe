import { useState, useCallback } from "react";
import { toast } from "sonner";
import { createSpeechRecognition } from "@/utils/speechUtils";
import { SpeechRecognitionState } from "@/types/speech";

export const useSpeechRecognition = (): SpeechRecognitionState => {
  const [isRecording, setIsRecording] = useState(false);
  const [capturedText, setCapturedText] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const startRecording = useCallback((onTextCaptured: (text: string) => void) => {
    console.log('🎤 Starting speech recognition...');
    const newRecognition = createSpeechRecognition();
    if (!newRecognition) {
      console.error('❌ Speech recognition not supported');
      return;
    }

    setRecognition(newRecognition);
    let silenceTimeout: NodeJS.Timeout;
    let hasSpoken = false;

    newRecognition.onstart = () => {
      console.log('🎙️ Speech recognition started');
      silenceTimeout = setTimeout(() => {
        console.log('⏲️ Checking silence timeout:', { hasSpoken, isRecording });
        if (!hasSpoken && isRecording) {
          console.log('🔇 No speech detected, attempting to show toast...');
          toast("No Speech Detected", {
            description: "Please check your microphone and try speaking again.",
            action: {
              label: "Try Again",
              onClick: () => {
                console.log('🔄 Try Again clicked');
                if (newRecognition) {
                  newRecognition.stop();
                  setIsRecording(false);
                  startRecording(onTextCaptured);
                }
              },
            },
          });
          console.log('🛑 Stopping recognition due to silence');
          newRecognition.stop();
          setIsRecording(false);
        }
      }, 5000);
    };

    newRecognition.onresult = (event) => {
      console.log('🗣️ Speech detected!');
      hasSpoken = true;
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(" ");
      console.log('📝 Transcript:', transcript);
      setCapturedText(transcript);
    };

    newRecognition.onend = () => {
      console.log('🏁 Speech recognition ended', { hasSpoken, capturedText });
      clearTimeout(silenceTimeout);
      if (hasSpoken) {
        onTextCaptured(capturedText);
      }
      setIsRecording(false);
    };

    newRecognition.onerror = (event) => {
      console.error('🚨 Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        console.log('⚠️ Showing error toast');
        toast.error("Error", {
          description: "There was an error with speech recognition. Please try again.",
        });
      }
      clearTimeout(silenceTimeout);
      setIsRecording(false);
    };

    try {
      console.log('▶️ Attempting to start recognition');
      newRecognition.start();
      setIsRecording(true);
    } catch (error) {
      console.error('💥 Error starting speech recognition:', error);
      toast.error("Error", {
        description: "Failed to start speech recognition. Please try again.",
      });
      setIsRecording(false);
    }
  }, [capturedText, isRecording]);

  const stopRecording = useCallback(() => {
    console.log('⏹️ Manual stop recording requested');
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  return {
    isRecording,
    capturedText,
    setCapturedText,
    startRecording,
    stopRecording,
  };
};