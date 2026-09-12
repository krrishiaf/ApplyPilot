\# ApplyPilot 🚀



AI Browser Agent for Intelligent Internship Discovery and Applications.



\## Problem



Finding internships and completing applications is repetitive, time-consuming, and often involves navigating different websites with different application flows.



\## Solution



ApplyPilot is a browser agent that helps automate the internship application workflow.



It can:



1\. Search live internship opportunities.

2\. Extract and evaluate relevant opportunities.

3\. Calculate a profile match score.

4\. Open real internship pages.

5\. Inspect application requirements.

6\. Recover from blocking privacy/cookie overlays.

7\. Prepare a tailored application draft.

8\. Stop before submission and request human approval.



\## Human-in-the-Loop Safety



ApplyPilot does \*\*not\*\* automatically submit applications.



Before any final submission, the agent pauses and requires explicit human approval.



This prevents unintended submissions and keeps the user in control of sensitive actions.



\## Architecture



```text

User

&#x20; │

&#x20; ▼

ApplyPilot Web UI

&#x20; │

&#x20; ▼

Express Server

&#x20; │

&#x20; ▼

Webcmd Browser Session

&#x20; │

&#x20; ├── agent-search.js

&#x20; │      └── Searches live internship opportunities

&#x20; │

&#x20; └── agent-prepare.js

&#x20;        ├── Opens internship page

&#x20;        ├── Inspects requirements

&#x20;        ├── Handles blocking overlays

&#x20;        └── Generates application draft

