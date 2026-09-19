import { getCollection, type CollectionEntry } from "astro:content";

export const BLOG_OG_WIDTH = 1200;
export const BLOG_OG_HEIGHT = 630;

export type BlogPost = CollectionEntry<"blog">;

export function blogPath(id: string): string {
  return `/blog/${id}/`;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog", ({ data }) => data.draft !== true);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatBlogDate(date: Date): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function blogIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
