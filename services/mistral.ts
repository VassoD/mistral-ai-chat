import Constants from "expo-constants";

const MISTRAL_API_URL =
  Constants.expoConfig?.extra?.mistralApiUrl ||
  process.env.MISTRAL_API_URL ||
  "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_API_KEY =
  Constants.expoConfig?.extra?.mistralApiKey || process.env.MISTRAL_API_KEY;

export const generateMistralResponse = async (
  message: string
): Promise<string> => {
  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to get AI response");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Mistral API:", error);
    throw error;
  }
};
