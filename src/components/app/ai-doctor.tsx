
'use client';

import * as React from 'react';
import { Mic, MicOff, User, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { talkToDoctorAction } from '@/app/actions';

interface Message {
  role: 'user' | 'doctor';
  text: string;
  audioUrl?: string;
}

export default function AiDoctor() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const recognitionRef = React.useRef<any>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    // Check for browser support for Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Browser Not Supported',
        description: 'Your browser does not support the Web Speech API for voice recognition.',
      });
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessages((prev) => [...prev, { role: 'user', text: transcript }]);
      handleUserMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      let description = 'An error occurred during speech recognition.';
      if (event.error === 'network') {
        description = 'Network error. Please check your internet connection and try again.';
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        description = 'Microphone access denied. Please allow microphone access in your browser settings.';
      } else if (event.error === 'no-speech') {
        description = 'No speech was detected. Please try again.';
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

  const handleUserMessage = async (text: string) => {
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
      if (data.audioUrl && audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.play();
      }
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
        <Card className="flex-grow flex flex-col">
            <CardContent className="flex-grow p-4 flex flex-col gap-4">
                <ScrollArea className="flex-grow pr-4">
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground pt-10">
                                <Bot className="mx-auto h-12 w-12 mb-2" />
                                <p>I am your AI Doctor. Press the microphone button to start speaking.</p>
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
                <div className="flex justify-center items-center pt-4">
                    <Button
                        size="icon"
                        className={cn("h-20 w-20 rounded-full", isRecording ? "bg-destructive hover:bg-destructive/90" : "bg-accent hover:bg-accent/90")}
                        onClick={toggleRecording}
                        disabled={isLoading}
                    >
                        {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                    </Button>
                </div>
            </CardContent>
        </Card>
        <audio ref={audioRef} className="hidden" />
    </div>
  );
}
