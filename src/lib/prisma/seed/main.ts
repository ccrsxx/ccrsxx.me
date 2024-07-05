/* eslint-disable no-console */

import { join } from 'path';
import { readdir } from 'fs/promises';
import { prisma } from '@lib/db';
import { removeContentExtension } from '@lib/helper';
import type { ContentType } from '@prisma/client';

async function backfillUser(): Promise<string> {
  const user = await prisma.user.upsert({
    where: {
      email: 'me@risalamin.com'
    },
    create: {
      role: 'AUTHOR',
      name: 'Risal Amin',
      image:
        'https://raw.githubusercontent.com/ccrsxx/portofolio/main/public/assets/emilia.png',
      email: 'me@risalamin.com',
      githubId: '55032197',
      githubUsername: 'ccrsxx'
    },
    update: {}
  });

  return user.id;
}

async function backfillBlogAndProjects(): Promise<void> {
  const contents = await getSeedContents();

  for (const content of contents) {
    const { type, slug } = content;

    await prisma.content.upsert({
      where: {
        slug
      },
      create: {
        type,
        slug,
        User: {
          connect: {
            githubId: '55032197'
          }
        }
      },
      update: {}
    });
  }
}

type MarkedContent = {
  type: ContentType;
  slug: string;
};

export async function getSeedContents(): Promise<MarkedContent[]> {
  const blogs = await readdir(join('src', 'pages', 'blog'), 'utf-8');
  const projects = await readdir(join('src', 'pages', 'projects'), 'utf-8');

  const markedBlogs: MarkedContent[] = blogs.map((blog) => ({
    type: 'BLOG',
    slug: removeContentExtension(blog)
  }));

  const markedProjects: MarkedContent[] = projects.map((project) => ({
    type: 'PROJECT',
    slug: removeContentExtension(project)
  }));

  return [...markedBlogs, ...markedProjects];
}

async function main(): Promise<void> {
  try {
    await backfillUser();
    await backfillBlogAndProjects();

    await prisma.$disconnect();

    process.exit(0);
  } catch (err) {
    console.error(err);

    await prisma.$disconnect();

    process.exit(1);
  }
}

if (require.main === module) void main();
