import { getDocs, query, where } from 'firebase/firestore';
import { contentsCollection } from '@lib/firebase/collections';
import { isValidContentType } from '@lib/helper-server';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { APIResponse } from '@lib/types/helper';
import type { ContentType } from '@lib/types/contents';
import type { ContentMeta } from '@lib/types/meta';

type FilteredContent = Pick<ContentMeta, 'slug' | 'views' | 'likes'>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<FilteredContent[]>>
): Promise<void> {
  const { type } = req.query as { type: ContentType };

  if (!isValidContentType(type))
    return res.status(400).json({ message: 'Invalid content type' });

  try {
    const contentsSnapshot = await getDocs(
      query(contentsCollection, where('type', '==', type))
    );

    const contents = contentsSnapshot.docs.map((doc) => doc.data());

    const filteredContents: FilteredContent[] = contents.map(
      ({ slug, views, likes }) => ({
        slug,
        views,
        likes
      })
    );

    return res.status(200).json(filteredContents);
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });

    return res.status(500).json({ message: 'Internal server error' });
  }
}
