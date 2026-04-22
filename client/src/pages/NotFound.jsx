import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-12 pb-12">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-6">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <h1 className="mb-4 text-2xl font-bold text-slate-900">Page Not Found</h1>
          <p className="mb-8 text-slate-600">
            The page you are looking for doesn't exist or has been moved.
          </p>

          <Link href="/">
            <Button className="btn-primary w-full sm:w-auto">
              Return Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
