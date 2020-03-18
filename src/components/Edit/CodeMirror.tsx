import React from 'react';
import { Controlled as RawCodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/scroll/annotatescrollbar';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/jump-to-line';

function CodeMirror({ value, options, onChange }: any) {
  return (
    <RawCodeMirror
      value={value}
      onBeforeChange={(editor, data, value) => onChange(value)}
      options={{
        lineNumbers: true,
        extraKeys: { 'Alt-F': 'findPersistent' },
        ...options,
      }}
    />
  );
}

export default CodeMirror;
