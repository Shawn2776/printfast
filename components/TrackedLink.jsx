"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export default function TrackedLink({ eventName, eventParams = {}, onClick, ...props }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(eventName, eventParams);
        if (onClick) onClick(e);
      }}
    />
  );
}
