import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export function RatingDialog({
  title = "Rate",
  description = "Leave a quick rating.",
  trigger,
  onSubmit,
  loading = false,
  defaultRating = 0,
  defaultFeedback = "",
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(defaultRating);
  const [feedback, setFeedback] = useState(defaultFeedback);

  const handleSubmit = async () => {
    if (!rating || loading) return;
    await onSubmit?.({ rating, feedback });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((value) => {
              const active = rating >= value;
              return (
                <button key={value} type="button" className="rounded-full p-1" onClick={() => setRating(value)}>
                  <Star className={`h-6 w-6 ${active ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                </button>
              );
            })}
          </div>

          <Textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Optional feedback"
            className="rounded-2xl"
          />

          <Button className="w-full rounded-2xl" disabled={loading || !rating} onClick={handleSubmit}>
            {loading ? "Saving..." : "Submit Rating"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
