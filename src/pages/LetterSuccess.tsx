
import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/CopyButton";
import { Heart, Share2, CheckCircle, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LetterSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [letterUrl, setLetterUrl] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const paymentSuccess = searchParams.get("payment_success") === "true";
  
  useEffect(() => {
    // Generate the full URL to the letter
    const baseUrl = window.location.origin;
    setLetterUrl(`${baseUrl}/letter/${id}`);
    
    // Fetch payment status from database if letterId exists
    const fetchPaymentStatus = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("paid_letters")
            .select("payment_status")
            .eq("letter_id", id)
            .single();
          
          if (error) {
            console.error("Error fetching payment status:", error);
          } else if (data) {
            setPaymentStatus(data.payment_status);
          }
        } catch (error) {
          console.error("Error in payment status fetch:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchPaymentStatus();
  }, [id]);
  
  const renderPaymentStatusIcon = () => {
    if (isLoading) {
      return <div className="animate-spin h-10 w-10 border-2 border-love-red rounded-full border-t-transparent" />;
    }
    
    if (paymentStatus === "completed") {
      return <CheckCircle className="h-10 w-10 text-green-500" />;
    } else if (paymentStatus === "pending") {
      return <Clock className="h-10 w-10 text-amber-500" />;
    } else if (paymentStatus === "failed") {
      return <XCircle className="h-10 w-10 text-red-500" />;
    }
    
    // Default if no status is available
    return <Heart className="h-10 w-10 text-love-red" fill="#ea384c" />;
  };
  
  const getStatusMessage = () => {
    if (isLoading) return "Verificando status do pagamento...";
    
    if (paymentStatus === "completed") {
      return "Pagamento confirmado!";
    } else if (paymentStatus === "pending") {
      return "Pagamento pendente";
    } else if (paymentStatus === "failed") {
      return "Pagamento não concluído";
    }
    
    return "Sua carta foi criada!";
  };
  
  const getStatusDescription = () => {
    if (isLoading) return "Aguarde um momento enquanto verificamos o status do seu pagamento.";
    
    if (paymentStatus === "completed") {
      return "Seu pagamento foi processado com sucesso. Compartilhe o link abaixo com o destinatário da sua carta de amor.";
    } else if (paymentStatus === "pending") {
      return "Seu pagamento está sendo processado. Você pode compartilhar o link quando o pagamento for confirmado.";
    } else if (paymentStatus === "failed") {
      return "Houve um problema com seu pagamento. Você pode tentar novamente mais tarde.";
    }
    
    return "Compartilhe o link abaixo com o destinatário da sua carta de amor";
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Carta de Amor Secreta",
          text: "Alguém enviou uma carta de amor para você!",
          url: letterUrl,
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert("Compartilhamento não suportado neste navegador. Copie o link manualmente.");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-love-peach/50 to-white">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              {renderPaymentStatusIcon()}
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {getStatusMessage()}
          </CardTitle>
          <CardDescription className="text-center">
            {getStatusDescription()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-md break-all text-sm">
            <p className="font-mono">{letterUrl}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <CopyButton textToCopy={letterUrl} className="flex-1" />
            
            <Button
              variant="outline"
              className="flex items-center gap-1 flex-1"
              onClick={handleShare}
              disabled={paymentStatus === "failed"}
            >
              <Share2 size={16} />
              <span>Compartilhar</span>
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="ghost"
            className="w-full mt-2"
            asChild
          >
            <Link to="/create">Criar outra carta</Link>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            asChild
          >
            <Link to="/">Voltar para o início</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LetterSuccess;
