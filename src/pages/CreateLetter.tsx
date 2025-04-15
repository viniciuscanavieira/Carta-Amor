
import LetterForm from "@/components/LetterForm";

const CreateLetter = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10 bg-gradient-to-b from-love-peach/50 to-white">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Crie Sua Carta de Amor
        </h1>
        <LetterForm />
      </div>
    </div>
  );
};

export default CreateLetter;
