export interface Subdomain {
  subdomain: string;
  description: string;
  createdAt: string;
}

interface GitHubRepo {
  homepage: string | null;
  description: string | null;
  created_at: string;
  archived: boolean;
}

/**
 * Fetches public owned GitHub repos for `maxrchung` and returns `*.max.rodeo` subdomain sites, sorted newest-first.
 */
export async function fetchSubdomains() {
  const sites: Subdomain[] = [];

  for (let page = 1; ; page++) {
    const endpoint = `https://api.github.com/users/maxrchung/repos?per_page=100&sort=created&direction=desc&type=owner&page=${page}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
    }

    const batch = (await response.json()) as GitHubRepo[];
    for (const repo of batch) {
      if (repo.archived) continue;

      const match = repo.homepage
        ?.trim()
        .match(/^https?:\/\/([^/]+)\.max\.rodeo/i);
      if (!match) continue;

      const subdomain = match[1].toLowerCase();
      sites.push({
        subdomain,
        description: repo.description?.trim() ?? "",
        createdAt: repo.created_at,
      });
    }

    if (batch.length < 100) break;
  }

  return sites.sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

if (import.meta.main) {
  console.log(JSON.stringify(await fetchSubdomains(), null, 2));
}
