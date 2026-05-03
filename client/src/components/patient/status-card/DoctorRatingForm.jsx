import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function DoctorRatingForm({ rating, comment, setRating, setComment, isSavingReview, onSubmit }) {
  return (
    <div className="mt-6 rounded-xl border bg-slate-50 p-4">
      <h3 className="mb-1 font-semibold">Rate doctor</h3>
      <p className="mb-3 text-sm text-muted-foreground">Add your rating after this emergency case.</p>

      <div className="mb-3 flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" onClick={() => setRating(value)} className="transition-transform hover:scale-110">
            <Star className={`h-7 w-7 ${value <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
          </button>
        ))}
      </div>

      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional comment" className="mb-3 min-h-[100px]" />
      <Button onClick={onSubmit} disabled={isSavingReview}>{isSavingReview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Submit doctor rating</Button>
    </div>
  );
}

export default DoctorRatingForm;
