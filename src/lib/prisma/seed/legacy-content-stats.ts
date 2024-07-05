/* eslint-disable no-console */

import { doc, getDoc } from 'firebase/firestore';
import { prisma } from '@lib/db';
import { db } from '@lib/firebase/app';
import { getSeedContents } from './main';

async function backfillLegacyStats(): Promise<void> {
  await prisma.ipAddress.upsert({
    where: {
      ipAddress: 'placeholder'
    },
    create: {
      ipAddress: 'placeholder'
    },
    update: {}
  });

  const contents = await getSeedContents();

  for (const content of contents) {
    const { slug } = content;

    const contentFirebase = await getDoc(doc(db, 'contents', slug));

    const { views, likes } = contentFirebase.data() as Record<
      'views' | 'likes',
      number
    >;

    const currentContentViews = await prisma.contentView.count({
      where: {
        content: {
          slug
        }
      }
    });

    const needsToBackfillViews = currentContentViews < views;

    if (needsToBackfillViews) {
      const backfillViewsTimes = views - currentContentViews;

      console.log(`Backfilling ${backfillViewsTimes} views for ${slug}`);

      const backfillPromises = Array.from({ length: backfillViewsTimes }).map(
        () =>
          prisma.contentView.create({
            data: {
              ipAddress: {
                connect: {
                  ipAddress: 'placeholder'
                }
              },
              content: {
                connect: {
                  slug
                }
              }
            }
          })
      );

      await Promise.all(backfillPromises);
    }

    const currentContentLikes = await prisma.contentLike.count({
      where: {
        content: {
          slug
        }
      }
    });

    const needsToBackfillLikes = currentContentLikes < likes;

    if (needsToBackfillLikes) {
      const backfillLikesTimes = likes - currentContentLikes;

      console.log(`Backfilling ${backfillLikesTimes} likes for ${slug}`);

      const backfillPromises = Array.from({ length: backfillLikesTimes }).map(
        () =>
          prisma.contentLike.create({
            data: {
              IpAddress: {
                connect: {
                  ipAddress: 'placeholder'
                }
              },
              content: {
                connect: {
                  slug
                }
              }
            }
          })
      );

      await Promise.all(backfillPromises);
    }

    console.log({ views, likes, currentContentViews, currentContentLikes });
  }
}

async function main(): Promise<void> {
  await backfillLegacyStats();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
