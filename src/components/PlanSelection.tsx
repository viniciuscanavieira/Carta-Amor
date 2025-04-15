
import { useState } from "react";
import { LetterPlan } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const PLANS: LetterPlan[] = [
  {
    id: "basic",
    name: "Versão Básica",
    price: 4.99,
    maxImages: 2,
    allowsMusic: false,
    allowsVisualEffects: false,
    features: [
      "Upload de até 2 fotos",
      "Escolha de design de fundo",
      "Link único para compartilhamento",
      "Sem música",
      "Sem efeitos visuais"
    ]
  },
  {
    id: "premium",
    name: "Versão Premium",
    price: 9.99,
    maxImages: 5,
    allowsMusic: true,
    allowsVisualEffects: true,
    features: [
      "Upload de até 5 fotos",
      "Escolha de design de fundo",
      "Link único para compartilhamento",
      "Adicione música do YouTube",
      "Efeitos visuais (corações ou confetes)",
    ]
  }
];

interface PlanSelectionProps {
  selectedPlan: string;
  onSelectPlan: (planId: string) => void;
}

const PlanSelection = ({ selectedPlan, onSelectPlan }: PlanSelectionProps) => {
  return (
    <div className="w-full">
      <RadioGroup 
        value={selectedPlan} 
        onValueChange={onSelectPlan}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {PLANS.map((plan) => (
          <div key={plan.id} className="relative">
            <RadioGroupItem 
              value={plan.id} 
              id={`plan-${plan.id}`} 
              className="sr-only"
            />
            <Label
              htmlFor={`plan-${plan.id}`}
              className="cursor-pointer"
            >
              <Card className={`h-full transition-all ${
                selectedPlan === plan.id 
                  ? "border-love-primary ring-2 ring-love-primary ring-opacity-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {selectedPlan === plan.id && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-love-primary text-white">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <CardDescription>
                    R${plan.price.toFixed(2)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <span className="mr-2">
                          {feature.includes("Sem") ? "❌" : "✅"}
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PlanSelection;
export { PLANS };
