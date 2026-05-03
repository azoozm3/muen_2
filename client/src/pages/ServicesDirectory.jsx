import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import DirectoryBookingPanel from "@/features/services-directory/DirectoryBookingPanel";
import DirectoryFilters from "@/features/services-directory/DirectoryFilters";
import DirectoryHeader from "@/features/services-directory/DirectoryHeader";
import DoctorDirectoryResults from "@/features/services-directory/DoctorDirectoryResults";
import { useDoctorsDirectory } from "@/features/services-directory/useDoctorsDirectory";

export default function ServicesDirectory() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const bookingRef = useRef(null);
  const { doctorsQuery, filters, selectedDoctor, setSelectedDoctor, hasActiveFilters, clearFilters } = useDoctorsDirectory();

  useEffect(() => {
    if (selectedDoctor && bookingRef.current) bookingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedDoctor]);

  const handleBookingSuccess = (appointment) => {
    setSelectedDoctor(null);
    toast({
      title: "Appointment request sent",
      description: `Your ${appointment.appointmentType === "online" ? "online" : "in-person"} request with ${appointment.doctorName} was sent for ${appointment.date} at ${appointment.time}.`,
    });
    navigate("/dashboard/patient/appointments");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <DirectoryHeader onBack={() => navigate("/dashboard/patient/services")} />
        <DirectoryFilters filters={filters} hasActiveFilters={hasActiveFilters} clearFilters={clearFilters} />
        <DirectoryBookingPanel bookingRef={bookingRef} doctor={selectedDoctor} onSuccess={handleBookingSuccess} onCancel={() => setSelectedDoctor(null)} />
        <DoctorDirectoryResults doctors={doctorsQuery.data} isLoading={doctorsQuery.isLoading} hasActiveFilters={hasActiveFilters} clearFilters={clearFilters} onBook={setSelectedDoctor} />
      </motion.div>
    </div>
  );
}
