
'use client';

import * as React from 'react';
import { Send, User, Bot, Loader2, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { talkToCompanionAction } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Badge } from '../ui/badge';
import type { MentalHealthAgentOutput } from '@/ai/flows/mental-health-agent';

interface Message {
  role: 'user' | 'companion';
  text: string;
}

export default function MentalHealthCompanion() {
  const { toast } = useToast();
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [mood, setMood] = React.useState<MentalHealthAgentOutput['mood'] | null>(null);
  
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        // @ts-ignore
      scrollAreaRef.current.children[1].scrollTop = scrollAreaRef.current.children[1].scrollHeight;
    }
  }, [messages]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const history = messages.map(m => `${m.role}: ${m.text}`);

    const { data, error } = await talkToCompanionAction(inputValue, history);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
      // remove the user message if there was an error
      setMessages(prev => prev.slice(0, prev.length -1));
      return;
    }

    if (data) {
      const companionMessage: Message = { role: 'companion', text: data.response };
      setMessages((prev) => [...prev, companionMessage]);
      setMood(data.mood);
    }
  };

  const getMoodBadgeVariant = (mood: MentalHealthAgentOutput['mood'] | null) => {
    switch (mood) {
      case 'Positive':
        return 'default';
      case 'Negative':
        return 'destructive';
      case 'Neutral':
      case 'Mixed':
        return 'secondary';
      default:
        return 'outline';
    }
  };


  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
        <Card className="flex-grow flex flex-col">
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Your Companion</CardTitle>
                    <CardDescription>A safe space to talk and reflect.</CardDescription>
                </div>
                {mood && (
                     <Badge variant={getMoodBadgeVariant(mood)} className="capitalize">
                        Mood: {mood}
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="flex-grow p-4 flex flex-col gap-4">
                <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground pt-10">
                                <BrainCircuit className="mx-auto h-12 w-12 mb-2" />
                                <p>I'm here to listen.</p>
                                <p className="text-xs mt-2">Share what's on your mind. This is a private and non-judgmental space.</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                                {msg.role === 'companion' && (
                                    <Avatar className="h-8 w-8 bg-accent text-accent-foreground">
                                        <AvatarFallback><BrainCircuit className="h-5 w-5"/></AvatarFallback>
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
                                <Avatar className="h-8 w-8 bg-accent text-accent-foreground">
                                    <AvatarFallback><BrainCircuit className="h-5 w-5"/></AvatarFallback>
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
                        placeholder="How are you feeling today?"
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
    </div>
  );
}
