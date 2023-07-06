import { json, type LinksFunction, type LoaderArgs } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import { authenticator } from "./services/auth.server";
import { ReactNode } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </Layout>
      </body>
    </html>
  );
}

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request);

  return json({ user });
}

function Layout({ children }: { children: ReactNode }) {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div>
      <nav className="flex px-10 py-5 justify-between fixed top-0 left-0 w-full bg-white">
        <h1 className="text-black text-3xl font-bold">
          Marshal <span className="text-teal-500">Chat</span>
        </h1>

        {user ? (
          <Form method="POST" action="/logout" className="flex itesm-center">
            <img
              src={user.imageUrl}
              alt="User profile photo"
              className="w-12 h-12 rounded-full mr-3"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-red-300 transition duration-100 hover:bg-red-600 md:text-base"
            >
              Logout
            </button>
          </Form>
        ) : (
          <Form method="POST" action="/auth/github">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-teal-300 transition duration-100 hover:bg-teal-600 md:text-base"
            >
              Login
            </button>
          </Form>
        )}
      </nav>

      <main>{children}</main>
    </div>
  );
}
