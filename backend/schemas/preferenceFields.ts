import { checkbox, select } from "@keystone-6/core/fields";

export const preferenceFields = {
  contactPreference: select({
    options: [
      { label: "Email", value: "email" },
      { label: "SMS", value: "sms" },
    ],
  }),
  receiveRenewal: checkbox({
    defaultValue: false,
    label: "Receive Membership Renewal reminders",
  }),
};

export type Preference = keyof typeof preferenceFields;

export const permissionsList: Preference[] = Object.keys(
  preferenceFields
) as Preference[];
