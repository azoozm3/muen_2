import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function BackButton({
  fallbackPath = "/dashboard/patient/services",
  className = "",
  children = "Back",
}) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    const savedPath = sessionStorage.getItem("lastPageBeforeDetails");

    if (savedPath) {
      navigate(savedPath);
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    navigate(fallbackPath);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleBack}
      className={className}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}