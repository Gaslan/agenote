import { Ref } from "react"
import NewEditor, { NewEditorHandle } from "./new-editor"
import { OutputData } from "@editorjs/editorjs"

interface NewEditorWrapperProps {
  editorRef: Ref<NewEditorHandle>
  data: OutputData
}

export default function NewEditorWrapper({editorRef, data}: NewEditorWrapperProps) {

  return (
    <>
      <NewEditor ref={editorRef} data={data} />
    </>
  )
}
