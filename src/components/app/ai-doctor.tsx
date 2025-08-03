
'use client';

import * as React from 'react';
import { Send, User, Bot, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { talkToDoctorAction } from '@/app/actions';
import { Input } from '@/components/ui/input';

interface Message {
  role: 'user' | 'doctor';
  text: string;
  audioUrl?: string;
}

export default function AiDoctor() {
  const { toast } = useToast();
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [speechEnabled, setSpeechEnabled] = React.useState(true);

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const recognitionRef = React.useRef<any>(null);
  const speechRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: "Your browser doesn't support speech recognition. Please use Chrome or Safari.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleUserMessage(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      let description = 'An error occurred during speech recognition.';
      if (event.error === 'network') {
        description = 'Network error. Please check your internet connection and try again.';
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        description = "Microphone access denied. Please allow microphone access in your browser settings.";
      } else if (event.error === 'no-speech') {
        description = "No speech was detected. Please try again.";
      }
      
      toast({
        variant: 'destructive',
        title: 'Recognition Error',
        description: description,
      });
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    }

    recognitionRef.current = recognition;
  }, [toast]);

  // Text-to-Speech function
  const speakText = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to use a female voice for the AI doctor
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Victoria')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInputValue('');
    setIsLoading(true);

    const { data, error } = await talkToDoctorAction(text);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
      return;
    }

    if (data) {
      setMessages((prev) => [...prev, { role: 'doctor', text: data.response, audioUrl: data.audioUrl }]);
      
      // Speak the AI response
      if (speechEnabled) {
        speakText(data.response);
      }
      
      if (data.audioUrl && audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.play();
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUserMessage(inputValue);
  }

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e: any) {
        toast({
          variant: 'destructive',
          title: 'Could not start recording',
          description: 'Please ensure microphone permissions are granted and try again.',
        });
        setIsRecording(false);
      }
    }
  };

  const toggleSpeech = () => {
    if (speechEnabled) {
      stopSpeaking();
    }
    setSpeechEnabled(!speechEnabled);
    toast({
      title: speechEnabled ? 'Speech Disabled' : 'Speech Enabled',
      description: speechEnabled ? 'AI responses will no longer be spoken' : 'AI responses will now be spoken',
    });
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
        <Card className="flex-grow flex flex-col">
            <CardContent className="flex-grow p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">AI Doctor</h2>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={toggleSpeech}
                        className={cn(
                            "shrink-0",
                            speechEnabled ? "text-primary" : "text-muted-foreground"
                        )}
                        disabled={isLoading}
                    >
                        {speechEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    </Button>
                </div>
                <ScrollArea className="flex-grow pr-4">
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground pt-10">
                                <Bot className="mx-auto h-12 w-12 mb-2" />
                                <p>I am your AI Doctor. Ask me a question.</p>
                                <p className="text-xs mt-2">I can provide general health information and precautions. I am not a real doctor and this is not medical advice.</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                                {msg.role === 'doctor' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("max-w-[75%] rounded-lg p-3 text-sm", msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    <p>{msg.text}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3 justify-start">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-lg p-3">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4">
                    <Input 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask the AI Doctor a question..."
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        size="icon"
                        onClick={handleMicClick}
                        className={cn("shrink-0", isRecording ? "bg-destructive hover:bg-destructive/90" : "bg-accent hover:bg-accent/90")}
                        disabled={isLoading}
                    >
                        {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    <Button
                        type="submit"
                        size="icon"
                        className="bg-accent hover:bg-accent/90 shrink-0"
                        disabled={isLoading || !inputValue.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </CardContent>
        </Card>
        <audio ref={audioRef} className="hidden" />
    </div>
  );
}
