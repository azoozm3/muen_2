import NurseRequestForm from "@/components/nurse/NurseRequestForm";

export function NurseRequestFormPanel({ canCreateNewRequest, isSubmitting, onClose, onSubmit }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">New Request</h2>
          <p className="text-sm text-muted-foreground">One active request at a time.</p>
        </div>

        {!canCreateNewRequest ? (
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Close
          </button>
        ) : null}
      </div>

      <NurseRequestForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
