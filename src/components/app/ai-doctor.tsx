
'use client';

import * as React from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
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
  const audioRef = React.useRef<HTMLAudioElement>(null);

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

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
        <Card className="flex-grow flex flex-col">
            <CardContent className="flex-grow p-4 flex flex-col gap-4">
                <ScrollArea className="flex-grow pr-4">
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground pt-10">
                                <Bot className="mx-auto h-12 w-12 mb-2" />
                                <p>I am your AI Doctor. Type your question below.</p>
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
