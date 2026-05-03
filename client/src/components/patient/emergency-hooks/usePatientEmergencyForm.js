import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEmergencyRequestSchema } from "@shared/schema";

export function usePatientEmergencyForm(patientName) {
  const form = useForm({
    resolver: zodResolver(insertEmergencyRequestSchema),
    defaultValues: {
      name: patientName,
      age: 0,
      emergencyType: "Emergency Help",
      description: "",
      location: 'Tap "Use my live location" to share GPS',
      urgency: "High",
      latitude: null,
      longitude: null,
    },
  });

  useEffect(() => {
    form.setValue("name", patientName);
  }, [form, patientName]);

  return form;
}
