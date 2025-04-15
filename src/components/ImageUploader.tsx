
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LetterImage } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, X, Image as ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ImageUploaderProps {
  letterId: string;
  maxImages: number;
  images: LetterImage[];
  onImagesChange: (images: LetterImage[]) => void;
}

const ImageUploader = ({ letterId, maxImages, images, onImagesChange }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (images.length + files.length > maxImages) {
      toast.error(`Você pode fazer upload de no máximo ${maxImages} imagens`);
      return;
    }
    
    setIsUploading(true);
    
    try {
      const newImages: LetterImage[] = [...images];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${letterId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('letter_images')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('letter_images')
          .getPublicUrl(filePath);
          
        // Insert record in the letter_images table
        const { data, error } = await supabase
          .from('letter_images')
          .insert({
            letter_id: letterId,
            storage_path: filePath
          })
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        newImages.push({
          id: data.id,
          path: publicUrl
        });
      }
      
      onImagesChange(newImages);
      toast.success("Imagens carregadas com sucesso");
    } catch (error) {
      console.error("Erro ao fazer upload de imagens:", error);
      toast.error("Erro ao fazer upload de imagens");
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };
  
  const handleRemoveImage = async (index: number) => {
    try {
      const imageToRemove = images[index];
      const pathParts = imageToRemove.path.split('letter_images/');
      if (pathParts.length < 2) {
        throw new Error("Caminho da imagem inválido");
      }
      
      const storagePath = pathParts[1];
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('letter_images')
        .remove([storagePath]);
        
      if (storageError) {
        throw storageError;
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('letter_images')
        .delete()
        .eq('id', imageToRemove.id);
        
      if (dbError) {
        throw dbError;
      }
      
      // Update state
      const newImages = [...images];
      newImages.splice(index, 1);
      onImagesChange(newImages);
      
      toast.success("Imagem removida com sucesso");
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      toast.error("Erro ao remover imagem");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200"
          >
            <img 
              src={image.path} 
              alt={`Imagem ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors">
            <div className="flex flex-col items-center justify-center">
              <Plus size={20} className="text-gray-500" />
              <span className="mt-1 text-xs text-gray-500">{images.length}/{maxImages}</span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        )}
      </div>
      
      {isUploading && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin h-4 w-4 border-2 border-love-primary border-t-transparent rounded-full"></div>
          <span>Fazendo upload...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
