import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcurementForm } from "../components/ProcurementForm";
import { useProcurementRequest } from "../hooks/useProcurementRequest";
import { useProcurementMutations } from "../hooks/useProcurementMutations";

export function EditProcurementPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProcurementRequest(id);
  const { updateRequest } = useProcurementMutations();

  if (isLoading) return <p className="p-8 text-center">Loading request...</p>;

  if (isError || !data) {
    return (
      <div className="rounded-lg border p-8 text-center text-destructive">
        Procurement request not found.
      </div>
    );
  }

  if (!["draft", "rejected"].includes(data.status)) {
    return (
      <div className="space-y-3 rounded-lg border p-8 text-center">
        <p>This request can no longer be edited.</p>
        <Button asChild variant="outline">
          <Link to={`/procurement/${id}`}>Return to request</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="ghost">
        <Link to={`/procurement/${id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to request
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Edit procurement request</h1>
        <p className="text-muted-foreground">{data.requestNumber}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update request information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProcurementForm
            initialData={data}
            isSubmitting={updateRequest.isPending}
            onSubmit={(input) =>
              updateRequest.mutate(
                { id, input },
                { onSuccess: () => navigate(`/procurement/${id}`) },
              )
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
