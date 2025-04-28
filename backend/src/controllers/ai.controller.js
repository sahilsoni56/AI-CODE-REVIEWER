const generateContent = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  const code = req.body.code;
  if (!code ) {
    return res.status(400).send("Prompt is required");
  }

  try {
    const response = await generateContent(code);
    res.json({ success: true, response });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating AI response");
  }
};
