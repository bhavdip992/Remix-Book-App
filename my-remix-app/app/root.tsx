import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { AppProvider, Frame, TopBar, Navigation, Layout, Page } from "@shopify/polaris";
import '@shopify/polaris/build/esm/styles.css';
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

  // 🟢 Sidebar Navigation
  const navigationMarkup = (
    <Navigation location="/">
      <Navigation.Section
        title="Main Menu"
        items={[
          { label: "Authors", url: "/authors" },
          { label: "Books", url: "/books" },
          { label: "Profile", url: "/profile" },
        ]}
      />
    </Navigation>
  );

export default function App() {
  return(
    <AppProvider i18n={{}}>
    <Frame  navigation={navigationMarkup}>
      <Page>
          <Layout>
            <Outlet />
          </Layout>
      </Page>
    
    </Frame>
  </AppProvider>

  );
}
