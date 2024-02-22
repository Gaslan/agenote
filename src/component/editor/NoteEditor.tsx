import { defaultValueCtx, Editor, rootCtx, editorViewCtx, serializerCtx } from '@milkdown/core';
import { Milkdown, useEditor } from "@milkdown/react";
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { emoji } from '@milkdown/plugin-emoji';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { replaceAll, getMarkdown } from '@milkdown/utils';
import '@milkdown/theme-nord/style.css';
import './note-editor.css'
import { ForwardRefRenderFunction, forwardRef, use, useEffect, useImperativeHandle, useRef } from 'react';
import { Note } from '@/db/schema';
import { Ctx } from '@milkdown/ctx';
import { Node } from '@milkdown/prose/model';

interface NoteEditorProps {
  note: Note
}

export interface NoteEditorHandle {
  getMarkdown: () => string
  updateContent: (note: string) => void
  destroy: () => void
}

const NoteEditor: ForwardRefRenderFunction<NoteEditorHandle, NoteEditorProps> = function NoteEditor({note}: NoteEditorProps, ref) {
  const editorRef = useRef<Editor>()
  const {get} = useEditor((root) => {
    if (!editorRef.current) {
      editorRef.current = Editor
        .make()
        .config(ctx => {
          ctx.set(rootCtx, root)
          ctx.set(defaultValueCtx, note.content)
        })
        .config(nord)
        .use(commonmark)
        // .use(listener)
        .use(emoji)
    }
    return editorRef.current
  }, [])

  useImperativeHandle(ref, () => {
    const editor = get()
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
      },
      destroy() {
        editor?.destroy()
      }
    };
  })

  return (
    <Milkdown />
  )
}

export default forwardRef(NoteEditor)
