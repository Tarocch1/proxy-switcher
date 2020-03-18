import React from 'react';
import { Controlled as RawCodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/annotatescrollbar';
import 'codemirror/addon/scroll/scrollpastend';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/display/fullscreen';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/selection/active-line';

function CodeMirror({ value, options, onChange }: any) {
  return (
    <RawCodeMirror
      value={value}
      onBeforeChange={(editor, data, value) => onChange(value)}
      options={{
        lineNumbers: true,
        scrollbarStyle: 'simple',
        scrollPastEnd: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        styleActiveLine: true,
        extraKeys: {
          'Alt-F': 'findPersistent',
          F11: (cm: any) => {
            cm.setOption('fullScreen', !cm.getOption('fullScreen'));
          },
          Esc: (cm: any) => {
            if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
          },
        },
        ...options,
      }}
    />
  );
}

export default CodeMirror;
