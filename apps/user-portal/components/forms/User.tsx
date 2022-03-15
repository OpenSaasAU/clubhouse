import { Form } from 'react-bootstrap';
import getConfig from 'next/config';
import { Field } from './householdMembers';

export function User({ ...props }) {
  const { inputs, handleChange } = props;
  return (
    <>
      <Form.Group>
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          autoComplete="name"
          required
          name="name"
          type="text"
          placeholder="Name"
          onChange={handleChange}
          value={inputs.name}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Preferred Name - what should we call you?</Form.Label>
        <Form.Control
          autoComplete="name"
          required
          name="prefName"
          type="text"
          placeholder="Preferred Name"
          onChange={handleChange}
          value={inputs.prefName}
        />
      </Form.Group>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          autoComplete="email"
          required
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={inputs.email}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          required
          name="phone"
          type="text"
          placeholder="Phone Number"
          onChange={handleChange}
          value={inputs.phone}
        />
      </Form.Group>
      <Form.Group>
        <Field
          label="Household Members"
          value={inputs.householdMembers}
          onChange={handleChange}
        />
      </Form.Group>
    </>
  );
}
