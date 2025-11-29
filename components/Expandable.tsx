"use dom";
import "../src/global.css";
import React, { useState } from "react";

export default function ExpandableText({
  text,
  limit = 140,
}: {
  text: string;
  limit?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const isLong = text?.length > limit;

  // Cut at last full word (nearest space before limit)
  const shortText = isLong
    ? text?.slice(0, text.lastIndexOf(" ", limit))
    : text;

  const displayText = expanded ? text : shortText + (isLong ? "..." : "");

  return (
    <div>
      <p className="text-gray-700 mb-2">{displayText}</p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="font-semibold underline flex items-center gap-1"
        >
          {expanded ? "Show Less" : "Show More"}
          <svg
            className={`w-4 h-4 transform transition ${
              expanded ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
