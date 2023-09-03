const { ChatOpenAI } = require("langchain/chat_models/openai");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// export function generateAIContent(type) {
//    if(type === 'intro') return "AI Generated Intro";
//    ... other types
// }

const llm = new ChatOpenAI({
  openAIApiKey: OPENAI_API_KEY,
  temperature: 0.9,
});

const predictMessages = async (messages) => {
  return await llm.predictMessages(messages);
};

module.exports = { predictMessages };
