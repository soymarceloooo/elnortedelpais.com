import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Article, ArticleFrontmatter, Property, PropertyFrontmatter } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readMdxFiles<T>(dir: string): (T & { content: string })[] {
  const fullDir = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(fullDir)) return [];

  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".mdx"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(fullDir, file), "utf-8");
    const { data, content } = matter(raw);
    return { ...(data as T), content };
  });
}

export function getAllArticles(): Article[] {
  return readMdxFiles<ArticleFrontmatter>("noticias").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return getAllArticles().filter((a) => a.featured);
}

export function getArticlesBySeries(series: string): Article[] {
  return getAllArticles().filter((a) => a.series === series);
}

export function getAllProperties(): Property[] {
  return readMdxFiles<PropertyFrontmatter>("propiedades").sort((a, b) =>
    a.title.localeCompare(b.title)
  );
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return getAllProperties().find((p) => p.slug === slug);
}

export function getFeaturedProperties(): Property[] {
  return getAllProperties().filter((p) => p.featured);
}

export function getAllTags(): string[] {
  const articles = getAllArticles();
  const tags = new Set<string>();
  articles.forEach((a) => a.tags?.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}
