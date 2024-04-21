import { HTMLAttributes } from 'react';
import { remark } from 'remark';
import html from 'remark-gfm';
import remarkGfm from 'remark-html';

import { cn } from '@/lib/utils';

interface TextRendererProps
  extends Partial<Omit<HTMLAttributes<HTMLParagraphElement>, 'children' | 'dangerouslySetInnerHTML'>> {
  content: string;
}

export async function TextRenderer({ content, className, ...props }: TextRendererProps) {
  const processedContent = await remark().use(remarkGfm).use(html).process(content);
  const contentHtml = processedContent.toString();

  // eslint-disable-next-line react/no-danger
  return <div className={cn('mdxcontent', className)} dangerouslySetInnerHTML={{ __html: contentHtml }} {...props} />;
}
