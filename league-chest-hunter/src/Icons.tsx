import { Component } from "solid-js";

export const Chest: Component<{ class: string }> = (props: any) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 48 48" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      >
        {/* <rect x="4" y="4" width="40" height="40" rx="2"></rect>
        <path d="M4 24h13" strokeLinecap="round"></path>
        <path d="M31 24h13" strokeLinecap="round"></path>
        <path d="M24 31a7 7 0 1 0 0-14a7 7 0 0 0 0 14z"></path> */}
        <text fill-opacity="0.4" font-size="1.5rem" x="7" y="35">⚡</text>
      </g>
    </svg>
  );
};

export const AquiredChest: Component<{class: string}> = (props: any) => (
    <svg width="1em" height="1em" viewBox="0 0 48 48" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      >
        {/* <rect opacity="0.5" x="4" y="4" width="40" height="40" rx="2"></rect>
        <path opacity="0.5" d="M4 24h13" strokeLinecap="round"></path>
        <path opacity="0.5" d="M31 24h13" strokeLinecap="round"></path>
        <path opacity="0.5" d="M24 31a7 7 0 1 0 0-14a7 7 0 0 0 0 14z"></path> */}
        <text fill-opacity="0.2" fill="currentColor" font-size="2rem" x="13" y="35">✔</text>
      </g>
    </svg>
)
