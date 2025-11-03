import { GoogleGenAI, Modality } from "@google/genai";
import { LIGHTING_LOOKS } from "../lightingLooks";

if (!process.env.API_KEY) {
  // A general-purpose API key is provided for this demo.
  // For your own apps, use your own API key.
  process.env.API_KEY =
    "YOUR_API_KEY";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Utility to convert File to base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const buildPrompt = (
  instructions: string[],
  userDescription?: string,
  lightingLook?: string
): string => {
  const finalInstructions: string[] = [];

  if (userDescription?.trim()) {
    const sanitizedDesc = userDescription.trim().replace(/"/g, "'");
    finalInstructions.push(`User goal: "${sanitizedDesc}".`);
  }
  
  if (instructions.length > 0) {
      const moodInstruction = instructions[instructions.length - 1];
      const mainInstructions = instructions.slice(0, instructions.length - 1);
      finalInstructions.push(...mainInstructions);
      
      if (lightingLook && lightingLook !== 'none' && LIGHTING_LOOKS[lightingLook]) {
        finalInstructions.push(LIGHTING_LOOKS[lightingLook]);
      }

      finalInstructions.push(moodInstruction);
  }

  const instructionStr = finalInstructions.join(' ');

  // A more concise final instruction to guide the model effectively without being overly complex.
  const finalBoilerplate = "Apply these instructions to create a new, professionally enhanced photograph. The result must be a high-quality, unique image inspired by the original, not a direct copy.";
  
  return `${instructionStr} ${finalBoilerplate}`;
};

export const applyEnhancements = async (
  image: File,
  instructions: string[],
  userDescription?: string,
  lightingLook?: string
): Promise<{ enhancedImage: string, prompt: string }> => {
  const model = 'gemini-2.5-flash-image';
  const prompt = buildPrompt(instructions, userDescription, lightingLook);

  if (!prompt) {
    throw new Error("Enhancement instructions cannot be empty.");
  }
  
  try {
    const imagePart = await fileToGenerativePart(image);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: model,
        contents: [{
            parts: [imagePart, textPart],
        }],
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    
    if (!response.candidates || response.candidates.length === 0) {
      if (response.promptFeedback && response.promptFeedback.blockReason) {
        throw new Error(`Request was blocked due to: ${response.promptFeedback.blockReason}. Please adjust the prompt or image.`);
      }
      throw new Error("Invalid response from the model: No candidates returned. This might be due to safety settings or an issue with the input.");
    }

    const firstCandidate = response.candidates[0];
    
    if (!firstCandidate.content || !firstCandidate.content.parts || firstCandidate.content.parts.length === 0) {
      if (firstCandidate.finishReason && firstCandidate.finishReason !== 'STOP') {
         if (firstCandidate.finishReason === 'IMAGE_RECITATION') {
            throw new Error("Image generation was blocked to prevent recitation. This can happen if the result is too similar to a known image. Please try a different image or adjust your enhancement options.");
         }
         if (firstCandidate.finishReason === 'IMAGE_OTHER') {
            throw new Error("Image generation failed due to a general content or quality policy. Please try simplifying your description, choosing a different preset, or using another image.");
         }
         throw new Error(`Image generation failed. Reason: ${firstCandidate.finishReason}.`);
      }
      throw new Error("Invalid response from the model. Candidate has no content parts.");
    }

    for (const part of firstCandidate.content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return { enhancedImage: part.inlineData.data, prompt };
      }
    }
    
    throw new Error("No image data found in the model's response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to enhance image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while enhancing the image.");
  }
};