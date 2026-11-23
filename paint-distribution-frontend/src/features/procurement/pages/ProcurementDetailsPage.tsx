import { useParams } from "react-router-dom";
import { ProcurementDetails } from "../components/ProcurementDetails";
import { useProcurementRequest } from "../hooks/useProcurementRequest";

export function ProcurementDetailsPage() {
  const { id = "" } = useParams();
  const { data, isLoading, isError, refetch } = useProcurementRequest(id);

  if (isLoading) {
    return <div className="p-8 text-center">Loading request...</div>;
  }

  if (isError || !data) {
    return (
      <div className="space-y-3 rounded-lg border p-8 text-center">
        <p className="text-destructive">Procurement request not found.</p>
        <button className="text-sm underline" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }

  return <ProcurementDetails request={data} />;
}
