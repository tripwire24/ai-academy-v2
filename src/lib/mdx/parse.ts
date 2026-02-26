import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';

export async function parseMdx(source: string) {
  try {
    const mdxSource = await serialize(source, {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              properties: {
                className: ['anchor'],
              },
            },
          ],
          rehypeHighlight,
        ],
        format: 'mdx',
      },
    });

    return mdxSource;
  } catch (error) {
    console.error('MDX Parsing Error:', error);
    throw new Error('Failed to parse MDX content');
  }
}
