import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveTabsBar } from "@/components/common/ResponsiveTabsBar";
import { RatingDialog } from "@/components/common/RatingDialog";
import { SavedRatingNotice } from "@/components/common/SavedRatingNotice";
import {
  VolunteerEmptyState,
  VolunteerRequestCard,
} from "@/features/volunteer/components/VolunteerRequestCard";

export function CurrentVolunteerRequestsTab({ items, onCancel, cancelPending }) {
  if (!items.length) {
    return (
      <VolunteerEmptyState
        title="No current requests"
        subtitle="Create a new volunteer request to get support."
      />
    );
  }

  return items.map((item) => (
    <VolunteerRequestCard key={item.id} item={item}>
      <div className="flex justify-end">
        <Button
          variant="destructive"
          className="rounded-2xl"
          onClick={() => onCancel(item.id)}
          disabled={cancelPending}
        >
          Cancel
        </Button>
      </div>
    </VolunteerRequestCard>
  ));
}

export function HistoryVolunteerRequestsTab({ items, onRateVolunteer, ratePending }) {
  if (!items.length) {
    return (
      <VolunteerEmptyState
        title="No history"
        subtitle="Completed and cancelled requests will appear here."
      />
    );
  }

  return items.map((item) => (
    <VolunteerRequestCard key={item.id} item={item}>
      {item.patientRating ? (
        <SavedRatingNotice
          title="Volunteer rated successfully"
          rating={item.patientRating}
          feedback={item.patientFeedback}
        />
      ) : null}

      {item.status === "completed" && item.volunteerId && !item.patientRating ? (
        <RatingDialog
          title="Rate Volunteer"
          description="Leave a quick rating about the volunteer."
          loading={ratePending}
          onSubmit={(payload) => onRateVolunteer(item.id, payload)}
          trigger={
            <Button variant="outline" className="w-full rounded-2xl sm:w-auto">
              Rate
            </Button>
          }
        />
      ) : null}
    </VolunteerRequestCard>
  ));
}

export default function PatientVolunteerRequestsTabs({
  current,
  history,
  cancelPending,
  ratePending,
  onCancel,
  onRate,
}) {
  const [tab, setTab] = useState("current");

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <ResponsiveTabsBar listClassName="w-full grid-cols-2 bg-muted p-1 rounded-2xl">
        <TabsTrigger value="current" className="rounded-2xl">
          Current ({current.length})
        </TabsTrigger>
        <TabsTrigger value="history" className="rounded-2xl">
          History ({history.length})
        </TabsTrigger>
      </ResponsiveTabsBar>

      <TabsContent value="current" className="space-y-4">
        <CurrentVolunteerRequestsTab
          items={current}
          onCancel={onCancel}
          cancelPending={cancelPending}
        />
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <HistoryVolunteerRequestsTab
          items={history}
          onRateVolunteer={onRate}
          ratePending={ratePending}
        />
      </TabsContent>
    </Tabs>
  );
}