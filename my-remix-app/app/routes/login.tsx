import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, redirect } from "@remix-run/node";
import axios from "axios";
import { Card, Page, TextField, Button, FormLayout } from "@shopify/polaris";
import { useState } from "react";
import { commitSession, getSession } from "../session-server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  console.log("email", email, "password", password);

  // 🛑 Replace with real authentication logic
//   if (email !== "admin@admin.com" || password !== "password123") {
//     return json({ error: "Invalid credentials" }, { status: 400 });
//   }

  const data = JSON.stringify({
    email: email,
    password: password,
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://candidate-testing.com/api/v2/token",
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Page title="Login">
      <Card>
        <Form method="post">
          <FormLayout>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              name="email"
              autoComplete="email"
              requiredIndicator
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              name="password"
              autoComplete="current-password"
              requiredIndicator
            />
            <Button submit>Login</Button>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}
