"use client";

import { FiUsers } from "react-icons/fi";
import ComingSoon from "@/shared/components/ComingSoon";

/** The CDS hub is not built yet; this page says so instead of showing sample members and dues. */
export default function CommunityPage() {
  return (
    <ComingSoon
      icon={FiUsers}
      title="CDS group hub"
      description="A place for your Community Development Service group to share meeting times, take attendance and post project updates."
      planned={["Weekly meeting reminders", "Attendance register", "Group project updates", "Dues tracking for CDS executives"]}
      action={{ href: "/dashboard", label: "Back to your dashboard" }}
    />
  );
}
