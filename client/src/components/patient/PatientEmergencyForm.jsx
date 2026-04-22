import { AlertTriangle, ArrowLeft, Loader2, LocateFixed, MapPin } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LiveLocationMap } from "@/components/LiveLocationMap";

export function PatientEmergencyForm({ form, geoState, hasGpsCoordinates, createRequest, navigate, onSubmit }) {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard/patient")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>

        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">Emergency Request</h1>
          <p className="mt-2 text-muted-foreground">Share your location and send the request</p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-lg sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <FormLabel className="mb-0">Location</FormLabel>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {geoState.isLocating ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Detecting GPS
                          </>
                        ) : hasGpsCoordinates ? (
                          <>
                            <LocateFixed className="h-3.5 w-3.5 text-emerald-600" /> Live GPS ready
                          </>
                        ) : null}
                      </div>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input {...field} placeholder="Detecting location..." className="pl-10" />
                      </div>
                    </FormControl>
                    {geoState.error ? (
                      <p className="text-sm text-amber-700">{geoState.error}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Keep this screen open after sending so responders can follow your live GPS.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {hasGpsCoordinates ? (
                <LiveLocationMap
                  latitude={geoState.latitude}
                  longitude={geoState.longitude}
                  title="Preview your live map"
                  description="This is the map responders will see after you send the request."
                  height="h-52"
                />
              ) : null}

              <Button type="submit" className="btn-emergency w-full text-xl" disabled={createRequest.isPending}>
                {createRequest.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Sending...
                  </>
                ) : (
                  "SEND EMERGENCY ALERT"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
