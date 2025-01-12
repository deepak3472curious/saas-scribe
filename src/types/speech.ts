export type SpeechRecognitionCallback = (text: string) => void;

export type Recognition = SpeechRecognition;

export interface SpeechRecognitionState {
  isRecording: boolean;
  capturedText: string;
  setCapturedText: (text: string) => void;
  startRecording: (onTextCapture: SpeechRecognitionCallback) => void;
  stopRecording: () => void;
}