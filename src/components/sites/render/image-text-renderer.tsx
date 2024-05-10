import { ImageRenderer } from '@/components/sites/render/image-renderer';
import { TextRenderer } from '@/components/sites/render/text-renderer';

interface ImageTextRendererProps {
  content: string;
}

export function ImageTextRenderer({ content }: ImageTextRendererProps) {
  let parsedContent = { text: '', image: '' };
  try {
    parsedContent = JSON.parse(content);
  } catch (e) {
    console.error('Error parsing content', e);
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
      <TextRenderer className='mt-0' content={parsedContent.text} />
      <ImageRenderer content={parsedContent.image} />
    </div>
  );
}
