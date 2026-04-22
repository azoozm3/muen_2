import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/common/BackButton";
import PublicProfileHeader from "@/features/profile/public/PublicProfileHeader";
import PublicProfileInfoRow from "@/features/profile/public/PublicProfileInfoRow";
import PublicProfileRatingsSection from "@/features/profile/public/PublicProfileRatingsSection";
import PublicProfileRecordsSection from "@/features/profile/public/PublicProfileRecordsSection";
import PublicProfileTextSection from "@/features/profile/public/PublicProfileTextSection";
import { buildPublicProfileSummary, getPublicProfileConfig } from "@/features/profile/public/profilePublicConfig";
import { usePublicProfile } from "@/features/profile/public/usePublicProfile";

function getRecordRows(data) {
  if (Array.isArray(data?.medicalHistory) && data.medicalHistory.length) return data.medicalHistory;
  if (Array.isArray(data?.healthRecord) && data.healthRecord.length) return data.healthRecord;
  return [];
}

export default function PublicProfilePage({ profileRole }) {
  const { data, isLoading, resolvedRole, error } = usePublicProfile(profileRole);
  const config = getPublicProfileConfig(resolvedRole);
  const summary = buildPublicProfileSummary(data);
  const records = getRecordRows(data);
  const ratings = Array.isArray(data?.providerRatings) ? data.providerRatings : [];
  const bio = data?.bio || data?.volunteerNotes || "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <BackButton fallbackPath={config.fallbackPath} className="mb-4 px-2 sm:px-3">Back</BackButton>
      <Card className="rounded-3xl p-5 sm:p-7">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <>
            <PublicProfileHeader
              data={data}
              profileLabel={config.profileLabel}
              ratingText={config.ratingText}
              ratingValue={summary.ratingValue}
              ratingCount={summary.ratingCount}
              nameFallback={config.nameFallback}
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {config.detailRows.map((row) => (
                <PublicProfileInfoRow
                  key={row.label}
                  icon={row.icon}
                  label={row.label}
                  value={row.getValue(data)}
                />
              ))}
            </div>

            <PublicProfileTextSection title="About" value={bio} />
            {records.length ? <PublicProfileRecordsSection records={records} /> : null}
            {config.showProviderRatings ? <PublicProfileRatingsSection ratings={ratings} title={config.ratingsTitle} /> : null}
          </>
        )}
      </Card>
    </div>
  );
}
