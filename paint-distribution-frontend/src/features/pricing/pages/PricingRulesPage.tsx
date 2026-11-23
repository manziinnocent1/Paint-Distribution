import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriceRuleForm } from "../components";
import { usePricingRules } from "../hooks/usePricing";
import { formatPricingDate, getPricingRuleLabel } from "../utils/pricing.utils";

export function PricingRulesPage() {
  const { data: rules, isLoading, isError } = usePricingRules();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pricing rules</h1>
        <p className="text-sm text-muted-foreground">
          Configure discounts and markups for eligible products and customers.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create pricing rule</CardTitle>
          </CardHeader>
          <CardContent>
            <PriceRuleForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing rules</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading pricing rules...
              </p>
            ) : isError ? (
              <p className="text-sm text-destructive">
                Unable to load pricing rules.
              </p>
            ) : !rules?.length ? (
              <p className="text-sm text-muted-foreground">
                No pricing rules have been created.
              </p>
            ) : (
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="space-y-2 rounded-md border p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{rule.name}</p>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {rule.description || "No description"}
                    </p>

                    <p className="text-sm">
                      {getPricingRuleLabel(rule.type)}:{" "}
                      <span className="font-semibold">{rule.value}</span>
                      {rule.type.includes("percentage") ? "%" : " RWF"}
                    </p>

                    {rule.minimumQuantity && (
                      <p className="text-xs text-muted-foreground">
                        Minimum quantity: {rule.minimumQuantity}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Starts: {formatPricingDate(rule.startsAt)}
                      {rule.endsAt
                        ? ` · Ends: ${formatPricingDate(rule.endsAt)}`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
