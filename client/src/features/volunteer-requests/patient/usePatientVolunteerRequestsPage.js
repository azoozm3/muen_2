import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  useCancelVolunteerRequest,
  useCreateVolunteerRequest,
  useRateVolunteerRequest,
  useVolunteerRequests,
} from "@/hooks/use-volunteer-requests";
import {
  applyUserDefaults,
  INITIAL_VOLUNTEER_REQUEST_FORM,
  splitVolunteerRequests,
} from "./volunteerRequestPageUtils";

export function usePatientVolunteerRequestsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data = [], isLoading } = useVolunteerRequests();
  const createMutation = useCreateVolunteerRequest();
  const cancelMutation = useCancelVolunteerRequest();
  const rateMutation = useRateVolunteerRequest();

  const [showForm, setShowForm] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [form, setForm] = useState(INITIAL_VOLUNTEER_REQUEST_FORM);

  useEffect(() => {
    setForm((current) => applyUserDefaults(current, user));
  }, [user?.name, user?.phone]);

  const { current, history } = useMemo(() => splitVolunteerRequests(data), [data]);

  const updateForm = (key, value) => {
    setForm((currentValue) => ({ ...currentValue, [key]: value }));
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser does not support live location.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude.toFixed(6));
        const longitude = Number(position.coords.longitude.toFixed(6));

        setForm((currentValue) => ({
          ...currentValue,
          latitude,
          longitude,
          address: `Live location: ${latitude}, ${longitude}`,
        }));

        setIsLocating(false);
        toast({ title: "Live location captured" });
      },
      () => {
        setIsLocating(false);
        toast({
          title: "Could not get location",
          description: "Allow location access and try again.",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const submitRequest = async (event) => {
    event.preventDefault();

    try {
      await createMutation.mutateAsync({ body: form });

      setForm((currentValue) => ({
        ...INITIAL_VOLUNTEER_REQUEST_FORM,
        patientName: currentValue.patientName,
        patientPhone: currentValue.patientPhone,
      }));

      setShowForm(false);
      toast({ title: "Volunteer request created" });
    } catch (error) {
      toast({
        title: "Could not create request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const cancelRequest = async (id) => {
    try {
      await cancelMutation.mutateAsync({ id });
      toast({ title: "Request cancelled" });
    } catch (error) {
      toast({
        title: "Could not cancel request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const rateVolunteer = async (id, body) => {
    try {
      await rateMutation.mutateAsync({ id, body });
      toast({ title: `Volunteer rated successfully: ${body.rating} ★` });
    } catch (error) {
      toast({
        title: "Could not save rating",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    current,
    history,
    showForm,
    setShowForm,
    isLocating,
    form,
    updateForm,
    captureLocation,
    submitRequest,
    cancelRequest,
    rateVolunteer,
    createMutation,
    cancelMutation,
    rateMutation,
    cancelPending: cancelMutation.isPending,
    ratePending: rateMutation.isPending,
  };
}
