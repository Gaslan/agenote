import { defaultValueCtx, Editor, rootCtx, editorViewCtx, serializerCtx } from '@milkdown/core';
import { Milkdown, useEditor } from "@milkdown/react";
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { replaceAll, getMarkdown } from '@milkdown/utils';
import '@milkdown/theme-nord/style.css';
import './note-editor.css'
import { ForwardRefRenderFunction, forwardRef, useImperativeHandle } from 'react';
import { Note } from '@/db/schema';

interface NoteEditorProps {
  note: Note
}

export interface NoteEditorHandle {
  getMarkdown: () => string
  updateContent: (note: string) => void
}

const NoteEditor: ForwardRefRenderFunction<NoteEditorHandle, NoteEditorProps> = function NoteEditor({note}: NoteEditorProps, ref) {

  const {get} = useEditor((root) => {
    return Editor
      .make()
      .config(ctx => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, note.content)
      })
      .config(nord)
      .use(commonmark)
  }, [])

  const editor = get()
  
  useImperativeHandle(ref, () => {
    return {
      getMarkdown() {
        return editor?.action((ctx) => {
          const editorView = ctx.get(editorViewCtx);
          const serializer = ctx.get(serializerCtx);
          return serializer(editorView.state.doc);
        }) ?? ''
      },
      updateContent(note: string) {
        editor?.action(replaceAll(note))
      }
    };
  })

  return (
    <Milkdown />
  )
}

export default forwardRef(NoteEditor)
