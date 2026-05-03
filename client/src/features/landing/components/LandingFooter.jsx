import { footerData } from "@/features/landing/landing.data";

export default function LandingFooter() {
  return (
    <footer className="border-t bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 text-center sm:text-left">
        <p className="text-lg font-semibold text-foreground">
          {footerData.brand}
        </p>
        <p className="text-sm text-muted-foreground">{footerData.text}</p>
      </div>
    </footer>
  );
}