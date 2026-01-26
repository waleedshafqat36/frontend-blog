'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { useEffect, useRef, useState } from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Unlink,
  Languages,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { ChevronDown } from "lucide-react"

const ImageUploadButton = dynamic(() => import('./ImageUploadButton'), {
  ssr: false,
  loading: () => (
    <button
      disabled
      title="Add Image (Loading...)"
      className="p-2 rounded-lg text-slate-400 cursor-not-allowed"
    >
      <ImageIcon size={18} />
    </button>
  ),
})

type Props = {
  // English content (preferred)
  valueEn?: string;
  // Urdu content (preferred)
  valueUr?: string;
  onChangeEn?: (v: string) => void;
  onChangeUr?: (v: string) => void;
  // Legacy single-prop API support
  value?: string;
  onChange?: (v: string) => void;
  // Optional language sync with parent
  isUrdu?: boolean;
  onIsUrduChange?: (isUrdu: boolean) => void;
}

export default function BlogEditor(props: Props) {
  const {
    valueEn,
    valueUr,
    onChangeEn,
    onChangeUr,
    value,
    onChange,
    isUrdu: isUrduProp,
    onIsUrduChange,
  } = props

  // Fallbacks to support older `value`/`onChange` usage
  const contentEn = valueEn ?? value ?? ''
  const contentUr = valueUr ?? ''
  const handleChangeEn = onChangeEn ?? onChange ?? (() => {})
  const handleChangeUr = onChangeUr ?? (() => {})
  // const fileInputRef = useRef<HTMLInputElement>(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [open, setOpen] = useState(false)
  // Default English ke liye false rakhein
const [isUrdu, setIsUrdu] = useState<boolean>(isUrduProp ?? false);

  useEffect(() => {
    if (typeof isUrduProp === 'boolean' && isUrduProp !== isUrdu) {
      setIsUrdu(isUrduProp)
    }
  }, [isUrduProp])
  


  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1,2,3,4,5,6],
        },
        codeBlock: {
          languageClassPrefix: 'language-',
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer hover:text-blue-600',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content: isUrdu ? contentUr : contentEn,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      if (isUrdu) {
        handleChangeUr(html); // Agar Urdu mode on hai
      } else {
        handleChangeEn(html); // Warna English mode
      }
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] w-full ${isUrdu ? 'urdu-font' : ''}`,
        dir: isUrdu ? 'rtl' : 'ltr',
      },
      handleTextInput(view, from, to, text) {
        // Agar toggle off hai (false), to normal English chalne de
        if (!isUrdu) return false;

        const urduMap: Record<string, string> = {
          a: 'ا', b: 'ب', p: 'پ', t: 'ت', T: 'ٹ', C: 'ث',
          j: 'ج', c: 'چ', h: 'ح', K: 'خ', d: 'د', D: 'ڈ',
          z: 'ذ', r: 'ر', R: 'ڑ', Z: 'ز', X: 'ژ', s: 'س',
          S: 'ش', v: 'ص', V: 'ض', F: 'ظ', e: 'ع',
          G: 'غ', f: 'ف', q: 'ق', k: 'ک', g: 'گ', l: 'ل',
          m: 'م', n: 'ن', w: 'و', o: 'ہ', i: 'ی', y: 'ے',
          ' ': ' ', '.': '۔', ',': '،', '?': '؟',
        };

        const mapped = urduMap[text];
        if (mapped) {
          view.dispatch(view.state.tr.insertText(mapped, from, to));
          return true;
        }
        return false;
      },
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!editor) return
    const content = isUrdu ? contentUr : contentEn
    if (content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [isUrdu, contentEn, contentUr, editor])
  const toggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (!editor) return null
    editor.chain().focus().toggleHeading({ level: level as any }).run()
    setOpen(false)
  }

  const handleAddImage = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const handleAddLink = () => {
    const text = editor?.state.selection.$from.parent.textContent || ''
    const selectedText = editor?.state.doc.textBetween(
      editor.state.selection.$from.pos,
      editor.state.selection.$to.pos,
      ' '
    ) || ''

    if (!selectedText && !text) {
      alert('Please select some text first, or type text and then add a link.')
      return
    }

    setShowLinkInput(true)
    setLinkUrl('')
  }
  // 
  useEffect(() => {
  if (editor) {
    // Ye line editor ke attributes ko manually refresh kar degi jab state badle gi
    editor.setOptions({
      editorProps: {
        attributes: {
          class: `prose focus:outline-none min-h-[300px] w-full ${isUrdu ? 'urdu-font' : ''}`,
          dir: isUrdu ? 'rtl' : 'ltr',
        },
      },
    })
  }
}, [isUrdu, editor])

  const confirmLink = () => {
    if (!linkUrl) {
      alert('Please enter a URL')
      return
    }

    let url = linkUrl
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    if (editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: '_blank' })
        .run()
    }

    setShowLinkInput(false)
    setLinkUrl('')
  }

  const removeLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run()
    }
  }

  const toggleBold = () => editor?.chain().focus().toggleBold().run()
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run()
  const toggleCode = () => editor?.chain().focus().toggleCode().run()
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run()
  const toggleBlockquote = () => editor?.chain().focus().toggleBlockquote().run()

  const ToolbarButton = ({
    onClick,
    icon: Icon,
    title,
    isActive = false,
  }: {
    onClick: () => void
    icon: React.ComponentType<{ size: number }>
    title: string
    isActive?: boolean
  }) => (
    <button
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-green-500 text-white'
          : 'hover:bg-slate-200 text-slate-600'
      }`}
    >
      <Icon size={18} />
    </button>
  )

  if (!editor) {
    return <div className="p-4 text-slate-400">Loading editor...</div>
  }

  return (
    <div className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200">
      {/* TOOLBAR */}
      <div className="bg-white border-b border-slate-200 p-3 flex flex-wrap gap-2 items-center">
        <ToolbarButton
          onClick={toggleBold}
          icon={Bold}
          title="Bold"
          isActive={editor.isActive('bold')}
        />
      
        <ToolbarButton
          onClick={toggleItalic}
          icon={Italic}
          title="Italic"
          isActive={editor.isActive('italic')}
        />
        <ToolbarButton
          onClick={toggleCode}
          icon={Code}
          title="Code"
          isActive={editor.isActive('code')}
        />

        <div className="relative inline-block">
      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3 py-2 rounded-md border border-green-300 bg-green-50 text-green-800 font-semibold hover:bg-green-100 transition`}
      >
        Heading
        <ChevronDown size={16} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-green-200 rounded-md shadow-lg z-50">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <button
              key={level}
              onClick={() => toggleHeading(level as 1 | 2 | 3 | 4 | 5 | 6)}
              className={`w-full text-left px-4 py-2 hover:bg-green-100 font-medium ${
                editor.isActive('heading', { level: level as any })
                  ? 'bg-green-100 text-green-700'
                  : 'text-green-800'
              }`}
            >
              H{level} Heading
            </button>
          ))}
        </div>
      )}
    </div>
        <div className="w-px h-6 bg-slate-200" />

        <ToolbarButton
          onClick={toggleBulletList}
          icon={List}
          title="Bullet List"
          isActive={editor.isActive('bulletList')}
        />
        <ToolbarButton
          onClick={toggleOrderedList}
          icon={ListOrdered}
          title="Ordered List"
          isActive={editor.isActive('orderedList')}
        />

        <ToolbarButton
          onClick={toggleBlockquote}
          icon={Quote}
          title="Quote"
          isActive={editor.isActive('blockquote')}
        />

        <div className="w-px h-6 bg-slate-200" />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={handleAddLink}
            icon={LinkIcon}
            title="Add Link (select text first)"
            isActive={editor.isActive('link')}
          />
          
          {editor.isActive('link') && (
            <ToolbarButton
              onClick={removeLink}
              icon={Unlink}
              title="Remove Link"
              isActive={false}
            />
          )}
        </div>

        {showLinkInput && (
          <div className="flex gap-1 items-center bg-slate-100 p-2 rounded">
            <input
              type="text"
              placeholder="Enter URL (e.g., example.com)"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') confirmLink()
              }}
              autoFocus
              className="px-2 py-1 rounded border border-slate-300 text-sm w-48 focus:outline-none focus:border-green-500"
            />
            <button
              onClick={confirmLink}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium whitespace-nowrap"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowLinkInput(false)
                setLinkUrl('')
              }}
              className="px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded text-sm font-medium whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        )}

    <ImageUploadButton onImageUpload={handleAddImage} />
<div className="relative">
  <ToolbarButton
    onClick={() => {
      const next = !isUrdu
      setIsUrdu(next)
      onIsUrduChange?.(next)
    }}
    icon={Languages}
    title={isUrdu ? "Switch to English" : "Switch to Urdu"}
    isActive={isUrdu}
  />
  {/* Chota sa indicator badge */}
  <span className={`absolute -top-1 -right-1 pointer-events-none px-1 rounded text-[7px] font-bold uppercase ${
    isUrdu ? 'bg-white text-green-600' : 'bg-slate-400 text-white'
  }`}>
    {isUrdu ? "Ur" : "En"}
  </span>
</div>
      </div>

      {/* EDITOR */}
      <div className="p-6 bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
