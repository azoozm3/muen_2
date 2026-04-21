import AppointmentsHeader from "./AppointmentsHeader";
import AppointmentsSection from "./AppointmentsSection";

export default function AppointmentsPageLayout({
  title,
  description,
  userLabel,
  onProfileClick,
  ProfileIcon,
  isLoading,
  current,
  history,
}) {
  return (
    <div className="app-page-shell">
      <div className="app-page-container max-w-6xl">
        <AppointmentsHeader
          title={title}
          description={description}
          userLabel={userLabel}
          onProfileClick={onProfileClick}
          ProfileIcon={ProfileIcon}
        />

        {isLoading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-8">
            <AppointmentsSection
              title={current.title}
              description={current.description}
              emptyText={current.emptyText}
              items={current.items}
              renderItem={current.renderItem}
            />
            <AppointmentsSection
              title={history.title}
              description={history.description}
              emptyText={history.emptyText}
              items={history.items}
              renderItem={history.renderItem}
            />
          </div>
        )}
      </div>
    </div>
  );
}
