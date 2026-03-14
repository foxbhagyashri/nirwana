import { CancellationPolicy } from "@/components/CancellationPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cancellation Policy - Nirwana Stays",
    description: "Cancellation and refund policy for Nirwana Stays Pawna Lake resort bookings."
};

export default function Page() {
  return <CancellationPolicy />;
}

