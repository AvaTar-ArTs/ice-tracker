"use client";

import {
  KNOW_YOUR_RIGHTS_SECTIONS,
  KNOW_YOUR_RIGHTS_INTRO,
} from "@/data/know-your-rights";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function KnowYourRights({ isOpen, onClose }: Props) {
  if (!isOpen) return null;
  return (
    <section
      className="p-3 rounded-lg border border-[#2a303c] bg-[#161a22] text-xs space-y-4"
      aria-label="Know Your Rights"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-[#e2e6ec]">Know Your Rights</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-[#9ca3af] hover:text-[#e2e6ec] px-1"
          aria-label="Close Know Your Rights"
        >
          ✕
        </button>
      </div>
      <p className="text-[#9ca3af] italic">{KNOW_YOUR_RIGHTS_INTRO}</p>
      <ul className="space-y-4 list-none">
        {KNOW_YOUR_RIGHTS_SECTIONS.map((section) => (
          <li key={section.id}>
            <h4 className="font-medium text-[#e2e6ec] mb-1">{section.title}</h4>
            <div className="text-[#9ca3af] space-y-1">
              {section.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="text-[#6b7280] text-[10px] border-t border-[#2a303c] pt-2">
        This is general information only, not legal advice. Consult an attorney
        for your situation.
      </p>
    </section>
  );
}
