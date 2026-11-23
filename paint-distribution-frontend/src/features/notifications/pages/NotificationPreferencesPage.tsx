import { Link } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { NotificationPreferencesForm } from "../components";

import { useNotificationPreferences } from "../hooks/useNotificationPreferences";
import { useNotificationMutations } from "../hooks/useNotificationMutations";

import type { NotificationPreferenceValues } from "../types/notification.types";

export function NotificationPreferencesPage() {
  const { data: preferences, isLoading, error } = useNotificationPreferences();

  const { updatePreferences } = useNotificationMutations();

  const handleSubmit = async (values: NotificationPreferenceValues) => {
    await updatePreferences.mutateAsync(values);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/notifications">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Notification preferences</h1>
          <p className="text-sm text-muted-foreground">
            Control how and when you receive business notifications.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <Settings className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Notification settings</CardTitle>
              <CardDescription>
                Customize notification categories, delivery channels, and quiet
                hours.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading notification preferences...
            </p>
          ) : error || !preferences ? (
            <p className="py-8 text-center text-sm text-destructive">
              Unable to load notification preferences.
            </p>
          ) : (
            <NotificationPreferencesForm
              preferences={{
                categories: preferences.categories,
                emailAddress: preferences.emailAddress,
                phoneNumber: preferences.phoneNumber,
                quietHoursEnabled: preferences.quietHoursEnabled,
                quietHoursStart: preferences.quietHoursStart,
                quietHoursEnd: preferences.quietHoursEnd,
              }}
              onSubmit={handleSubmit}
              isSubmitting={updatePreferences.isPending}
            />
          )}

          {updatePreferences.isError && (
            <p className="mt-4 text-sm text-destructive">
              {updatePreferences.error.message ||
                "Unable to save notification preferences."}
            </p>
          )}

          {updatePreferences.isSuccess && (
            <p className="mt-4 text-sm text-green-600">
              Notification preferences saved successfully.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
