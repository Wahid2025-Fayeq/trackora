import { Bookmark, CircleX, FileText, Target } from "lucide-react";

export const statusConfig = {
  Interview: {
    label: "Interview",
    icon: Target,
    className: "interview",
  },
  Applied: {
    label: "Applied",
    icon: FileText,
    className: "applied",
  },
  Saved: {
    label: "Saved",
    icon: Bookmark,
    className: "saved",
  },
  Rejected: {
    label: "Rejected",
    icon: CircleX,
    className: "rejected",
  },
};
