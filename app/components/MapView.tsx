"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { IceNewsItem } from "@/app/api/ice-news/route";
import { trackEvent, ANALYTICS_EVENTS } from "@/app/lib/analytics";
import { formatDateMap } from "@/app/lib/format-date";

const L = typeof window !== "undefined" ? require("leaflet") : null;

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false }
);

const darkTile =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

const eroIcon =
  L &&
  L.divIcon({
    className: "ero-marker",
    html: `<span style="
      width:12px;height:12px;border-radius:50%;
      background:#3b82f6;border:2px solid #1e3a5f;
      display:block;box-sizing:border-box;
    "></span>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

const newsIcon =
  L &&
  L.divIcon({
    className: "news-marker",
    html: `<span style="
      width:10px;height:10px;border-radius:50%;
      background:#ef4444;border:2px solid #7f1d1d;
      display:block;box-sizing:border-box;
    "></span>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });

type EROOffice = {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  area: string;
};

type StateCoords = Record<string, [number, number]>;

export interface CommunityReportMap {
  id: string;
  state: string;
  city: string;
  description: string;
  createdAt: string;
}

export default function MapView({
  offices,
  stateCoords,
  news,
  communityReports,
  selectedState,
  onSelectNews,
  onSelectCommunityReport,
}: {
  offices: EROOffice[];
  stateCoords: StateCoords;
  news: IceNewsItem[];
  communityReports: CommunityReportMap[];
  selectedState: string | null;
  onSelectNews: (id: string) => void;
  onSelectCommunityReport?: (id: string) => void;
}) {
  const newsWithCoords = useMemo(() => {
    return news
      .filter((n) => n.state && stateCoords[n.state])
      .map((n) => ({
        ...n,
        lat: stateCoords[n.state!][0],
        lng: stateCoords[n.state!][1],
      }));
  }, [news, stateCoords]);

  const communityWithCoords = useMemo(() => {
    return communityReports
      .filter((r) => stateCoords[r.state])
      .map((r) => ({
        ...r,
        lat: stateCoords[r.state][0],
        lng: stateCoords[r.state][1],
      }));
  }, [communityReports, stateCoords]);

  if (typeof window === "undefined") {
    return (
      <div className="h-full w-full min-h-[400px] flex items-center justify-center bg-[#0c0e12] text-[#6b7280]" aria-hidden="true">
        Loading map…
      </div>
    );
  }

  return (
    <MapContainer
      center={[39.5, -98.35]}
      zoom={4}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer url={darkTile} attribution='&copy; CARTO' />
      <ZoomButtons />
      {offices.map((o) => (
        <Marker key={o.id} position={[o.lat, o.lng]} icon={eroIcon}>
          <Popup>
            <div className="min-w-[180px] text-left">
              <div className="font-semibold text-[#e2e6ec]">{o.name}</div>
              <div className="text-xs text-[#9ca3af] mt-1">
                {o.city}, {o.state}
              </div>
              <div className="text-xs text-[#6b7280] mt-0.5">{o.area}</div>
            </div>
          </Popup>
        </Marker>
      ))}
      {newsWithCoords.map((n) => (
        <CircleMarker
          key={n.id}
          center={[n.lat, n.lng]}
          radius={selectedState && n.state === selectedState ? 8 : 5}
          pathOptions={{
            fillColor: "#ef4444",
            color: "#7f1d1d",
            weight: 1,
            fillOpacity: 0.8,
          }}
          eventHandlers={{
            click: () => {
              onSelectNews(n.id);
              trackEvent(ANALYTICS_EVENTS.MAP_INTERACTION, { type: "news", state: n.state ?? "" });
            },
          }}
        >
          <Popup>
            <div className="min-w-[220px] max-w-[280px] text-left">
              <a
                href={n.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#93c5fd] hover:underline block"
              >
                {n.title}
              </a>
              <div className="text-xs text-[#9ca3af] mt-1">
                {[n.city, n.state].filter(Boolean).join(", ")} ·{" "}
                {formatDateMap(n.pubDate)}
              </div>
              <p className="text-xs text-[#9ca3af] mt-1 line-clamp-3">
                {n.description}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
      {communityWithCoords.map((r) => (
        <CircleMarker
          key={r.id}
          center={[r.lat, r.lng]}
          radius={6}
          pathOptions={{
            fillColor: "#f59e0b",
            color: "#b45309",
            weight: 1,
            fillOpacity: 0.9,
          }}
          eventHandlers={{
            click: () => {
              onSelectCommunityReport?.(r.id);
              trackEvent(ANALYTICS_EVENTS.MAP_INTERACTION, { type: "community_report", state: r.state });
            },
          }}
        >
          <Popup>
            <div className="min-w-[200px] max-w-[260px] text-left">
              <div className="text-[10px] uppercase tracking-wider text-[#f59e0b] font-medium">
                Community report (unverified)
              </div>
              <div className="font-medium text-[#e2e6ec] mt-1">
                {r.city}, {r.state}
              </div>
              {r.description && (
                <p className="text-xs text-[#9ca3af] mt-1 line-clamp-3">
                  {r.description}
                </p>
              )}
              <div className="text-xs text-[#6b7280] mt-1">
                {formatDateMap(r.createdAt)}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

function ZoomButtons() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useMap } = require("react-leaflet") as typeof import("react-leaflet");
  const map = useMap();
  return (
    <div className="leaflet-top leaflet-right absolute top-4 right-4 z-[1000]">
      <div className="leaflet-control leaflet-bar flex flex-col rounded-lg overflow-hidden border border-[#2a303c]">
        <button
          type="button"
          className="bg-[#161a22] text-[#e2e6ec] w-9 h-9 flex items-center justify-center hover:bg-[#1f2430] text-lg leading-none"
          onClick={() => map?.zoomIn()}
        >
          +
        </button>
        <button
          type="button"
          className="bg-[#161a22] text-[#e2e6ec] w-9 h-9 flex items-center justify-center hover:bg-[#1f2430] text-lg leading-none border-t border-[#2a303c]"
          onClick={() => map?.zoomOut()}
        >
          −
        </button>
      </div>
    </div>
  );
}
