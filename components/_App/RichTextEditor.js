import React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import CharacterCount from "@tiptap/extension-character-count"
import Color from "@tiptap/extension-color"
import FontFamily from "@tiptap/extension-font-family"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Typography from "@tiptap/extension-typography"
import TextStyle from "@tiptap/extension-text-style"

import { Icon, Popup } from "semantic-ui-react"
import ColorPicker from "./ColorPicker"


const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  const [textColor, setTextColor] = React.useState("#ff0000")
  const [backgroundColor, setBackgroundColor] = React.useState("#ff0000")

  const setLink = React.useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])

  return (
    <>
      <Icon 
        name="undo"
        bordered
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      />
      <Icon 
        name="redo"
        bordered
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      />
      <Icon
        name="bold"
        bordered
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      />
      <Icon
        name="italic"
        bordered
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      />
      <Icon
        name="underline"
        bordered
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
      />
      <Icon
        name="strikethrough"
        bordered
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
      />
      <Icon
        name="linkify"
        bordered
        onClick={setLink}
        className={editor.isActive('link') ? 'is-active' : ''}
      />
      <Icon
        name="unlinkify"
        bordered
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
      />
      <Popup
        content={<ColorPicker color={backgroundColor} setColor={setBackgroundColor} />}
        on='click'
        pinned
        trigger={<span style={{ backgroundColor:backgroundColor}} className="rteField"><span style={{borderBottom:"3px double"}}><Icon name="font"/></span><Icon name="paint brush" /></span>}
        onClick={() => editor.chain().focus().setHighlight({ color: backgroundColor }).run()}
        className={editor.isActive('highlight', { color: backgroundColor }) ? 'is-active' : ''}
      />
      <Popup
        content={<ColorPicker color={textColor} setColor={setTextColor} />}
        on='click'
        pinned
        trigger={<span style={{ color:textColor, padding:"2px 4px"}} className="rteField"><span style={{textShadow:"0 0 1px black"}}><Icon name="font"/></span><Icon name="paint brush" /></span>}
        onClick={() => editor.chain().focus().setColor(textColor).run()}
        className={editor.isActive('textStyle', { color: textColor }) ? 'is-active' : ''}
      />
      <Icon
        name="quote right"
        bordered
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <Icon
        name="list ul"
        bordered
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <Icon
        name="list ol"
        bordered
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <Icon
        name="indent"
        bordered
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={!editor.can().sinkListItem('listItem')}
      />
      <Icon
        name="indent"
        flipped='horizontally'
        bordered
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        disabled={!editor.can().liftListItem('listItem')}
      />
      <Popup
        content={
          <>
            <h1 onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} >Text</h1>
            <h2 onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} >Text</h2>
            <h3 onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} >Text</h3>
            <h4 onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} >Text</h4>
            <h5 onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} >Text</h5>
            <h6 onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} >Text</h6>
            <p onClick={() => editor.chain().focus().clearNodes().run()}>Text</p>
          </>
        }
        on='click'
        pinned
        trigger={<Icon name="heading" bordered />}
      />
      <i onClick={() => editor.chain().focus().setHorizontalRule().run()} className="bordered icon">––</i>
      <Icon 
        name="align left"
        bordered
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />
      <Icon 
        name="align center"
        bordered
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />
      <Icon 
        name="align right"
        bordered
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      />
      <Icon 
        name="align justify"
        bordered
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      />

      <Icon
        name="x" 
        bordered
        onClick={() => {
          editor.chain().focus().unsetHighlight().run()
          editor.chain().focus().unsetColor().run()
          editor.chain().focus().clearNodes().run()
        }}
      />
    </>
  )
}

export default ({ value, handleChangeEditor, limit = 10000 }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1,2,3,4,5,6]
        }
      }),
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      TextStyle,
      Underline,
      Table,
      TableCell,
      TableRow,
      TableHeader,
      CharacterCount.configure({
        limit
      }),
      Color,
      FontFamily,
      Placeholder,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography
    ],
    content: value,
    onUpdate: handleChangeEditor
  })

  return (
    <div className="richTextEditor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <div className="character-count">
        {editor && (<>{editor.storage.characterCount.characters()}/{limit}</>)}
      </div>
    </div>
  )
}
