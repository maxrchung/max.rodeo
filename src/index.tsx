import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { fetchSubdomains, type Subdomain } from "./fetchSubdomains";

let subdomains = await fetchSubdomains();
setInterval(async () => {
  try {
    subdomains = await fetchSubdomains();
  } catch (error) {
    console.error("Failed to refresh subdomains:", error);
  }
}, 60 * 60 * 1000); // Refetch every hour

const LandingPage = ({ subdomains }: { subdomains: Subdomain[] }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light" />
        <title>max.rodeo</title>
        <meta name="description" content="Landing page for my web projects" />
        <meta property="og:title" content="max.rodeo" />
        <meta property="og:description" content="Landing page for my web projects" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://max.rodeo" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="240x240" />
        <link rel="stylesheet" href="/reset.css" />
        <link rel="stylesheet" href="/styles.css" />
      </head>

      <body>
        <main>
          <h1><span>max</span>.rodeo</h1>

          <p>
            Here are some of <a class="me" href="https://maxrchung.com">my</a> hosted web
            projects:
          </p>

          <ul>
            {subdomains.map((site) => (
              <li key={site.subdomain}>
                <a href={`https://${site.subdomain}.max.rodeo`}>
                  {site.subdomain}
                </a>
                <br />
                {site.description ? ` ${site.description}` : null}
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
};

export const app = new Hono();

app.use(jsxRenderer());

app.get(
  "/favicon.ico",
  () =>
    new Response(Bun.file("./public/favicon.ico"), {
      headers: { "Content-Type": "image/x-icon" },
    }),
);
app.get(
  "/reset.css",
  () =>
    new Response(Bun.file("./public/reset.css"), {
      headers: { "Content-Type": "text/css; charset=utf-8" },
    }),
);
app.get(
  "/styles.css",
  () =>
    new Response(Bun.file("./public/styles.css"), {
      headers: { "Content-Type": "text/css; charset=utf-8" },
    }),
);

app.get("/", (context) => {
  if (Bun.env.RAILWAY_ENVIRONMENT) {
    context.header("Cache-Control", "max-age=3600");
  }
  return context.render(<LandingPage subdomains={subdomains} />);
});

export default {
  port: Number(Bun.env.PORT) || 8080,
  fetch: app.fetch,
};
