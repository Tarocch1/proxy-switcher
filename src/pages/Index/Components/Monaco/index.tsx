import { useRef, useState, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker' // eslint-disable-line import/default
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker' // eslint-disable-line import/default
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker' // eslint-disable-line import/default
import classes from './style.module.css'

self.MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  },
}

export type MonacoProps = {
  style?: React.HTMLAttributes<HTMLDivElement>['style']
  language: 'json' | 'javascript' | 'plain'
  value?: string
  onChange?: (value: string) => void
}

export function Monaco({ style = {}, language, value, onChange }: MonacoProps) {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoEl = useRef(null)
  const valueRef = useRef(value)

  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    if (monacoEl.current && !editor) {
      const monEditor = monaco.editor.create(monacoEl.current, {
        value,
        language,
        fontSize: 14,
        tabSize: 2,
      })
      monEditor.onDidChangeModelContent = function () {
        onChange &&
          valueRef.current !== monEditor.getValue() &&
          onChange(monEditor.getValue())
        return {
          dispose: () => false,
        }
      }
      setEditor(monEditor)
    }
    return () => editor?.dispose()
  }, [monacoEl.current])

  useEffect(() => {
    if (editor && value !== editor.getValue()) {
      editor.setValue(value || '')
    }
  }, [value])

  return <div className={classes.container} style={style} ref={monacoEl}></div>
}
