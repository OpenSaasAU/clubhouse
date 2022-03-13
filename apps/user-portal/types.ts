export type User = {
  id: string;
  email: string;
  name: string;
  preferredName: string;
  phone: string;
  memberships: Membership[];
  householdMembers: string[];
};

export type Subscription = {
  id: string;
  name: string;
};
export type Variation = {
  id: string;
  name: string;
};

export type Membership = {
  id: string;
  name: string;
  variation: Variation;
  startDate: string;
  renewalDate: string;
  status: string;
};
