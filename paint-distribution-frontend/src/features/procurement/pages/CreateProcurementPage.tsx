import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcurementForm } from "../components/ProcurementForm";
import { useProcurementMutations } from "../hooks/useProcurementMutations";

export function CreateProcurementPage() {
  const navigate = useNavigate();
  const { createRequest } = useProcurementMutations();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="ghost">
        <Link to="/procurement">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to procurement
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Create procurement request</h1>
        <p className="text-muted-foreground">
          Provide the details and products required for this request.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProcurementForm
            isSubmitting={createRequest.isPending}
            onSubmit={(input) =>
              createRequest.mutate(input, {
                onSuccess: (request) => navigate(`/procurement/${request.id}`),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
