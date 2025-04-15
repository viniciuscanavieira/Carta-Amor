
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const LETTER_TYPES = [
  { id: "romantic", name: "Carta romântica" },
  { id: "apology", name: "Carta de desculpas" },
  { id: "surprise", name: "Carta anônima surpresa" },
  { id: "friendship", name: "Carta de amizade" },
  { id: "reconciliation", name: "Carta de reconciliação" }
];

interface LetterTypeSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

const LetterTypeSelection = ({ value, onChange }: LetterTypeSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="letterType">Tipo de carta</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="letterType">
          <SelectValue placeholder="Selecione o tipo de carta" />
        </SelectTrigger>
        <SelectContent>
          {LETTER_TYPES.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LetterTypeSelection;
export { LETTER_TYPES };
