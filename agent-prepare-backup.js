const profile = `
Computer Science student interested in AI and software engineering internships.
Skills: Python, JavaScript, React, AWS.
Location: India.
`;

const applicationRequirements = `
Please send your one-page CV, your LinkedIn or GitHub,
and a short note (or links) on something you've built yourself.

Send your application to internship@lanmea.com
`;

function extractProfileValue(label) {
  const lines = profile
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const line = lines.find(item =>
    item.toLowerCase().startsWith(label.toLowerCase())
  );

  return line ? line.split(":").slice(1).join(":").trim() : "";
}

const skills = extractProfileValue("Skills");

const draft = {
  to: "internship@lanmea.com",

  subject: "Application – AI & Software Engineering Intern",

  requiredMaterials: [
    "One-page CV",
    "LinkedIn or GitHub",
    "Short note or links to something built"
  ],

  candidateProfile: {
    education: "Computer Science student",
    skills: skills || "Python, JavaScript, React, AWS",
    location: "India"
  },

  body:
`Dear Lanmea team,

I am a Computer Science student interested in AI and software engineering.

I have experience with Python, JavaScript, React, and AWS, and I am particularly interested in building practical AI and software systems.

I would be happy to share my CV, LinkedIn/GitHub profile, and examples of projects I have built.

Thank you for considering my application.

Best regards,
ApplyPilot candidate`,

  status: "READY_FOR_HUMAN_APPROVAL"
};

return {
  ok: true,
  applicationRequirements,
  draft
};