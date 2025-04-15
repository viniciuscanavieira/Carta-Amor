
import { useState, useEffect } from "react";
import { LoveLetter, LetterImage, LetterSettings } from "@/types";
import { getBackgroundStyles } from "@/utils/letterUtils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import "../styles/effects.css";

interface LetterDisplayProps {
  letter: LoveLetter;
}

const LetterDisplay = ({ letter }: LetterDisplayProps) => {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(!letter.password);
  const [error, setError] = useState("");
  const [letterImages, setLetterImages] = useState<LetterImage[]>([]);
  const [letterSettings, setLetterSettings] = useState<LetterSettings | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const backgroundStyles = getBackgroundStyles();
  const selectedStyle = backgroundStyles.find(style => style.id === letter.backgroundStyle) || backgroundStyles[0];
  
  useEffect(() => {
    const fetchLetterData = async () => {
      setLoading(true);
      try {
        // Fetch letter images
        const { data: imagesData } = await supabase
          .from("letter_images")
          .select("id, storage_path")
          .eq("letter_id", letter.id);
          
        if (imagesData && imagesData.length > 0) {
          const processedImages = imagesData.map(img => ({
            id: img.id,
            path: supabase.storage.from("letter_images").getPublicUrl(img.storage_path).data.publicUrl
          }));
          setLetterImages(processedImages);
        }
        
        // Fetch letter settings
        const { data: settingsData } = await supabase
          .from("letter_settings")
          .select("*")
          .eq("letter_id", letter.id)
          .maybeSingle();
          
        if (settingsData) {
          setLetterSettings({
            youtubeUrl: settingsData.youtube_music_url,
            visualEffect: settingsData.visual_effect as any
          });
        }
      } catch (error) {
        console.error("Error fetching letter data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLetterData();
    
    // Set up interval for image slideshow if there are multiple images
    let slideshowInterval: number | undefined;
    
    if (letterImages.length > 1) {
      slideshowInterval = window.setInterval(() => {
        setCurrentImageIndex(prevIndex => 
          prevIndex === letterImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change image every 5 seconds
    }
    
    return () => {
      if (slideshowInterval) {
        clearInterval(slideshowInterval);
      }
    };
  }, [letter.id, letterImages.length]);
  
  const handleUnlock = () => {
    if (password === letter.password) {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
  };
  
  if (!isUnlocked) {
    return (
      <Card className="max-w-2xl w-full mx-auto">
        <CardHeader>
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-love-primary" />
            <h2 className="text-2xl font-semibold mt-4">Esta carta está protegida</h2>
            <p className="text-muted-foreground">Digite a senha para ler a mensagem</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button 
              onClick={handleUnlock} 
              className="w-full"
            >
              Desbloquear
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getVisualEffectClass = () => {
    if (!letterSettings || !letterSettings.visualEffect) return "";
    
    switch(letterSettings.visualEffect) {
      case "hearts": return "hearts-effect";
      case "confetti": return "confetti-effect";
      default: return "";
    }
  };
  
  return (
    <Card className={`max-w-2xl w-full mx-auto overflow-hidden ${selectedStyle.className}`}>
      {letterSettings?.youtubeUrl && (
        <div className="absolute top-0 left-0 w-full h-0 pb-[56.25%]">
          <iframe 
            src={`${letterSettings.youtubeUrl}?autoplay=1&controls=0&showinfo=0&mute=0&loop=1&playlist=${
              letterSettings.youtubeUrl.split("/").pop()
            }`}
            className="absolute top-0 left-0 w-full h-full opacity-0"
            allow="autoplay; encrypted-media"
            title="YouTube music"
          ></iframe>
        </div>
      )}
      
      <CardContent className={`p-6 md:p-8 relative ${getVisualEffectClass()}`}>
        {!loading && letterImages.length > 0 && (
          <div className="mb-6 flex justify-center">
            <div className="w-full max-w-md h-64 relative rounded-lg overflow-hidden shadow-md">
              <img 
                src={letterImages[currentImageIndex].path} 
                alt="Imagem da carta" 
                className="w-full h-full object-cover"
              />
              
              {letterImages.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {letterImages.map((_, index) => (
                    <button 
                      key={index} 
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-lg">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-medium">Para {letter.recipient},</h2>
            </div>
            
            <div className="prose prose-sm md:prose-base mx-auto">
              {letter.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
            
            {letter.signature && (
              <div className="text-right italic mt-8">
                <p>{letter.signature}</p>
              </div>
            )}
            
            <CardFooter className="pt-6 px-0 flex justify-end">
              <p className="text-sm text-muted-foreground">
                De: {letter.isAnonymous ? "Alguém especial" : letter.sender}
              </p>
            </CardFooter>
          </div>
        </div>
        
        {/* Visual effects elements */}
        {letterSettings?.visualEffect === "hearts" && (
          <div className="hearts-container">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="heart"></div>
            ))}
          </div>
        )}
        
        {letterSettings?.visualEffect === "confetti" && (
          <div className="confetti-container">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="confetti"></div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LetterDisplay;
