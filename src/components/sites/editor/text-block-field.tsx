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
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { TbTrashX } from 'react-icons/tb';

import { ChatPopup } from '@/components/ai/chat-popup';
import { BlockFieldProps } from '@/components/sites/editor/block-field-distributor';
import { Button } from '@/components/ui/button';

const MDXEditor = dynamic(() => import('./md-editor'), {
  ssr: false,
});

interface ToolbarContentsProps {
  onDelete: () => void;
  onMessageChange: (value: string) => void;
}

function ToolbarContents({ onDelete, onMessageChange }: ToolbarContentsProps) {
  return (
    <>
      <BoldItalicUnderlineToggles />
      <CreateLink />
      <InsertTable />
      <ListsToggle options={['number', 'bullet']} />
      <BlockTypeSelect />
      <UndoRedo />
      <ChatPopup
        onGenerate={onMessageChange}
        context='Markdown formátumban generálj statikus oldal tartalmat, aláírással, cím nélkül.'
      />
      <Button onClick={onDelete} size='icon' variant='destructiveOutline' title='Törlés'>
        <TbTrashX />
      </Button>
    </>
  );
}

export function TextBlockField({ index, onChange, onDelete, value }: BlockFieldProps) {
  const [message, setMessage] = React.useState('');
  return (
    <MDXEditor
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
          toolbarContents: () => ToolbarContents({ onDelete: () => onDelete(index), onMessageChange: setMessage }),
        }),
      ]}
      value={message || value}
      markdown={value}
      onChange={(value) => onChange(index, value)}
    />
  );
}
