'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function BlogEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className="border border-slate-200 rounded-2xl bg-slate-50 p-4 min-h-[200px] focus-within:border-green-500">
      {editor ? <EditorContent editor={editor} /> : null}
    </div>
  )
}
