import React from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button, Icon } from 'semantic-ui-react'


const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <>
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        type="button"
      >
        bold
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        type="button"
      >
        italic
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
        type="button"
      >
        strike
      </Button>
    </>
  )
}

export default ({ value, handleChangeEditor }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    onUpdate: handleChangeEditor
  })

  return (
    <div className="richTextEditor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
