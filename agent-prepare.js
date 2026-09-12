await page.goto(
  "https://www.lanmea.com/careers/ai-software-engineering-intern",
  { waitUntil: "domcontentloaded" }
);

await page.waitForTimeout(2000);


// --------------------------------------------------
// STEP 1: Detect and recover from blocking overlays
// --------------------------------------------------

let recovery = {
  detected: false,
  action: "no blocking overlay detected"
};

const frames = page.frames();

for (const frame of frames) {

  try {

    const rejectButton =
      frame.getByRole("button", {
        name: /reject all/i
      });

    if (await rejectButton.count() > 0) {

      await rejectButton.first().click();

      recovery = {
        detected: true,
        action: "detected privacy overlay and rejected optional cookies"
      };

      break;
    }

    const acceptButton =
      frame.getByRole("button", {
        name: /accept all/i
      });

    if (await acceptButton.count() > 0) {

      await acceptButton.first().click();

      recovery = {
        detected: true,
        action: "detected privacy overlay and accepted cookies"
      };

      break;
    }

  } catch (e) {
    // Continue checking other frames.
  }
}


await page.waitForTimeout(1000);


// --------------------------------------------------
// STEP 2: Inspect the real internship page
// --------------------------------------------------

const pageInfo = await page.evaluate(() => {

  const bodyText =
    document.body.innerText || "";

  const headings =
    Array.from(
      document.querySelectorAll("h1, h2, h3, h4")
    )
      .map(el => (el.innerText || "").trim())
      .filter(Boolean);

  const howToApplyIndex =
    bodyText.toLowerCase().indexOf("how to apply");

  let howToApply = "";

  if (howToApplyIndex >= 0) {

    howToApply =
      bodyText.slice(
        howToApplyIndex,
        howToApplyIndex + 2500
      );

  }

  return {
    title: document.title,
    url: location.href,
    headings,
    howToApply
  };

});


// --------------------------------------------------
// STEP 3: Extract application requirements
// --------------------------------------------------

const applicationRequirements = {

  cv: /one-page cv/i.test(
    pageInfo.howToApply
  ),

  linkedinOrGithub:
    /linkedin or github/i.test(
      pageInfo.howToApply
    ),

  projectNote:
    /short note|something you've built/i.test(
      pageInfo.howToApply
    ),

  applicationEmail:
    (
      pageInfo.howToApply.match(
        /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i
      ) || []
    )[0] || null

};


// --------------------------------------------------
// STEP 4: Prepare application draft
// --------------------------------------------------

const draft = {

  to:
    applicationRequirements.applicationEmail ||
    "internship@lanmea.com",

  subject:
    "Application – AI & Software Engineering Intern",

  requiredMaterials: [],

  candidateProfile: {

    education:
      "Computer Science student",

    skills:
      "Python, JavaScript, React, AWS",

    location:
      "India"

  },

  body:
`Dear Lanmea team,

I am a Computer Science student interested in AI and software engineering.

I have experience with Python, JavaScript, React, and AWS, and I am particularly interested in building practical AI and software systems.

I would be happy to share my CV, LinkedIn/GitHub profile, and examples of projects I have built.

Thank you for considering my application.

Best regards,
ApplyPilot candidate`,

  status:
    "READY_FOR_HUMAN_APPROVAL"

};


// Build required-material list from what the agent actually found.

if (applicationRequirements.cv) {

  draft.requiredMaterials.push(
    "One-page CV"
  );

}

if (applicationRequirements.linkedinOrGithub) {

  draft.requiredMaterials.push(
    "LinkedIn or GitHub"
  );

}

if (applicationRequirements.projectNote) {

  draft.requiredMaterials.push(
    "Short note or links to something built"
  );

}


// --------------------------------------------------
// FINAL AGENT RESULT
// --------------------------------------------------

return {

  ok: true,

  agent: "ApplyPilot",

  recovery,

  page: pageInfo,

  applicationRequirements,

  draft

};