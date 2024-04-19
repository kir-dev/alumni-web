import '@mdxeditor/editor/style.css';

import { MDXEditor, MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';
import { forwardRef } from 'react';

const MDEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => {
  return <MDXEditor {...props} ref={ref} />;
});

MDEditor.displayName = 'MDEditor';

export default MDEditor;
