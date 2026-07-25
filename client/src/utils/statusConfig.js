import { Bookmark, CircleX, FileText, Target, Trophy } from "lucide-react";

export const statusConfig = {
  Saved: {
    label: "Saved",
    icon: Bookmark,
    className: "saved",
  },
  Applied: {
    label: "Applied",
    icon: FileText,
    className: "applied",
  },
  Interview: {
    label: "Interview",
    icon: Target,
    className: "interview",
  },
  Offer: {
    label: "Offer",
    icon: Trophy,
    className: "offer",
  },
  Rejected: {
    label: "Rejected",
    icon: CircleX,
    className: "rejected",
  },
};
