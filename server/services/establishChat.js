const { ConversationChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} = require("langchain/prompts");
const { BufferMemory } = require("langchain/memory");

async function establishChat(jamSessionId) {
  const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4",
    temperature: 1,
  });

  const template = `The following is a transcript of everything said by you, a disk jockey. The Human is prompting you on what to say and how.`;

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(template),
    new MessagesPlaceholder(`history_${jamSessionId}`),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: `history_${jamSessionId}`,
  });

  const chain = new ConversationChain({
    memory: memory,
    prompt: chatPrompt,
    llm: chat,
    verbose: true,
  });

  return chain;
}

module.exports = establishChat;
