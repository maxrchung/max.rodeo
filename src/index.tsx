import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { fetchSubdomains, type Subdomain } from "./fetchSubdomains";

let subdomains = await fetchSubdomains();
setInterval(async () => (subdomains = await fetchSubdomains()), 60 * 60 * 1000); // Refetch every hour

function HomePage({ subdomains }: { subdomains: Subdomain[] }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>max.rodeo</title>
      </head>

      <body>
        <main>
          <h1>max.rodeo</h1>

          <p>
            Here are some of <a href="https://maxrchung.com">my</a> web
            projects:
          </p>

          <ul>
            {subdomains.map((site) => (
              <li key={site.subdomain}>
                <a href={`https://${site.subdomain}.max.rodeo`}>
                  {site.subdomain}
                </a>
                {site.description ? ` ${site.description}` : null}
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}

export const app = new Hono();

app.use(jsxRenderer());

app.get("/", (context) => {
  context.header("Cache-Control", "max-age=3600");
  return context.render(<HomePage subdomains={subdomains} />);
});

export default {
  port: Number(Bun.env.PORT) || 8080,
  fetch: app.fetch,
};
