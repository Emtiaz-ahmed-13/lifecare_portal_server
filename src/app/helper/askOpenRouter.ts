import OpenAI from "openai";
import config from "../../config";

const openai = new OpenAI({
    apiKey: config.openRouterApiKey,
    baseURL: "https://openrouter.ai/api/v1",
});

export const askOpenRouter = async (message: string) => {
    const response = await openai.chat.completions.create({
        model: "meta-llama/llama-3.2-3b-instruct",
        messages: [{ role: "user", content: message }],
    });
    return response.choices[0].message.content;
};
