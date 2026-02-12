/**
 * Know Your Rights content — in-app (v4). Not linking out; content lives here.
 * Standard guidance for immigration enforcement encounters. Review with a lawyer for legal advice.
 */

export interface KYRSection {
  id: string;
  title: string;
  body: string[];
}

export const KNOW_YOUR_RIGHTS_SECTIONS: KYRSection[] = [
  {
    id: "do-not-open",
    title: "You do not have to open the door",
    body: [
      "ICE (or CBP) agents may come to your home. You do not have to open the door unless they show a warrant signed by a judge. Ask them to slip the warrant under the door or hold it to the window. A warrant from ICE alone (administrative warrant) is not enough to require you to open the door.",
    ],
  },
  {
    id: "remain-silent",
    title: "You have the right to remain silent",
    body: [
      "You can say: \"I am exercising my right to remain silent.\" You do not have to answer questions about where you were born, your immigration status, or whether you are a citizen. You can show your name and address if required by state law (e.g. driver's license), but you do not have to answer other questions.",
    ],
  },
  {
    id: "lawyer",
    title: "You have the right to speak to a lawyer",
    body: [
      "Say: \"I want to speak to a lawyer.\" If you are detained, you have the right to call a lawyer. Do not sign any papers (especially in a language you don't understand) without talking to a lawyer first. Free or low-cost legal help may be available through local rapid response hotlines or immigrant rights organizations.",
    ],
  },
  {
    id: "do-not-consent",
    title: "Do not consent to a search",
    body: [
      "You can say: \"I do not consent to a search.\" Officers may still pat you down for weapons. Do not resist physically; clearly state that you do not consent. Do not run or lie; that can be used against you.",
    ],
  },
  {
    id: "carry-docs",
    title: "Carry important documents safely",
    body: [
      "Keep copies of your immigration papers, IDs, and emergency contact numbers in a safe place. If you have a work permit or other status document, carry a copy. Give a trusted person copies and a signed Form G-28 (if you have a lawyer) so they can help if you are detained.",
    ],
  },
  {
    id: "family-plan",
    title: "Make a family preparedness plan",
    body: [
      "Decide who will care for children or dependents if a parent or caregiver is detained. Write down important phone numbers (lawyer, consulate, family). Keep emergency savings and key documents (birth certificates, passports) in a safe, accessible place.",
    ],
  },
];

export const KNOW_YOUR_RIGHTS_INTRO =
  "This is general information only, not legal advice. If ICE or other enforcement agents contact you or your family, these points can help you stay safer. When in doubt, say you want to speak to a lawyer and stay calm.";
