import { useRouter } from "next/dist/client/router";
import { useForm, useUser } from "../lib/form";
import getConfig from "next/config";

import { FriendSignup } from "../components/forms";

export default function Membership() {
  const user = useUser();
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();
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
    email: "",
    name: "",
    password: "",
    postcode: "",
    suburb: "",
    contact: false,
    terms: false,
    createUser: false,
    friendTerms: false,
    meeting: "",
    feeAmount: 30,
    birthYear: "",
    prefName: "",
    phone: "",
    token: "",
    phoneType: "MOBILE",
  });
  // if user has membership
  if (user) {
    return (
      <>
        <h3>Thanks for becoming a member...</h3>
        <p> If you have any questions please send us an email</p>
        <a href={publicRuntimeConfig?.supportEmail || "set@SUPPORT_EMAIL.env"}>
          {publicRuntimeConfig?.supportEmail || "set@SUPPORT_EMAIL.env"}
        </a>
      </>
    );
  }
  // if no memberships create one
  // 1. Show card list of possible memberships with About modal and create
  // 2. Show form to create a membership
  // 3. Create subscription through stripe
  return (
    <FriendSignup
      inputs={inputs}
      handleChange={handleChange}
      resetForm={resetForm}
      handleStageButton={handleStageButton}
      clearForm={clearForm}
      router={router}
    />
  );
}
