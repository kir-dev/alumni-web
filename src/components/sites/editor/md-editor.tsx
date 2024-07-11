import '@mdxeditor/editor/style.css';

import { MDXEditor, MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';
import { forwardRef, useEffect, useRef } from 'react';

interface MDEditorProps extends MDXEditorProps {
  value: string;
}

const MDEditor = forwardRef<MDXEditorMethods, MDEditorProps>(({ value, ...props }) => {
  const ref = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.setMarkdown(value);
    }
  }, [value]);

  return <MDXEditor {...props} ref={ref} />;
});

MDEditor.displayName = 'MDEditor';

export default MDEditor;
