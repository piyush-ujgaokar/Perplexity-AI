// import React, { useEffect } from 'react'
// import { useSelector } from 'react-redux'
// import { useChat } from '../hooks/useChat'

// const Dashboard = () => {
//     const chat=-useChat()
//     const user=useSelector(state=>state.auth)


//     console.log(user);

//         useEffect(()=>{
//             chat.initializeSocketConnection
            
//         },[])

//   return (
//    <main className='h-screen w-full bg-gray-900'></main>
//   )
// }

// export default Dashboard

import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import remarkGfm from 'remark-gfm'


const Dashboard = () => {
  const chat = useChat()
  const [ chatInput, setChatInput ] = useState('')
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
    // ensure default theme is dark
    document.documentElement.classList.remove('light')
  }, [])

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId,chats)
  }

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  const openDeleteConfirm = (chatId) => {
    setPendingDeleteId(chatId)
    setConfirmOpen(true)
  }

  const cancelDelete = () => {
    setPendingDeleteId(null)
    setConfirmOpen(false)
  }

  const confirmDelete = async () => {
    if (!pendingDeleteId) return
    await chat.handleDeleteChat(pendingDeleteId)
    setPendingDeleteId(null)
    setConfirmOpen(false)
  }

  // Small dots component for typing animation
  const Dots = () => {
    const [dots, setDots] = useState('.')
    useEffect(() => {
      let i = 1
      const t = setInterval(() => {
        i = (i % 3) + 1
        setDots('.'.repeat(i))
      }, 450)
      return () => clearInterval(t)
    }, [])
    return <span className='ml-1 text-muted'>{dots}</span>
  }

  const AssistantThinking = () => {
    return (
      <div className={`max-w-[60%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base fade-in mr-auto bg-soft text-muted border-theme`}>
        <div className='flex items-center gap-2'>
          <span className='text-primary'>Thinking</span>
          <Dots />
        </div>
      </div>
    )
  }

  function ThemeToggle() {
    const [isLight, setIsLight] = useState(false)

    useEffect(() => {
      // sync state with document class
      setIsLight(document.documentElement.classList.contains('light'))
    }, [])

    const toggle = () => {
      if (document.documentElement.classList.contains('light')) {
        document.documentElement.classList.remove('light')
        setIsLight(false)
      } else {
        document.documentElement.classList.add('light')
        setIsLight(true)
      }
    }

    return (
      <button
        onClick={toggle}
        aria-label='Toggle theme'
        className='h-8 w-8 rounded-full btn flex items-center justify-center text-sm text-muted hover:bg-white/10'
        title='Toggle light/dark'
      >
        {isLight ? '🌞' : '🌙'}
      </button>
    )
  }

  return (
    <main className='min-h-screen w-full p-3 md:p-5 app-root' style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <style>{`
        @keyframes fadeInMsg { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
        .fade-in { animation: fadeInMsg 360ms ease forwards; }
      `}</style>
      <section className='mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 rounded-3xl p-1 md:h-[calc(100vh-2.5rem)] md:gap-6 md:p-1'>
        <aside className='hidden h-full w-65 shrink-0 rounded-3xl app-sidebar p-4 md:flex md:flex-col themed-rounded'>
            <div className='mb-4 flex items-center justify-between'>
            <div>
              <h2 className='text-sm text-muted'>Xhancy-Ai</h2>
              <h1 className='text-xl font-semibold tracking-tight'>Recent Chats</h1>
            </div>

            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={() => chat.handleCreateChat && chat.handleCreateChat()}
                className='ml-2 btn btn-glow'
              >
                New
              </button>

              <ThemeToggle />
            </div>
          </div>

            <div className='flex-1 overflow-y-auto pr-1'>
            {Object.values(chats).length === 0 && (
              <p className='text-sm text-muted'>No chats yet. Create a new chat to begin.</p>
            )}

            <div className='space-y-2 mt-3'>
              {Object.values(chats).map((c, index) => (
                <div
                  onClick={() => openChat(c.id)}
                  key={c.id || index}
                  role='button'
                  tabIndex={0}
                  className={`group w-full cursor-pointer rounded-full px-3 py-2 text-left text-sm font-medium transition flex items-center justify-between ${
                    c.id === currentChatId
                      ? 'border-2 bg-soft text-primary border-theme btn-glow'
                      : 'text-muted hover:brightness-110'
                  }`}
                >
                  <span className='truncate mr-3'>{c.title || 'Untitled'}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); openDeleteConfirm(c.id) }}
                    type='button'
                    aria-label='Delete chat'
                    className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted hover:text-danger'
                    title='Delete chat'
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='icon'>
                      <polyline points='3 6 5 6 21 6'></polyline>
                      <path d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6'></path>
                      <path d='M10 11v6'></path>
                      <path d='M14 11v6'></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-4 text-sm text-muted'>
            <p>Logged in as</p>
            <p className='mt-1 font-medium text-primary'>You</p>
          </div>
        </aside>

        <section className='relative mx-auto flex h-full min-w-0 flex-1 flex-col gap-4'>

          {/* Main messages / hero area */}
          <div className='messages flex-1 overflow-y-auto pr-4' style={{ paddingBottom: '6.5rem' }}>
            {(!currentChatId || !chats[currentChatId]) ? (
              <div className='flex h-full w-full items-center justify-center'>
                <div className='mx-auto max-w-2xl text-center'>
                  <span className='inline-block rounded-full bg-soft px-3 py-1 text-xs uppercase tracking-wider text-muted'>Early Preview</span>
                  <h2 className='mt-6 text-5xl md:text-6xl font-semibold tracking-tight text-primary'>Xhancy AI</h2>
                  <p className='mt-4 text-lg text-muted'>
                    Ask anything. Paste text, brainstorm ideas, or get quick explanations. Your chats stay in the sidebar so you can pick up where you left off.
                  </p>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-3'>
                {chats[currentChatId]?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base fade-in ${
                      message.role === 'user'
                          ? 'ml-auto rounded-br-none bg-soft text-primary'
                        : 'mr-auto rounded-bl-none bg-soft text-primary'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p>{message.content}</p>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                          ul: ({ children }) => <ul className='mb-2 list-disc pl-5'>{children}</ul>,
                          ol: ({ children }) => <ol className='mb-2 list-decimal pl-5'>{children}</ol>,
                          code: ({ children }) => <code className='rounded bg-soft px-1 py-0.5 text-primary'>{children}</code>,
                          pre: ({ children }) => <pre className='mb-2 overflow-x-auto rounded-xl bg-panel p-3 text-primary'>{children}</pre>
                        }}
                        rehypePlugins={[remarkGfm]}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <AssistantThinking />
                )}
              </div>
            )}
          </div>

          {confirmOpen && (
            <div className='fixed inset-0 z-50 flex bg-black items-center justify-center'>
              <div className='absolute inset-0 bg-black/50' onClick={cancelDelete}></div>
              <div className='relative w-full max-w-md rounded-lg bg-panel p-6'>
                <h3 className='text-lg font-semibold'>Are you sure you want to delete this chat?</h3>
                <p className='mt-2 text-sm text-muted'>This action cannot be undone.</p>
                <div className='mt-4 flex justify-end gap-2'>
                  <button onClick={cancelDelete} className='btn'>Cancel</button>
                  <button onClick={confirmDelete} className='btn btn-danger'>Delete</button>
                </div>
              </div>
            </div>
          )}

          {/* Input area - fixed visual at bottom */}
          <footer className='pointer-events-auto w-full absolute bottom-4 left-0 flex justify-center'>
            <form
              onSubmit={handleSubmitMessage}
              className='input-glass flex w-full max-w-3xl items-center gap-3'
              style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            >
              <input
                type='text'
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder='Message ChatGPT...'
                className=' input-field'
              />

              <button
                type='submit'
                disabled={!chatInput.trim()}
                aria-label='Send message'
                className='btn btn-glow send-btn'
              >
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='icon'>
                  <line x1='22' y1='2' x2='11' y2='13'></line>
                  <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
                </svg>
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Dashboard