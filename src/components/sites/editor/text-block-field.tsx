import { TbTrashX } from 'react-icons/tb';

import { BlockFieldProps } from '@/components/sites/editor/block-field-distributor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export function TextBlockField({ index, onChange, onDelete, value }: BlockFieldProps) {
  return (
    <Card>
      <CardHeader>Szöveg</CardHeader>
      <CardContent>
        <Textarea
          className='bg-transparent text-lg text-primary-600'
          value={value}
          onChange={(e) => onChange(index, e.target.value)}
        />
      </CardContent>
      <CardFooter className='justify-end'>
        <Button variant='destructiveOutline' size='icon' onClick={() => onDelete(index)}>
          <TbTrashX />
        </Button>
      </CardFooter>
    </Card>
  );
}
