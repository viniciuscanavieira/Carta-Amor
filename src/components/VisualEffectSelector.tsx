
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";

const VISUAL_EFFECTS = [
  { id: "hearts", name: "Corações flutuantes" },
  { id: "confetti", name: "Confetes coloridos" }
];

interface VisualEffectSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const VisualEffectSelector = ({ value, onChange }: VisualEffectSelectorProps) => {
  const handleValueChange = (newValue: string) => {
    // Toggle off if clicking the same value
    if (newValue === value) {
      onChange(null);
    } else {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Efeito visual</Label>
      <ToggleGroup 
        type="single" 
        value={value || undefined}
        onValueChange={handleValueChange}
        className="justify-start"
      >
        {VISUAL_EFFECTS.map((effect) => (
          <ToggleGroupItem 
            key={effect.id} 
            value={effect.id}
            aria-label={effect.name}
            className="px-3 py-2"
          >
            {effect.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default VisualEffectSelector;
