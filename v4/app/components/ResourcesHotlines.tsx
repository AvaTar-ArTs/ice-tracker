"use client";

import {
  getNationalHotlines,
  getHotlinesForState,
  getStateHotlinesList,
} from "@/app/lib/resources";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedState: string | null;
}

export default function ResourcesHotlines({
  isOpen,
  onClose,
  selectedState,
}: Props) {
  if (!isOpen) return null;

  const national = getNationalHotlines();
  const stateData = getHotlinesForState(selectedState);
  const stateHotlines = getStateHotlinesList(selectedState);
  const showStateSection =
    selectedState && stateData && stateData.stateName !== "Your state";

  return (
    <section
      className="p-3 rounded-lg border border-[#2a303c] bg-[#161a22] text-xs space-y-4"
      aria-label="Rapid response and hotlines"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-[#e2e6ec]">
          Rapid response & hotlines
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-[#9ca3af] hover:text-[#e2e6ec] px-1"
          aria-label="Close resources"
        >
          ✕
        </button>
      </div>
      <p className="text-[#9ca3af]">
        Use the state filter above to see hotlines for that state. Numbers below
        are for reporting ICE activity, legal support, or Know Your Rights
        (in-app under Know Your Rights).
      </p>

      {showStateSection && (
        <div>
          <h4 className="font-medium text-[#93c5fd] mb-2">
            {stateData!.stateName} ({selectedState})
          </h4>
          <ul className="space-y-2">
            {stateHotlines.map((h, i) => (
              <li key={i} className="border-l-2 border-[#2a303c] pl-2">
                <span className="font-medium text-[#e2e6ec]">{h.name}</span>
                {h.phone && (
                  <a
                    href={`tel:${h.phone.replace(/\D/g, "")}`}
                    className="block text-[#93c5fd] hover:underline"
                  >
                    {h.phone}
                  </a>
                )}
                {h.action && (
                  <span className="block text-[#9ca3af]">{h.action}</span>
                )}
                <span className="text-[#9ca3af]">{h.description}</span>
                {h.url && (
                  <a
                    href={h.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#93c5fd] hover:underline mt-0.5"
                  >
                    More info
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="font-medium text-[#93c5fd] mb-2">National</h4>
        <ul className="space-y-2">
          {national.map((h, i) => (
            <li key={i} className="border-l-2 border-[#2a303c] pl-2">
              <span className="font-medium text-[#e2e6ec]">{h.name}</span>
              {h.phone && (
                <a
                  href={`tel:${h.phone.replace(/\D/g, "")}`}
                  className="block text-[#93c5fd] hover:underline"
                >
                  {h.phone}
                </a>
              )}
              {h.action && (
                <span className="block text-[#9ca3af]">{h.action}</span>
              )}
              <span className="text-[#9ca3af]">{h.description}</span>
              {h.url && (
                <a
                  href={h.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#93c5fd] hover:underline mt-0.5"
                >
                  More info
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      {!showStateSection && selectedState && (
        <p className="text-[#6b7280]">
          No state-specific hotlines in our list for {selectedState}. Check
          National above or search &quot;immigration rapid response {selectedState}&quot;.
        </p>
      )}

      <p className="text-[#6b7280] text-[10px] border-t border-[#2a303c] pt-2">
        Numbers may change. Call to confirm. This app does not operate these
        hotlines.
      </p>
    </section>
  );
}
