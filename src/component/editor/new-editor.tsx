'use client'
import EditorJS from '@editorjs/editorjs';
import { useEffect, useRef } from 'react';
import Header from "@editorjs/header";
import List from "@editorjs/list";


interface NewEditorProps {
  
}

export default function NewEditor({}: NewEditorProps) {

  const editorBlock = 'editor-js'

  const ref = useRef<EditorJS>()

    useEffect(() => {
        if (!ref.current) {
            const editor = new EditorJS({
                holder: editorBlock,
                // data: data,
                tools: {
                  header: Header,
                  list: List
                },
                async onChange(api, event) {
                    const data = await api.saver.save()
                    // onChange(data)
                }
            })
            ref.current = editor
        }

        return () => {
            if(ref.current && ref.current.destroy) {
                ref.current.destroy()
            }
        }
    }, [])

  return (
    <div id={editorBlock}></div>
  )
}
