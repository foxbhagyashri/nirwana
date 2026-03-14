import StatusPage from "@/components/PaymentSuccess";

// For static export, we need to generate at least one static param
// Payment IDs are dynamic, so we generate placeholder routes for common statuses
// The actual payment data will be fetched client-side based on the ID in the URL
export async function generateStaticParams() {
  const statuses = ['success', 'failure', 'pending', 'cancelled'];
  // Generate placeholder routes - actual payment IDs are handled client-side
  return statuses.map((status) => ({
    status,
    id: 'placeholder', // Placeholder ID - actual IDs work via client-side routing
  }));
}

// Note: For static export, payment routes with actual IDs will work via client-side navigation
// The placeholder routes ensure the build succeeds, but real payment pages work client-side
export default function Page({ params }: { params: { status: string; id: string } }) {
  return <StatusPage status={params.status} id={params.id} />;
}

