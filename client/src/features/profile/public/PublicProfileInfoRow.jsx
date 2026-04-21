export default function PublicProfileInfoRow({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="mt-2 break-words font-medium">{value}</div>
    </div>
  );
}
