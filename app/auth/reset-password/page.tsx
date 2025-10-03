import { Suspense } from "react";
import ResetFormClient from "./ResetFormClient";

export const dynamic = "force-dynamic"; 

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <ResetFormClient />
    </Suspense>
  );
}
