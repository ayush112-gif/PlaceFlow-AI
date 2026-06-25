const NOTICE_ANALYZER_PROMPT = `
Analyze the placement notice and extract:

- Company Name
- Role
- CTC
- Eligibility
- Deadline
- Location

Return response in JSON format only.

Example:

{
  "company": "Microsoft",
  "role": "Software Engineer",
  "ctc": "18 LPA",
  "eligibility": "7 CGPA",
  "deadline": "25 June 2026",
  "location": "Noida"
}
`;

module.exports = NOTICE_ANALYZER_PROMPT;