## Why I made ApplyPilot

Students spend a lot of time searching for internships, opening multiple job pages, checking requirements, and preparing applications manually. The process is repetitive, time-consuming, and different websites have different application flows.

We wanted to build a browser agent that could handle the repetitive work while keeping the student in control of the final decision.

## What is ApplyPilot?

ApplyPilot is an AI browser agent for intelligent internship discovery and application preparation.

It can:

1. Search for live internship opportunities.
2. Evaluate opportunities against the user's profile.
3. Calculate a match score.
4. Open real internship pages.
5. Understand and extract application requirements.
6. Recover from blocking privacy/cookie overlays.
7. Prepare an application draft.
8. Stop and ask for human approval before submission.

## How ApplyPilot Works

### Step 1 — User Profile

The user provides their information and preferences.

Example:

```text
3rd year CSE student
Skills: Python, JavaScript, React, AWS
Interested in AI/software engineering internships
Location: India
```

### Step 2 — Search

ApplyPilot uses a real browser to search for relevant internship opportunities.

### Step 3 — Match

The agent compares the user's skills and interests with the internship information and produces a match score.

Example:

```text
AI & Software Engineering Intern
70% match
Matched: AI, Software, Python...
```

### Step 4 — Inspect

The agent opens the actual internship webpage and understands how the candidate needs to apply.

It can extract:

```text
One-page CV
LinkedIn or GitHub
Short note or links to something built
Application email
```

### Step 5 — Recovery

Real websites can contain unexpected obstacles such as privacy or cookie overlays.

ApplyPilot detects these blocking elements and attempts to recover so that the workflow can continue.

### Step 6 — Prepare

The agent prepares the application draft based on the requirements it discovered.

Example:

```text
To: internship@lanmea.com

Subject: Application – AI & Software Engineering Intern

Required materials:
• One-page CV
• LinkedIn or GitHub
• Short note or links to something built
```

### Step 7 — Human Approval

This is our most important safety feature.

The agent does not blindly submit the application.

It stops and shows:

```text
⚠ Human approval required before submission.
```

The user reviews the application and clicks:

```text
Approve & Continue
```

Only then does the application become ready for submission.

## Why Human Approval?

Submitting an application is a consequential action. An incorrect answer, wrong attachment, or wrong application could create a real problem for the user.

Our principle is:

**We automate the work, not the responsibility.**

## Technology Used

```text
Frontend
HTML + CSS + JavaScript

Backend
Node.js + Express

Browser Automation
Webcmd + real browser runtime

Agent Workflows
agent-search.js
agent-prepare.js
agent-recover.js
```

## Complete Workflow

```text
USER PROFILE
     ↓
SEARCH INTERNSHIPS
     ↓
EVALUATE MATCH
     ↓
OPEN REAL WEBPAGE
     ↓
INSPECT REQUIREMENTS
     ↓
RECOVER FROM OBSTACLES
     ↓
PREPARE APPLICATION
     ↓
HUMAN APPROVAL
     ↓
READY FOR SUBMISSION
```

## What makes ApplyPilot different?

A normal chatbot might simply tell a student:

> “Here are some internships you can apply for.”

ApplyPilot actually uses a browser to perform the workflow:

```text
Search → Navigate → Inspect → Prepare → Ask Human
```

The goal is not just to recommend an action, but to **perform the repetitive browser work while keeping the human in control of consequential actions.**

## One-line Pitch

**“ApplyPilot is an AI browser agent that finds relevant internships, understands their application requirements, prepares the application, and keeps the human in control of the final submission.”**
