
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { CustomerData } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerFormProps {
  letterId: string;
  planId: string;
  planPrice: number;
  onBack: () => void;
}

const CustomerForm = ({ letterId, planId, planPrice, onBack }: CustomerFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    email: "",
    name: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerData.email) {
      toast.error("Por favor, informe seu email para continuar.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the create-payment function
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          letterId,
          customerData,
          planId,
          planPrice
        },
      });
      
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("Não foi possível obter o link de pagamento.");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Finalize sua Carta</CardTitle>
        <CardDescription className="text-center">
          Para finalizar o envio da sua carta de amor, informe seus dados para pagamento
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={customerData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="name">Nome (opcional)</Label>
              <Input
                id="name"
                name="name"
                placeholder="Seu nome completo"
                value={customerData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(00) 00000-0000"
                value={customerData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="pt-4">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Ao prosseguir, você será redirecionado para o checkout seguro do Stripe 
                para realizar o pagamento de <strong>R${planPrice.toFixed(2)}</strong> pela sua carta.
              </p>
            </div>
          </div>
          
          <CardFooter className="flex justify-between pt-6 px-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              disabled={isLoading}
            >
              Voltar
            </Button>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                  Processando...
                </>
              ) : (
                'Prosseguir para Pagamento'
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;
