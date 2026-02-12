# Changelog — v3

All notable changes for the **v3** variant of ICE Activity Tracker.

---

## [0.3.0] - 2026-02-12

### Added

- **Know Your Rights (in-app)** — Full content in the app: do not open door without judicial warrant, right to remain silent, right to a lawyer, do not consent to search, carry documents safely, family preparedness plan. Stored in `data/know-your-rights.ts`. Sidebar toggle “Know Your Rights” opens/closes the section.
- **Rapid response & hotlines (in-app)** — National hotlines (e.g. SMS REPORT for alerts, ICE Detainee Locator) and state-specific rapid response numbers in `data/hotlines.json`. Sidebar section “Rapid response & hotlines” shows national list and, when a state is selected in the filter, state-specific hotlines. Phone numbers are `tel:` links.
- **Ways to get live updates (in-app)** — Expandable section rewritten to reference in-app features (refresh interval, Know Your Rights, Rapid response & hotlines, community report) and official ICE; SMS/other tools are described via the hotlines section rather than external links.
- **Report form enhancement** — Line added: “If someone needs help now, open Rapid response & hotlines above for hotline numbers.”
- **Analytics** — `know_your_rights_toggle` and `resources_hotlines_toggle` events.
- **SEO** — Description and one FAQ updated to mention Know Your Rights and hotlines; keywords include “Know Your Rights immigration” and “rapid response immigration hotline.”

### Changed

- **Manifest** — Description updated to mention Know Your Rights and rapid response hotlines.
- **Footer** — “Know Your Rights & hotlines in-app. Not legal advice.”
- **Sidebar width** — `sm:w-[400px]` to fit KYR and hotline content.

### Technical

- **New files** — `data/know-your-rights.ts`, `data/hotlines.json`, `app/lib/resources.ts`, `app/components/KnowYourRights.tsx`, `app/components/ResourcesHotlines.tsx`.
- **Version** — `package.json` set to `0.3.0`.

### Design

- Tools and help are **created within** the app: KYR and hotline directory are first-class in-app content instead of linking out to external tools.

---

[0.3.0]: https://github.com/AvaTar-ArTs/ice-tracker/compare/v0.2.0...v0.3.0
