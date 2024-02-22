import { defaultValueCtx, Editor, rootCtx, editorViewCtx, serializerCtx } from '@milkdown/core';
import { Milkdown, useEditor } from "@milkdown/react";
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { replaceAll, getMarkdown } from '@milkdown/utils';
import '@milkdown/theme-nord/style.css';
import './note-editor.css'
import { ForwardRefRenderFunction, forwardRef, use, useImperativeHandle } from 'react';
import { Note } from '@/db/schema';
import { Ctx } from '@milkdown/ctx';
import { Node } from '@milkdown/prose/model';

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
        const serializer = ctx.get(serializerCtx);
        const listener = ctx.get(listenerCtx)
        listener.mounted((ctx: Ctx) => {
          console.log('CTX mounted: ', ctx)
        })
        listener.updated((ctx: Ctx, doc: Node, prevDoc: Node | null) => {
          console.log('CTX updated: ', ctx)
          console.log('CTX updated2: ', serializer(doc))
          console.log('CTX updated3: ', !!prevDoc && serializer(prevDoc))
        })
      })
      .config(nord)
      .use(commonmark)
      .use(listener)
  }, [])

  const editor = get()
  console.log('editor: ', editor)
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
