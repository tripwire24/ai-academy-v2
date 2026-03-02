import { compileMDX } from 'next-mdx-remote/rsc';
import { mdxComponents } from './components';

export async function parseMDX(source: string) {
  const { content, frontmatter } = await compileMDX<{ title?: string; description?: string; [key: string]: any }>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    },
    components: mdxComponents,
  });

  return { content, frontmatter };
}
