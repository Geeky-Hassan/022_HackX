import {client} from "@/sanity/lib/client";

export const getTeamData = async () => {
  const query = `
    *[_type == "teamSection"] | order(priority asc) {
      name,
      role,
      priority,
      "img": img.asset->url,
      linkedin
    }
  `;
  return await client.fetch(query);
};
