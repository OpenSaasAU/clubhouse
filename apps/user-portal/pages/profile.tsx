import { Button, Form, Alert, Row } from 'react-bootstrap';
import { FormEvent, useState } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import gql from 'graphql-tag';
import nProgress from 'nprogress';
import getConfig from 'next/config';
import { CURRENT_USER_QUERY, useForm, useUser } from '../lib/form';
import { User } from '../components/forms';
import { SigninButton } from '../components/SigninButton';
import { ManageStripeButton } from '../components/ManageStripeButton';

const UPDATE_USER_MUTATION = gql`
  mutation UPDATE_USER_MUTATION(
    $userId: ID!
    $email: String!
    $name: String!
    $phone: String
    $prefName: String
    $householdMembers: JSON
  ) {
    updateUser(
      where: { id: $userId }
      data: {
        email: $email
        name: $name
        preferredName: $prefName
        phone: $phone
        householdMembers: $householdMembers
      }
    ) {
      id
    }
  }
`;

export default function Profile() {
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const {
    inputs,
    handleChange,
    resetForm,
    handleStageButton,
    clearForm,
  }: {
    inputs: any;
    handleChange: any;
    resetForm: any;
    handleStageButton: any;
    clearForm: any;
  } = useForm({
    email: user?.email || '',
    name: user?.name || '',
    prefName: user?.preferredName || '',
    phone: user?.phone || '',
    householdMembers: JSON.stringify(user?.householdMembers || []),
  });

  const [updateUser, { error: updateError }] = useMutation(
    UPDATE_USER_MUTATION,
    {
      // variables: inputs,
      // refetch the currently logged in user
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  const { publicRuntimeConfig } = getConfig();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    nProgress.start();
    await updateUser({
      variables: {
        userId: user.id,
        ...inputs,
        householdMembers: JSON.parse(inputs.householdMembers),
      },
    });
    setLoading(false);
    nProgress.done();
  }

  if (!user) return <SigninButton />;
  return (
    <>
      <h3> Update Your Profile</h3>
      <Form onSubmit={async (e) => handleSubmit(e)}>
        <User inputs={inputs} handleChange={handleChange} />
        <br />
        <Button type="submit">Update...</Button>
      </Form>
      {user.memberships.map((membership: any) => (
        <Row key={membership.id}>
          <br />
          <h2>{membership.variation.name}</h2>
          <p>
            Status - {membership.status}
            <br />
            Renewal Date - {membership.renewalDate}
          </p>
          <ManageStripeButton />
          <br />
        </Row>
      ))}
    </>
  );
}
