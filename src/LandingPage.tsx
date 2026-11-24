import type { Subdomain } from "./fetchSubdomains";

export const LandingPage = ({ subdomains }: { subdomains: Subdomain[] }) => {
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
            {subdomains.map((site, index) => (
              <li key={site.subdomain} style={{ marginLeft: index * 2 }}>
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
