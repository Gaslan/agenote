'use client'
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useRef } from 'react';
import Header from "@editorjs/header";
import List from "@editorjs/list";

interface NewEditorProps {
  data: OutputData
}

export interface NewEditorHandle {
  saveNote: () => Promise<OutputData | undefined>
}

const NewEditor: ForwardRefRenderFunction<NewEditorHandle, NewEditorProps> = function NewEditor({data}, ref) {
// const NewEditor = function NewEditor({}: NewEditorProps) {

  const editorBlock = 'editor-js'
  const editorRef = useRef<EditorJS>()

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: editorBlock,
        data: data,
        tools: {
          header: Header,
          list: List
        },
        async onChange(api, event) {
            const data = await api.saver.save()
            // onChange(data)
        }
      })
      editorRef.current = editor
    }

    return () => {
      if(editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy()
      }
    }
  }, [])

  
  useImperativeHandle(ref, () => {
    return {
      async saveNote() {
        console.log('OUTPUTT BURDAAA')
        const output = await editorRef.current?.save()
        console.log('OUTPUTT: ', output)
        return output
      }
    }
  }, [])

  return (
    <div id={editorBlock}></div>
  )
}

export default forwardRef(NewEditor)
// export default NewEditor
