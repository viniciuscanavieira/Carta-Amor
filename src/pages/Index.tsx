
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-love-peach to-white">
      <div className="text-center max-w-3xl mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-love-pink p-4">
            <Heart className="h-12 w-12 text-love-red" fill="#ea384c" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">
          Cartas de Amor Secretas
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Expresse seus sentimentos de maneira especial e compartilhe com quem você ama
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 mb-12">
          <Card className="bg-white/70 backdrop-blur border border-love-pink/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Escreva uma carta</h2>
              <p className="text-gray-600 mb-4">
                Componha uma mensagem especial para quem você ama, com ou sem identificação.
              </p>
              <Button 
                onClick={() => navigate("/create")} 
                variant="default" 
                className="w-full bg-gradient-to-r from-love-primary to-love-secondary hover:opacity-90"
              >
                Começar a Escrever
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur border border-love-pink/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Recebeu uma carta?</h2>
              <p className="text-gray-600 mb-4">
                Se você recebeu um link para uma carta de amor, abra-o para ler sua mensagem especial.
              </p>
              <Button 
                onClick={() => navigate("/view")} 
                variant="outline" 
                className="w-full border-love-secondary text-love-secondary hover:bg-love-secondary/10"
              >
                Como Funciona
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Compartilhe emoções, crie memórias.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
