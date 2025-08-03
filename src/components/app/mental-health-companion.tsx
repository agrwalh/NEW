
'use client';

import * as React from 'react';
import { Send, User, Bot, Loader2, BrainCircuit, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { talkToCompanionAction } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MentalHealthAgentOutput } from '@/ai/flows/mental-health-agent';

interface Message {
  role: 'user' | 'companion';
  text: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  voiceName?: string;
}

const languages: Language[] = [
  { code: 'en-US', name: 'English', flag: '🇺🇸', voiceName: 'Samantha' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸', voiceName: 'Monica' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷', voiceName: 'Amelie' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪', voiceName: 'Anna' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹', voiceName: 'Alice' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷', voiceName: 'Luciana' },
  { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳', voiceName: 'Neha' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵', voiceName: 'Kyoko' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷', voiceName: 'Yuna' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳', voiceName: 'Ting-Ting' },
  { code: 'ar-SA', name: 'العربية', flag: '🇸🇦', voiceName: 'Layla' },
  { code: 'ru-RU', name: 'Русский', flag: '🇷🇺', voiceName: 'Milena' },
];

export default function MentalHealthCompanion() {
  const { toast } = useToast();
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [mood, setMood] = React.useState<MentalHealthAgentOutput['mood'] | null>(null);
  const [speechEnabled, setSpeechEnabled] = React.useState(true);
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>(languages[0]);
  const [availableVoices, setAvailableVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const speechRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  React.useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        // @ts-ignore
      scrollAreaRef.current.children[1].scrollTop = scrollAreaRef.current.children[1].scrollHeight;
    }
  }, [messages]);

  // Text-to-Speech function with language support
  const speakText = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage.code;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Find the best voice for the selected language
    const voices = availableVoices;
    const languageVoices = voices.filter(voice => 
      voice.lang.startsWith(selectedLanguage.code.split('-')[0])
    );
    
    if (languageVoices.length > 0) {
      // Try to find a gentle voice for the selected language
      const gentleVoice = languageVoices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Monica') ||
        voice.name.includes('Amelie') ||
        voice.name.includes('Anna') ||
        voice.name.includes('Alice') ||
        voice.name.includes('Luciana') ||
        voice.name.includes('Neha') ||
        voice.name.includes('Kyoko') ||
        voice.name.includes('Yuna') ||
        voice.name.includes('Ting-Ting') ||
        voice.name.includes('Layla') ||
        voice.name.includes('Milena')
      );
      
      utterance.voice = gentleVoice || languageVoices[0];
    }

    utterance.onerror = () => {
      // Silently handle errors
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      setSelectedLanguage(language);
      stopSpeaking();
      toast({
        title: 'Language Changed',
        description: `Mental Health Companion will now respond in ${language.name}`,
      });
    }
  };

  const toggleSpeech = () => {
    if (speechEnabled) {
      stopSpeaking();
    }
    setSpeechEnabled(!speechEnabled);
    toast({
      title: speechEnabled ? 'Speech Disabled' : 'Speech Enabled',
      description: speechEnabled ? 'Companion responses will no longer be spoken' : 'Companion responses will now be spoken',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const history = messages.map(m => `${m.role}: ${m.text}`);

    // Add language context to the AI request
    const languageContext = `Please respond in ${selectedLanguage.name} (${selectedLanguage.code}). `;
    const { data, error } = await talkToCompanionAction(languageContext + inputValue, history);
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
      
      // Speak the companion response in the selected language
      if (speechEnabled) {
        speakText(data.response);
      }
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
                <div className="flex items-center gap-2">
                    {mood && (
                         <Badge variant={getMoodBadgeVariant(mood)} className="capitalize">
                            Mood: {mood}
                        </Badge>
                    )}
                    <Select value={selectedLanguage.code} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    <span>{selectedLanguage.flag}</span>
                                    <span className="hidden sm:inline">{selectedLanguage.name}</span>
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((language) => (
                                <SelectItem key={language.code} value={language.code}>
                                    <div className="flex items-center gap-2">
                                        <span>{language.flag}</span>
                                        <span>{language.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
            </CardHeader>
            <CardContent className="flex-grow p-4 flex flex-col gap-4">
                <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground pt-10">
                                <BrainCircuit className="mx-auto h-12 w-12 mb-2" />
                                <p>I'm here to listen.</p>
                                <p className="text-xs mt-2">Share what's on your mind. This is a private and non-judgmental space.</p>
                                <p className="text-xs mt-1">Select your preferred language above.</p>
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
                        placeholder={`How are you feeling today in ${selectedLanguage.name}?`}
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
