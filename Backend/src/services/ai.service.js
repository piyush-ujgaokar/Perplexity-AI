import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage,AIMessage } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const response = await geminiModel.invoke(messages.map(msg=>{
    if(msg.role=='user'){
      return new HumanMessage(msg.content)
    }else if(msg.role=='ai'){
      return new AIMessage(msg.content)
    }
  }));

  return response.text;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(
      `You are a helpful assistant that generates concise and descriptive titles for chat conversations. Based on the following message, create a title that captures the essence of the conversation in a few words.
      
      user will provide a message, and you will generate a title for the chat conversation. The title should be relevant to the content of the message and should be concise, ideally between 2-3 words.
      `,
    ),

    new HumanMessage(`
        geneate a title for chat conversation based on the following message: ${message}
      `),
  ]);

  return response.text;
}
