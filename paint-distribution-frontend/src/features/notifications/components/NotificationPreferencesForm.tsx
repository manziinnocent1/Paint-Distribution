import { useEffect, useState, type FormEvent } from "react";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import type {
  NotificationCategory,
  NotificationPreferenceValues,
} from "../types/notification.types";

import { NOTIFICATION_CHANNEL_OPTIONS } from "../constants/notification.constants";

interface Props {
  preferences: NotificationPreferenceValues;
  onSubmit: (values: NotificationPreferenceValues) => void;
  isSubmitting?: boolean;
}

const categories: {
  value: NotificationCategory;
  label: string;
}[] = [
  { value: "orders", label: "Orders" },
  { value: "payments", label: "Payments" },
  { value: "inventory", label: "Inventory" },
  { value: "deliveries", label: "Deliveries" },
  { value: "customers", label: "Customers" },
  { value: "system", label: "System updates" },
];

const channelIcons = {
  in_app: Bell,
  email: Mail,
  sms: MessageSquare,
  push: Smartphone,
};

export function NotificationPreferencesForm({
  preferences,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const [values, setValues] =
    useState<NotificationPreferenceValues>(preferences);

  const [error, setError] = useState("");

  useEffect(() => {
    setValues(preferences);
  }, [preferences]);

  const updateCategory = (
    category: NotificationCategory,
    key: "enabled" | "inApp" | "email" | "sms" | "push",
    checked: boolean,
  ) => {
    setValues((current) => ({
      ...current,
      categories: {
        ...current.categories,
        [category]: {
          ...current.categories[category],
          [key]: checked,
        },
      },
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (
      values.emailAddress &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailAddress)
    ) {
      setError("Enter a valid email address.");
      return;
    }

    if (
      values.quietHoursEnabled &&
      values.quietHoursStart === values.quietHoursEnd
    ) {
      setError("Quiet hours must have different start and end times.");
      return;
    }

    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Notification categories</h2>
          <p className="text-sm text-muted-foreground">
            Choose which types of updates you want to receive.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left font-medium">Category</th>
                <th className="p-3 text-center font-medium">Enabled</th>

                {NOTIFICATION_CHANNEL_OPTIONS.map((channel) => (
                  <th
                    key={channel.value}
                    className="p-3 text-center font-medium"
                  >
                    {channel.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.value} className="border-t">
                  <td className="p-3 font-medium">{category.label}</td>

                  <td className="p-3 text-center">
                    <Checkbox
                      checked={values.categories[category.value].enabled}
                      onCheckedChange={(checked) =>
                        updateCategory(
                          category.value,
                          "enabled",
                          checked === true,
                        )
                      }
                      aria-label={`Enable ${category.label}`}
                    />
                  </td>

                  {NOTIFICATION_CHANNEL_OPTIONS.map((channel) => {
                    const key = {
                      in_app: "inApp",
                      email: "email",
                      sms: "sms",
                      push: "push",
                    }[channel.value] as "inApp" | "email" | "sms" | "push";

                    return (
                      <td key={channel.value} className="p-3 text-center">
                        <Checkbox
                          checked={values.categories[category.value][key]}
                          disabled={!values.categories[category.value].enabled}
                          onCheckedChange={(checked) =>
                            updateCategory(
                              category.value,
                              key,
                              checked === true,
                            )
                          }
                          aria-label={`${channel.label} for ${category.label}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Contact information</h2>
          <p className="text-sm text-muted-foreground">
            Set the email address and phone number used for notifications.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="notification-email">Email address</Label>
            <Input
              id="notification-email"
              type="email"
              value={values.emailAddress}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  emailAddress: event.target.value,
                }))
              }
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification-phone">Phone number</Label>
            <Input
              id="notification-phone"
              type="tel"
              value={values.phoneNumber}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  phoneNumber: event.target.value,
                }))
              }
              placeholder="+250..."
            />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Quiet hours</h2>
          <p className="text-sm text-muted-foreground">
            Configure the hours when non-urgent notifications should be
            silenced. Actual delivery behavior must be enforced by the
            notification backend.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="quiet-hours"
            checked={values.quietHoursEnabled}
            onCheckedChange={(checked) =>
              setValues((current) => ({
                ...current,
                quietHoursEnabled: checked === true,
              }))
            }
          />

          <Label htmlFor="quiet-hours">Enable quiet hours</Label>
        </div>

        {values.quietHoursEnabled && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quiet-start">Start time</Label>
              <Input
                id="quiet-start"
                type="time"
                value={values.quietHoursStart}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    quietHoursStart: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quiet-end">End time</Label>
              <Input
                id="quiet-end"
                type="time"
                value={values.quietHoursEnd}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    quietHoursEnd: event.target.value,
                  }))
                }
              />
            </div>
          </div>
        )}
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving preferences..." : "Save preferences"}
        </Button>
      </div>
    </form>
  );
}
