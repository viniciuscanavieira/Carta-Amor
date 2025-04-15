
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LoveLetter } from "@/types";
import { getLetter } from "@/utils/letterUtils";
import LetterDisplay from "@/components/LetterDisplay";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ViewLetter = () => {
  const { id } = useParams<{ id: string }>();
  const [letter, setLetter] = useState<LoveLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (id) {
      const fetchedLetter = getLetter(id);
      
      if (fetchedLetter) {
        setLetter(fetchedLetter);
      } else {
        setError("Carta não encontrada. O link pode estar incorreto ou a carta foi removida.");
      }
      
      setLoading(false);
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-love-peach/30 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-love-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando sua carta especial...</p>
        </div>
      </div>
    );
  }
  
  if (error || !letter) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-love-peach/30 to-white">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Ops!</h1>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center">
            <Button asChild>
              <Link to="/">Voltar para o início</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-b from-love-peach/30 to-white">
      <div className="container max-w-4xl mx-auto flex-1 flex flex-col">
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
        
        <div className="flex-1 flex items-center justify-center">
          <LetterDisplay letter={letter} />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Deseja escrever sua própria carta? <Link to="/create" className="text-love-primary hover:underline">Clique aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewLetter;
