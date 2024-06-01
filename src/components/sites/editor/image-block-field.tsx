import { useCallback, useRef } from 'react';
import { TbTrashX } from 'react-icons/tb';

import { FileInput } from '@/components/file-input';
import { BlockFieldProps } from '@/components/sites/editor/block-field-distributor';
import { Button } from '@/components/ui/button';

export function ImageBlockField({ index, onChange, onDelete, value }: BlockFieldProps) {
  const imgRef = useRef<HTMLInputElement>(null);
  const onImageChange = useCallback(
    (imageValue: string) => {
      onChange(index, imageValue);
    },
    [onChange, index]
  );

  return (
    <div className='relative h-fit mt-0'>
      <FileInput
        accept='image/jpeg,image/png,image/gif,image/webp,image/svg+xml'
        ref={imgRef}
        value={value}
        onChange={onImageChange}
        onBlur={() => {}}
        name={`Image${index}`}
      />
      <Button
        className='absolute top-1 right-1'
        variant='destructiveOutline'
        size='icon'
        onClick={() => onDelete(index)}
      >
        <TbTrashX />
      </Button>
    </div>
  );
}
