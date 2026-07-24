const OpenAI = require("openai");

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not configured");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateCoverLetter = async ({
  name,
  jobTitle,
  company,
  jobDescription,
  experience,
}) => {
  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5-mini",

    instructions: `
You are a professional career-writing assistant.

The candidate's name is ${name}.

Write a customized, ATS-friendly, and professional cover letter using ONLY the information provided.

Requirements:
- Use a professional, confident, and enthusiastic tone.
- Keep the letter between 250 and 400 words.
- Do not invent qualifications, achievements, employers, certifications, or experiences.
- Connect the candidate's actual experience to the job requirements.
- Explain why the candidate is interested in the company and role based only on the provided information.
- Avoid generic phrases, clichés, and unnecessary repetition.
- Use proper business letter formatting.
- The final lines of the letter MUST be exactly:

Sincerely,

${name}

- Never omit the closing.
- Never use placeholders such as "[Your Name]".
- Return ONLY the completed cover letter with no explanations or markdown.
`,

    input: `
Job Title:
${jobTitle}

Company:
${company}

Job Description:
${jobDescription}

Candidate Experience:
${experience}
`,
  });

  const coverLetter = response.output_text?.trim();

  if (!coverLetter) {
    throw new Error("The AI service returned an empty response");
  }

  return coverLetter;
};

module.exports = {
  generateCoverLetter,
};
