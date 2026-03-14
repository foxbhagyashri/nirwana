import { PrivacyPolicy } from "@/components/PrivacyPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - Nirwana Stays",
    description: "Privacy policy and data protection information for Nirwana Stays Pawna Lake resort."
};

export default function Page() {
  return <PrivacyPolicy />;
}

