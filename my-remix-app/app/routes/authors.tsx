import {  LoaderFunction, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { Card, Page } from "@shopify/polaris";

export const loader: LoaderFunction = async ({ request }) => {
    return "";
  };

export default function Login() {
     useLoaderData();

  return (
    <Page title="Login">
      <Card>
        
      </Card>
    </Page>
  );
}
