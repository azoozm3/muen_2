import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { PatientInteractionRating } from "@/components/common/PatientInteractionRating";
import { DoctorRouteTracker } from "./DoctorRouteTracker";
import { DoctorCardHeader, PatientSummary } from "./cards/DoctorCardParts";
import { ResolvedCasesCard } from "./cards/ResolvedCasesCard";

export function RequestSummaryCard({ request, actions, showPrimary = false }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="overflow-visible rounded-xl">
        <CardHeader className="pb-3"><DoctorCardHeader request={request} /></CardHeader>
        <CardContent className="space-y-4">
          <PatientSummary request={request} showPrimary={showPrimary} />
          {actions ? <div className="pt-2">{actions}</div> : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DoctorCaseGrid({ cases, emptyState, renderCard, columns = "md:grid-cols-2 lg:grid-cols-3" }) {
  return <AnimatePresence>{cases.length === 0 ? <EmptyState {...emptyState} /> : <div className={`grid gap-6 ${columns}`.trim()}>{cases.map(renderCard)}</div>}</AnimatePresence>;
}

export function AvailableCaseCard({ request, onAccept, isUpdating }) {
  return <RequestSummaryCard request={request} actions={<Button className="w-full" onClick={() => onAccept(request.id || request._id)} disabled={isUpdating}><Stethoscope className="mr-2 h-4 w-4" /> Accept Case</Button>} />;
}

export function MyCaseCard({ request, onStatusUpdate, isUpdating, onRatePatient }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="overflow-visible rounded-xl">
        <CardHeader className="pb-3"><DoctorCardHeader request={request} showCaseId={false} /></CardHeader>
        <CardContent className="space-y-4">
          <PatientSummary request={request} showCaseId />
          <DoctorRouteTracker request={request} onStatusUpdate={onStatusUpdate} isUpdating={isUpdating} />
          {request.status === "resolved" || request.status === "closed" ? <PatientInteractionRating existingRating={request.providerPatientRating} existingFeedback={request.providerPatientFeedback} onSave={(payload) => onRatePatient?.(request, payload)} /> : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { ResolvedCasesCard };

export const availableEmptyState = { icon: CheckCircle2, title: "No pending cases", subtitle: "All caught up. Waiting for new alerts." };
export const myCasesEmptyState = { icon: Stethoscope, title: "No active cases", subtitle: "Accept a case from the Available tab to get started." };
