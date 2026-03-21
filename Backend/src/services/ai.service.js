import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage,AIMessage,tool,createAgent } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";
import *as z from "zod";
import { searchInternet } from "./Internet.service.js";


const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-flash-latest",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool=tool(
  searchInternet,
  {
    name:"searchInternet",
    description:"use this tool to get latest information from internet.",
    schema:z.object({
      query:z.string().describe("The query to search on internet")
    })
  }
)

const agent=createAgent({
  model:mistralModel,
  tools:[searchInternetTool]
})

export async function generateResponse(messages) {
  const response = await agent.invoke({
    messages: [
      new SystemMessage(`you are a helpful and presice assistent for answering questions.
        If you dont know the answer say you dont know.
        if the question requires up to date information, use the "searchInternet" tool to get the latest information from internet and then answer the question based on that information.`),
      ...(messages.map(msg=>{
    if(msg.role=='user'){
      return new HumanMessage(msg.content)
    }else if(msg.role=='ai'){
      return new AIMessage(msg.content)
    }
  }))]
  });

  return response.messages[response.messages.length-1].text;
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
