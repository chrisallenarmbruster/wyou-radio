
const { ChatOpenAI } = require("langchain/chat_models/openai");

const OPENAI_API_KEY = "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"; //process.env.OPENAI_API_KEY || "default_key"; //

const llm = new ChatOpenAI({
  openAIApiKey: OPENAI_API_KEY,
  temperature: 0.9,
});

const predictMessages = async (messages) => {
  return await llm.predictMessages(messages);
};

module.exports = { predictMessages };
