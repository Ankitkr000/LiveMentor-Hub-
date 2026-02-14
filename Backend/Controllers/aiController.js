const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false,
        message: "Message is required" 
      });
    }

    const messages = [
      {
        role: "system",
        content: `You are an AI Learning Assistant for LiveMentor-Hub, a remote classroom platform. Your role is to help students understand concepts, solve problems, and guide their learning journey.

Guidelines:
- Be friendly, encouraging, and patient
- Explain concepts clearly with examples
- Break down complex topics into simpler parts
- Ask clarifying questions when needed
- Provide step-by-step solutions for problems
- Encourage critical thinking
- Support learning in subjects like: DSA, Web Development, AI-ML, UI-UX, Databases, OOPS, System Design, Networking, and Career guidance`
      }
    ];

    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        });
      });
    }

    messages.push({
      role: "user",
      content: message
    });

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      stream: false
    });

    const aiMessage = completion.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";

    res.status(200).json({
      success: true,
      message: aiMessage,
      conversationId: req.user._id
    });

  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to get AI response",
      error: error.message 
    });
  }
};

const getSuggestedQuestions = async (req, res) => {
  try {
    const { subject } = req.query;

    if (!subject) {
      return res.status(400).json({ 
        success: false,
        message: "Subject is required" 
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Generate 5 interesting learning questions that a student might ask about ${subject}. 
Format: Just list the questions, one per line, without numbers or bullets.
Make them practical, engaging, and suitable for intermediate learners.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 500
    });

    const responseText = completion.choices[0]?.message?.content || "";
    const questions = responseText.split('\n').filter(q => q.trim().length > 0);

    res.status(200).json({
      success: true,
      questions: questions.slice(0, 5)
    });

  } catch (error) {
    console.error("Suggested questions error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to generate questions",
      error: error.message 
    });
  }
};

const explainConcept = async (req, res) => {
  try {
    const { concept, subject, level } = req.body;

    if (!concept) {
      return res.status(400).json({ 
        success: false,
        message: "Concept is required" 
      });
    }

    const difficultyLevel = level || "intermediate";
    const subjectContext = subject ? ` in ${subject}` : "";

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Explain the concept of "${concept}"${subjectContext} to a ${difficultyLevel} level student.

Include:
1. A simple definition
2. Why it's important
3. Real-world examples
4. Common misconceptions (if any)
5. Tips for better understanding

Keep the explanation clear, engaging, and practical.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048
    });

    const explanation = completion.choices[0]?.message?.content || "Unable to generate explanation.";

    res.status(200).json({
      success: true,
      explanation
    });

  } catch (error) {
    console.error("Explain concept error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to explain concept",
      error: error.message 
    });
  }
};

const reviewCode = async (req, res) => {
  try {
    const { code, language, context } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false,
        message: "Code is required" 
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Review this ${language || 'code'} and provide constructive feedback:

${context ? `Context: ${context}\n\n` : ''}Code:
\`\`\`
${code}
\`\`\`

Provide:
1. What the code does well
2. Potential issues or bugs
3. Suggestions for improvement
4. Best practices recommendations
5. Performance considerations (if applicable)

Be encouraging and educational in your feedback.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048
    });

    const review = completion.choices[0]?.message?.content || "Unable to generate code review.";

    res.status(200).json({
      success: true,
      review
    });

  } catch (error) {
    console.error("Code review error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to review code",
      error: error.message 
    });
  }
};

module.exports = {
  chatWithAI,
  getSuggestedQuestions,
  explainConcept,
  reviewCode
};
