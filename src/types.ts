export type Mood = "Cyberpunk" | "Botanical" | "Minimalist" | "Retro-Futurism" | "Oceanic";
export type ShoeType = "High-Top Sneaker" | "Low-Profile Runner" | "Technical Boot" | "Slip-on" | "Luxury Trainer";
export type UpperMaterial = "Leather" | "Canvas" | "Mesh" | "Suede" | "Carbon Fiber" | "Recycled Plastic" | "Iridescent Mesh";

export interface ColorPalette {
  sole: string;
  material: string;
  laces: string;
  overall: string;
}

export interface ShoeDesign {
  id: string;
  imageUrl: string;
  prompt: string;
  mood: Mood;
  shoeType: ShoeType;
  upperMaterial: UpperMaterial;
  colors: ColorPalette;
  creatorName?: string;
  timestamp: number;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface AppState {
  step: "attract" | "mood" | "type" | "chat" | "generating" | "reveal" | "finalize" | "share";
  selectedMood?: Mood;
  selectedType?: ShoeType;
  selectedMaterial: UpperMaterial;
  selectedColors: ColorPalette;
  chatHistory: ChatMessage[];
  generatedImages: string[];
  selectedImage?: string;
  finalDesign?: ShoeDesign;
}
