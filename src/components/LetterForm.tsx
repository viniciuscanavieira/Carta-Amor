
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoveLetter, LetterImage, LetterSettings } from "@/types";
import { saveLetter, generateUniqueId, getBackgroundStyles } from "@/utils/letterUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerForm from "./CustomerForm";
import { toast } from "@/components/ui/sonner";
import PlanSelection, { PLANS } from "./PlanSelection";
import LetterTypeSelection, { LETTER_TYPES } from "./LetterTypeSelection";
import ImageUploader from "./ImageUploader";
import YouTubeInput from "./YouTubeInput";
import VisualEffectSelector from "./VisualEffectSelector";
import { supabase } from "@/integrations/supabase/client";

const LetterForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<"plan" | "letter" | "payment">("plan");
  const [letterId, setLetterId] = useState<string>("");
  const [images, setImages] = useState<LetterImage[]>([]);
  
  const [formData, setFormData] = useState<Omit<LoveLetter, "id" | "createdAt">>({
    sender: "",
    recipient: "",
    content: "",
    signature: "",
    isAnonymous: false,
    password: "",
    backgroundStyle: "default",
    letterType: LETTER_TYPES[0].id,
  });
  
  const [letterSettings, setLetterSettings] = useState<LetterSettings>({
    youtubeUrl: "",
    visualEffect: null,
  });
  
  const [planId, setPlanId] = useState<string>(PLANS[0].id);
  const [isProtected, setIsProtected] = useState(false);
  const backgroundStyles = getBackgroundStyles();
  const selectedPlan = PLANS.find(plan => plan.id === planId) || PLANS[0];

  // Check if coming back from a cancelled payment
  if (searchParams.get("payment_cancelled") === "true") {
    toast.error("Pagamento cancelado. Você pode tentar novamente quando estiver pronto.");
    // Remove the query parameter to prevent showing the toast multiple times
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("payment_cancelled");
    navigate(`/create?${newParams.toString()}`, { replace: true });
  }

  useEffect(() => {
    // Generate a unique ID for the letter when component mounts
    const newLetterId = generateUniqueId();
    setLetterId(newLetterId);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleBackgroundChange = (style: string) => {
    setFormData((prev) => ({ ...prev, backgroundStyle: style }));
  };

  const handleContinueFromPlan = () => {
    setStep("letter");
  };

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipient || !formData.content) {
      toast.error("Por favor, preencha pelo menos o nome do destinatário e o conteúdo da carta.");
      return;
    }
    
    // Create the letter object
    const letter: LoveLetter = {
      id: letterId,
      sender: formData.sender,
      recipient: formData.recipient,
      content: formData.content,
      signature: formData.signature,
      isAnonymous: formData.isAnonymous,
      password: isProtected ? formData.password : undefined,
      backgroundStyle: formData.backgroundStyle,
      letterType: formData.letterType,
      createdAt: Date.now(),
    };
    
    // Save the letter locally
    saveLetter(letter);
    
    // Save letter settings to Supabase if using premium features
    if (selectedPlan.id === "premium" && 
        (letterSettings.youtubeUrl || letterSettings.visualEffect)) {
      try {
        await supabase.from("letter_settings").insert({
          letter_id: letterId,
          youtube_music_url: letterSettings.youtubeUrl || null,
          visual_effect: letterSettings.visualEffect || null
        });
      } catch (error) {
        console.error("Error saving letter settings:", error);
        // Continue anyway - this shouldn't block the user
      }
    }
    
    // Move to payment step
    setStep("payment");
  };

  const handleBackToLetter = () => {
    setStep("letter");
  };

  const handleBackToPlan = () => {
    setStep("plan");
  };

  if (step === "plan") {
    return (
      <Card className="max-w-3xl w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Escolha seu Plano</CardTitle>
          <CardDescription className="text-center">
            Selecione o plano que melhor atende às suas necessidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlanSelection
            selectedPlan={planId}
            onSelectPlan={setPlanId}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="button" 
            onClick={handleContinueFromPlan}
          >
            Continuar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (step === "letter") {
    return (
      <Card className="max-w-3xl w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Escreva sua Carta de Amor</CardTitle>
          <CardDescription className="text-center">
            Escreva uma mensagem especial para aquela pessoa que significa tudo para você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContinueToPayment}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {selectedPlan.name} - R${selectedPlan.price.toFixed(2)}
                </h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleBackToPlan}
                >
                  Alterar Plano
                </Button>
              </div>

              <LetterTypeSelection 
                value={formData.letterType || LETTER_TYPES[0].id} 
                onChange={(value) => setFormData(prev => ({ ...prev, letterType: value }))}
              />
              
              <div className="space-y-2">
                <Label htmlFor="recipient">Para quem é esta carta?</Label>
                <Input
                  id="recipient"
                  name="recipient"
                  placeholder="Nome do destinatário"
                  value={formData.recipient}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sender">Seu nome</Label>
                <Input
                  id="sender"
                  name="sender"
                  placeholder={formData.isAnonymous ? "Anônimo" : "Seu nome"}
                  value={formData.sender}
                  onChange={handleChange}
                  disabled={formData.isAnonymous}
                />
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    id="isAnonymous"
                    checked={formData.isAnonymous}
                    onCheckedChange={(checked) => handleToggleChange("isAnonymous", checked)}
                  />
                  <Label htmlFor="isAnonymous">Enviar como anônimo</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Sua mensagem</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Escreva sua mensagem especial aqui..."
                  rows={8}
                  value={formData.content}
                  onChange={handleChange}
                  required
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signature">Assinatura ou mensagem final (opcional)</Label>
                <Input
                  id="signature"
                  name="signature"
                  placeholder="Com amor, carinho, etc..."
                  value={formData.signature}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Fotos (opcional)</Label>
                <ImageUploader 
                  letterId={letterId}
                  maxImages={selectedPlan.maxImages}
                  images={images}
                  onImagesChange={setImages}
                />
              </div>
              
              {selectedPlan.allowsMusic && (
                <YouTubeInput 
                  value={letterSettings.youtubeUrl || ""}
                  onChange={(url) => setLetterSettings(prev => ({ ...prev, youtubeUrl: url }))}
                />
              )}
              
              {selectedPlan.allowsVisualEffects && (
                <VisualEffectSelector 
                  value={letterSettings.visualEffect}
                  onChange={(effect) => setLetterSettings(prev => ({ ...prev, visualEffect: effect }))}
                />
              )}
              
              <div className="space-y-2">
                <Label>Estilo de fundo</Label>
                <Tabs defaultValue="default" className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                    {backgroundStyles.map((style) => (
                      <TabsTrigger
                        key={style.id}
                        value={style.id}
                        onClick={() => handleBackgroundChange(style.id)}
                      >
                        {style.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {backgroundStyles.map((style) => (
                    <TabsContent key={style.id} value={style.id}>
                      <div className={`h-20 rounded-md ${style.className} flex items-center justify-center`}>
                        <span className="text-sm font-medium">Visualização</span>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isProtected"
                    checked={isProtected}
                    onCheckedChange={setIsProtected}
                  />
                  <Label htmlFor="isProtected">Proteger carta com senha</Label>
                </div>
                
                {isProtected && (
                  <div className="pt-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Digite uma senha para proteger sua carta"
                      value={formData.password}
                      onChange={handleChange}
                      required={isProtected}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <CardFooter className="flex justify-between pt-6 px-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBackToPlan}
              >
                Voltar
              </Button>
              <Button type="submit">
                Continuar para Pagamento
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    );
  }
  
  if (step === "payment") {
    return (
      <CustomerForm 
        letterId={letterId} 
        planId={planId}
        planPrice={selectedPlan.price}
        onBack={handleBackToLetter} 
      />
    );
  }
  
  // This should never happen but TypeScript wants it
  return null;
};

export default LetterForm;
