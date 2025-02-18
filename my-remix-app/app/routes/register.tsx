import { Form, useActionData  } from "@remix-run/react";
import { ActionFunction, redirect } from "@remix-run/node";
import axios from "axios";
import { Card, TextField, Button, Select, Checkbox, FormLayout, Page } from "@shopify/polaris";
import { useState } from "react";
import { commitSession, getSession } from "../session-server";

// Define the expected API response structure
interface RegisterData {
    email: string;
    roles: string[];
    password: string;
    first_name: string;
    last_name: string;
    gender: "male" | "female" | "other";
    active: boolean;
  }

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  const data: RegisterData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    gender: formData.get("gender") as "male" | "female" | "other",
    roles: [formData.get("roles") as string], // Assuming a single role selection for now
    active: formData.get("active") === "on",
  };
  console.log("email",data);
  

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://candidate-testing.com/api/v2/users",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const response = await axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return JSON.stringify(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

    console.log("response",response);
    

  if (response) {
    const session = await getSession();
    session.set("authtoken", `${response}`); // Mock user ID

    return redirect("/authors", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

};

export default function Login() {
  const actionData = useActionData<{ error?: string }>();

  console.log("actionData", actionData);
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [roles, setRoles] = useState("user");
  const [active, setActive] = useState(true);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  return (
    <Page title="Register">
     <Card >
      <Form method="post">
        <FormLayout>
          {/* Email Field */}
          <TextField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" requiredIndicator />
          
          {/* Password Field */}
          <TextField label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" requiredIndicator />

          {/* First Name & Last Name */}
          <TextField label="First Name" value={firstName} onChange={setFirstName} requiredIndicator autoComplete="false" />
          <TextField label="Last Name" value={lastName} onChange={setLastName} requiredIndicator autoComplete="false" />

          {/* Gender Selection */}
          <Select label="Gender" options={genderOptions} onChange={setGender} value={gender} />

          {/* Roles Selection (Assuming user/admin) */}
          <Select
            label="Role"
            options={[
              { label: "User", value: "user" },
              { label: "Admin", value: "admin" },
            ]}
            onChange={setRoles}
            value={roles}
          />

          {/* Active Status Checkbox */}
          <Checkbox label="Active" checked={active} onChange={setActive} />

          {/* Submit Button */}
          <Button submit primary >
            Register
          </Button>

          {/* Display Success/Error Message */}
          {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
          {actionData?.success && <p style={{ color: "green" }}>{actionData.success}</p>}
        </FormLayout>
      </Form>
    </Card>

    </Page>
  );
}
