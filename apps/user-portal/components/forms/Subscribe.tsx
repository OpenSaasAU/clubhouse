import { Form } from "react-bootstrap";
import React from "react";
import getConfig from "next/config";

export function SubscribeForm({ ...props }) {
  const { inputs, handleChange } = props;
  return (
    <>
      <Form.Group>
        <Form.Label>Household Members</Form.Label>
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
    </>
  );
}
