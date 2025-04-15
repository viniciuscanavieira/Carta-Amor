
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface YouTubeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const YouTubeInput = ({ value, onChange }: YouTubeInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  const validateYouTubeUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid
    
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsValid(validateYouTubeUrl(newValue));
  };
  
  const handleBlur = () => {
    if (!isValid) {
      toast.error("URL do YouTube inválida. Por favor, verifique o link.");
      return;
    }
    
    // Extract video ID and convert to embed format if needed
    let formattedUrl = inputValue;
    
    if (formattedUrl) {
      // Convert watch URL to embed URL if needed
      if (formattedUrl.includes('youtube.com/watch?v=')) {
        const videoId = new URL(formattedUrl).searchParams.get('v');
        if (videoId) {
          formattedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
      } else if (formattedUrl.includes('youtu.be/')) {
        const videoId = formattedUrl.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) {
          formattedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
      }
    }
    
    onChange(formattedUrl);
  };
  
  const handleClear = () => {
    setInputValue('');
    onChange('');
    setIsValid(true);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="youtubeUrl">
        Link do YouTube (música de fundo)
      </Label>
      <div className="flex gap-2">
        <Input
          id="youtubeUrl"
          placeholder="https://www.youtube.com/watch?v=..."
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={!isValid ? "border-red-500" : ""}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleClear}
          disabled={!inputValue}
        >
          Limpar
        </Button>
      </div>
      {!isValid && (
        <p className="text-sm text-red-500">
          Por favor, insira um link válido do YouTube
        </p>
      )}
    </div>
  );
};

export default YouTubeInput;
