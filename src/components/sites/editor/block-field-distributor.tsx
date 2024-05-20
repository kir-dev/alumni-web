import { FunctionComponent } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

import { ImageBlockField } from '@/components/sites/editor/image-block-field';
import { ImageTextBlockField } from '@/components/sites/editor/image-text-block-field';
import { TextBlockField } from '@/components/sites/editor/text-block-field';
import { FormField } from '@/components/ui/form';
import { StaticSiteBlock } from '@/types/site-editor.types';

interface BlockFieldDistributorProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: TName;
}

export function BlockFieldDistributor<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues>({
  control,
  name,
}: BlockFieldDistributorProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='space-y-5 mt-5'>
          {(field.value as StaticSiteBlock[]).map((block, idx) => {
            const BlockFieldComponent = BlockFieldComponents[block.type];
            /* eslint-disable react/no-array-index-key */
            return (
              <BlockFieldComponent
                key={idx}
                index={idx}
                value={block.content}
                onChange={(index, value) => {
                  const newBlocks = [...field.value];
                  newBlocks[index] = {
                    ...newBlocks[index],
                    content: value,
                  };
                  field.onChange(newBlocks);
                }}
                onDelete={(index) => {
                  const newBlocks = [...field.value];
                  newBlocks.splice(index, 1);
                  field.onChange(newBlocks);
                }}
              />
            );
          })}
        </div>
      )}
    />
  );
}

export interface BlockFieldProps {
  index: number;
  onChange: (index: number, value: StaticSiteBlock['content']) => void;
  onDelete: (index: number) => void;
  value: StaticSiteBlock['content'];
}

const BlockFieldComponents: Record<StaticSiteBlock['type'], FunctionComponent<BlockFieldProps>> = {
  Text: TextBlockField,
  Image: ImageBlockField,
  ImageText: ImageTextBlockField,
};
