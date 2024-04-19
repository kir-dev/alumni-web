import { HTMLAttributes } from 'react';
import { remark } from 'remark';
import html from 'remark-gfm';
import remarkGfm from 'remark-html';

interface TextRendererProps extends Partial<Omit<HTMLAttributes<HTMLParagraphElement>, 'children'>> {
  content: string;
}

export async function TextRenderer({ content, className, ...props }: TextRendererProps) {
  const processedContent = await remark().use(remarkGfm).use(html).process(content);
  const contentHtml = processedContent.toString();

  return <div className='mdxcontent' dangerouslySetInnerHTML={{ __html: contentHtml }} />;
}
