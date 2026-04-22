import { FileText } from "lucide-react";

export default function PublicProfileTextSection({ title = "About", value }) {
  if (!value) return null;

  return (
    <div className="mt-6 rounded-2xl border p-4 sm:p-5">
      <div className="flex items-center gap-2 font-semibold">
        <FileText className="h-4 w-4" />
        {title}
      </div>
      <p className="mt-3 whitespace-pre-wrap break-words text-sm text-muted-foreground">{value}</p>
    </div>
  );
}
