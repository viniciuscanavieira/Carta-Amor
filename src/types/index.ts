
export interface LoveLetter {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  signature?: string;
  isAnonymous: boolean;
  password?: string;
  createdAt: number;
  backgroundStyle?: string;
  letterType?: string;
}

export interface CustomerData {
  email: string;
  name?: string;
  phone?: string;
}

export interface LetterImage {
  id: string;
  path: string;
}

export interface LetterSettings {
  youtubeUrl?: string;
  visualEffect?: 'hearts' | 'confetti' | null;
}

export interface LetterPlan {
  id: string;
  name: string;
  price: number;
  maxImages: number;
  allowsMusic: boolean;
  allowsVisualEffects: boolean;
  features: string[];
}
