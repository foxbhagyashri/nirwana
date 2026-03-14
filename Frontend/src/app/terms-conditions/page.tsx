import { TermsConditions } from "@/components/TermsConditions";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions - Nirwana Stays",
    description: "Terms and conditions for booking and staying at Nirwana Stays Pawna Lake resort."
};

export default function Page() {
  return <TermsConditions />;
}

