import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { fetchSubdomains } from "./fetchSubdomains";
import { LandingPage } from "./LandingPage";

let subdomains = await fetchSubdomains();
setInterval(async () => {
  try {
    subdomains = await fetchSubdomains();
  } catch (error) {
    console.error("Failed to refresh subdomains:", error);
  }
}, 60 * 60 * 1000); // Refetch every hour

export const app = new Hono();

app.use(jsxRenderer());

app.get(
  "/favicon.svg",
  () =>
    new Response(Bun.file("./public/favicon.svg"), {
      headers: { "Content-Type": "image/svg+xml" },
    }),
);
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
