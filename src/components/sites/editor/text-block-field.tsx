import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  InsertTable,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditorMethods,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { TbTrashX } from 'react-icons/tb';

import { BlockFieldProps } from '@/components/sites/editor/block-field-distributor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const MDXEditor = dynamic(() => import('./md-editor'), {
  ssr: false,
});

function ToolbarContents() {
  return (
    <>
      <BoldItalicUnderlineToggles />
      <CreateLink />
      <InsertTable />
      <ListsToggle options={['number', 'bullet']} />
      <BlockTypeSelect />
      <UndoRedo />
    </>
  );
}

export function TextBlockField({ index, onChange, onDelete, value }: BlockFieldProps) {
  const ref = useRef<MDXEditorMethods>(null);
  return (
    <Card>
      <CardHeader>Szöveg</CardHeader>
      <CardContent>
        <MDXEditor
          ref={ref}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            tablePlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            toolbarPlugin({
              toolbarContents: ToolbarContents,
            }),
          ]}
          markdown={value}
          onChange={(value) => onChange(index, value)}
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
