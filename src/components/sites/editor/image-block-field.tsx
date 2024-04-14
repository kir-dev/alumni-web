import { useRef, useState } from 'react';
import { TbExclamationCircle, TbPhotoPlus, TbTrashX } from 'react-icons/tb';

import { BlockFieldProps } from '@/components/sites/editor/block-field-distributor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function ImageBlockField({ index, onChange, onDelete, value }: BlockFieldProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgError, setImgError] = useState(false);

  const onError = () => {
    setImgError(true);
    imgRef.current?.style.setProperty('display', 'none');
  };

  const onLoaded = () => {
    setImgError(false);
    imgRef.current?.style.setProperty('display', 'block');
  };
  return (
    <Card>
      <CardHeader>Kép</CardHeader>
      <CardContent className='space-y-5'>
        {value ? (
          <div className='text-center'>
            {imgError && (
              <p className='text-red-500'>
                <TbExclamationCircle className='mx-auto' size={50} />
                Kép betöltése sikertelen
              </p>
            )}
            <img
              onError={onError}
              onLoad={onLoaded}
              ref={imgRef}
              src={value}
              alt='image'
              className='object-center object-cover rounded-md w-52 h-52 max-w-full mx-auto'
            />
          </div>
        ) : (
          <div className='text-primary-500 text-center'>
            <TbPhotoPlus className='mx-auto' size={50} />
            Másolj be egy kép URL-t
          </div>
        )}
        <Input value={value} onChange={(e) => onChange(index, e.target.value)} />
      </CardContent>
      <CardFooter className='justify-end'>
        <Button variant='destructiveOutline' size='icon' onClick={() => onDelete(index)}>
          <TbTrashX />
        </Button>
      </CardFooter>
    </Card>
  );
}
