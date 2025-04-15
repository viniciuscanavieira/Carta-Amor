
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Lock, Share2, Pencil } from "lucide-react";

const InfoPage = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-b from-love-peach/50 to-white">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500"
            asChild
          >
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft size={16} />
              <span>Voltar para o início</span>
            </Link>
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Como Funciona
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="rounded-full bg-love-pink/20 p-2 mr-4">
                  <Pencil className="h-6 w-6 text-love-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">1. Escreva sua carta</h2>
                  <p className="text-gray-600">
                    Preencha o formulário com o nome do destinatário, sua mensagem especial e escolha 
                    suas preferências de estilo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="rounded-full bg-love-pink/20 p-2 mr-4">
                  <Lock className="h-6 w-6 text-love-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">2. Opções de privacidade</h2>
                  <p className="text-gray-600">
                    Escolha se deseja enviar anonimamente ou proteger sua carta com uma senha para 
                    maior privacidade.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="rounded-full bg-love-pink/20 p-2 mr-4">
                  <Share2 className="h-6 w-6 text-love-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">3. Compartilhe o link</h2>
                  <p className="text-gray-600">
                    Após enviar, você receberá um link único para sua carta. Compartilhe-o com 
                    o destinatário através de mensagem, e-mail ou redes sociais.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="rounded-full bg-love-pink/20 p-2 mr-4">
                  <Heart className="h-6 w-6 text-love-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">4. Emoção garantida</h2>
                  <p className="text-gray-600">
                    Quando o destinatário abrir o link, verá sua carta com um design 
                    romântico e elegante, pronta para emocionar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild className="bg-gradient-to-r from-love-primary to-love-secondary hover:opacity-90">
            <Link to="/create">Criar Minha Carta Agora</Link>
          </Button>
          
          <p className="mt-4 text-sm text-gray-500">
            Suas cartas são armazenadas localmente no seu navegador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
