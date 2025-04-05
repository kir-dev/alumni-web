import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import dynamic from 'next/dynamic';

import { ChatPopup } from '../ai/chat-popup';
import { Label } from '../ui/label';

const MDXEditor = dynamic(() => import('../sites/editor/md-editor'), {
  ssr: false,
});

interface NewsContentEitorProps {
  value: string;
  onChange: (value: string) => void;
  context: string;
}

export function NewsContentEditor({ value, onChange, context }: NewsContentEitorProps) {
  return (
    <>
      <Label>Hír tartalma</Label>
      <p className='text-sm text-slate-500 dark:text-slate-400 mb-5'>
        A hír tartalma Markdown formátumban írható. A hír tartalma a hír publikálásakor HTML formátumban jelenik meg. A
        hír címét már nem kell itt megadni.
      </p>
      <div className='border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950'>
        <MDXEditor
          value={value}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            toolbarPlugin({
              toolbarContents: () => ToolbarContents({ onMessageChange: onChange, context }),
            }),
          ]}
          markdown={value}
          onChange={onChange}
        />
      </div>
    </>
  );
}

interface ToolbarContentsProps {
  onMessageChange: (value: string) => void;
  context: string;
}

function ToolbarContents({ onMessageChange, context }: ToolbarContentsProps) {
  return (
    <>
      <BoldItalicUnderlineToggles />
      <CreateLink />
      <ListsToggle options={['number', 'bullet']} />
      <BlockTypeSelect />
      <UndoRedo />
      <ChatPopup onGenerate={onMessageChange} context={context} />
    </>
  );
}
