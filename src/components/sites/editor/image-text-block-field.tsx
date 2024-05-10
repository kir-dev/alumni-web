import { BlockFieldProps } from '@/components/sites/editor/block-field-distributor';
import { ImageBlockField } from '@/components/sites/editor/image-block-field';
import { TextBlockField } from '@/components/sites/editor/text-block-field';

export function ImageTextBlockField({ index, onChange, onDelete, value }: BlockFieldProps) {
  let parsedValue = { text: '', image: '' };
  try {
    parsedValue = JSON.parse(value);
  } catch {
    console.error('Error parsing JSON');
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-2 h-fit'>
      <TextBlockField
        onDelete={() => onDelete(index)}
        index={index}
        value={parsedValue.text}
        onChange={(_, textValue) => onChange(index, JSON.stringify({ ...parsedValue, text: String(textValue) }))}
      />
      <ImageBlockField
        onDelete={() => onDelete(index)}
        index={index}
        onChange={(_, imageValue) => onChange(index, JSON.stringify({ ...parsedValue, image: String(imageValue) }))}
        value={parsedValue.image}
      />
    </div>
  );
}
