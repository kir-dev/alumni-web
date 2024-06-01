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

const MDXEditor = dynamic(() => import('./md-editor'), {
  ssr: false,
});

interface ToolbarContentsProps {
  onDelete: () => void;
}

function ToolbarContents({ onDelete }: ToolbarContentsProps) {
  return (
    <>
      <BoldItalicUnderlineToggles />
      <CreateLink />
      <InsertTable />
      <ListsToggle options={['number', 'bullet']} />
      <BlockTypeSelect />
      <UndoRedo />
      <Button onClick={onDelete} size='icon' variant='destructiveOutline' title='Törlés'>
        <TbTrashX />
      </Button>
    </>
  );
}

export function TextBlockField({ index, onChange, onDelete, value }: BlockFieldProps) {
  const ref = useRef<MDXEditorMethods>(null);
  return (
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
          toolbarContents: () => ToolbarContents({ onDelete: () => onDelete(index) }),
        }),
      ]}
      markdown={value}
      onChange={(value) => onChange(index, value)}
    />
  );
}
