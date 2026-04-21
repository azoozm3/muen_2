export function NurseRequestsHeader({ canCreateNewRequest, shouldShowForm, onOpenForm }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Nurse Requests</h1>
        <p className="text-sm text-muted-foreground">Book, track, or cancel a home nurse visit.</p>
      </div>

      {canCreateNewRequest && !shouldShowForm ? (
        <button
          type="button"
          onClick={onOpenForm}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          New Request
        </button>
      ) : null}
    </div>
  );
}
