
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
}

const CopyButton = ({ textToCopy, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={`flex items-center gap-1 ${className}`} 
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check size={16} className="text-green-500" />
          <span>Copiado!</span>
        </>
      ) : (
        <>
          <Copy size={16} />
          <span>Copiar Link</span>
        </>
      )}
    </Button>
  );
};

export default CopyButton;
