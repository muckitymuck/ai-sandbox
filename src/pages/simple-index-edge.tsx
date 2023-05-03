import { useEffect, useRef, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

import { useUser } from '@supabase/auth-helpers-react'


function classNames(...classes) { return classes.filter(Boolean).join(' '); }

const MessagesSection = ({ children }) => { return (<div id="messages" className="flex flex-1 flex-col-reverse p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">{children}</div>) }

const Message = ({ children, type, image = null }) => {
    const isTo = type !== 'apiMessage'
    return (
      <div className="chat-message">
        <div className={classNames("flex items-end ", isTo && "justify-end")}>
          <div className={classNames("flex flex-col my-2 space-y-2 text-md max-w-lg mx-2 items-start", isTo ? "order-1" : "order-2")}>
            <div>
              <span className={classNames("px-4 py-2 rounded-lg inline-block", isTo ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-300 text-gray-600 rounded-bl-none")}>
                <pre className='whitespace-pre-line'>
                  {children}
                </pre>
              </span>
            </div>
          </div>
          {image && <img src={image} alt="" className="w-12 h-12 rounded-full order-1" />}
        </div>
      </div>
    )
  }

  // const InputSection = ({ setIsLoading, setConversation, conversation }
  //   ) => {
  //     const inputElement = useRef(null);
  //     const [query, setQuery] = useState('')
    
  //     useEffect(() => {
  //       if (inputElement.current) {
  //         inputElement.current.focus();
  //       }
  //     }, []);

  //     const handleSubmit = async (e) => {
  //       //const handleSubmit = async (e: any) => {
  //         e.preventDefault();
  //         const question = query.trim();
  //         setIsLoading(true);
  //         setConversation((state) => ({
  //           ...state,
  //           messages: [
  //             ...state.messages,
  //             {
  //               // type: 'userMessage',
  //               type: done ? 'apiMessaage' : 'loading',
  //               message: query,

  //             },
  //           ],
  //         }));
      
  //         if (!query) {
  //           alert('Please input a question');
  //           return;
  //         }
      
  //         const response = await fetch('/api/ai/edge', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             question,
  //             history: conversation.history,
  //           }),
  //         })
      
  //         if (!response.ok){
  //           throw new Error(response.statusText);
  //         }
  //         // This data is a ReadableStream
  //         const data = response.body;
  //         if(!data) {
  //           return;
  //         }
  //         const reader = data.getReader();
  //         const decoder = new TextDecoder();
  //         let done = false;
      
  //         while (!done) {
            
  //           const { value, done: doneReading } = await reader.read();
  //           done = doneReading;
  //           const chunkValue = decoder.decode(value);
  //           setConversation((state) => state + chunkValue)    
  //         }
  //         setIsLoading(false);
  //       }
  //       return (
  //         <form>
  //           <div className="pt-4 mb-2 sm:mb-0 pb-10 px-5">
  //             <div className="relative flex">
  //               <input
  //                 type="text"
  //                 ref={inputElement}
  //                 onFocus={e => e.currentTarget.select()}
  //                 value={query}
  //                 onChange={evt => setQuery(evt.target.value)}
  //                 placeholder="What can I help you with?"
  //                 className="pl-4 w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600  bg-gray-200 rounded-md py-3 border-gray-300"
  //               />
  //               <button
  //                 type="submit"
  //                 className="inline-flex items-center justify-center rounded-lg ml-4 px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
  //                 onClick={handleSubmit}
  const handleSubmit = async (e, setIsLoading, setConversation, conversation, query) => {
    e.preventDefault();
    const question = query.trim();
    setIsLoading(true);
    setConversation((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'loading',
          message: query,
        },
      ],
    }));
  
    if (!query) {
      alert('Please input a question');
      return;
    }
  
    let response;
    try {
      response = await fetch('/api/ai/edge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history: conversation.history,
        }),
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert('An error occurred. Please try again later.');
      return;
    }
  
    if (!response.ok) {
      console.error(response.statusText);
      setIsLoading(false);
      alert('An error occurred. Please try again later.');
      return;
    }
  
    const data = response.body;
    if (!data) {
      setIsLoading(false);
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
  
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setConversation((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'apiMessage',
            message: chunkValue,
          },
        ],
      }));
    }
    setIsLoading(false);
  };
  
  const InputSection = ({ setIsLoading, setConversation, conversation }) => {
    const inputElement = useRef(null);
    const [query, setQuery] = useState('');
  
    useEffect(() => {
      if (inputElement.current) {
        inputElement.current.focus();
      }
    }, []);
  
    return (
      <form>
        <div className="pt-4 mb-2 sm:mb-0 pb-10 px-5">
          <div className="relative flex">
            <input
              type="text"
              ref={inputElement}
              onFocus={(e) => e.currentTarget.select()}
              value={query}
              onChange={(evt) => setQuery(evt.target.value)}
              placeholder="What can I help you with?"
              className="pl-4 w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600  bg-gray-200 rounded-md py-3 border-gray-300"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg ml-4 px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
              onClick={(e) => handleSubmit(e, setIsLoading, setConversation, conversation, query)}>
                  Send
                </button>
              </div>
            </div>
          </form >
        )
      }
const Layout = ({ children }) => {
return (<div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">{children}</div>)
}

const Component = ({ access }) => {
const [conversation, setConversation] = useState({ messages: [], history: [], pending: [] })
const [isLoading, setIsLoading] = useState(false)
const user = useUser()

console.log('user', user)

interface ConversationProps {
    messages: { type: string; image: string}[];
    history?: any[];
    pending?: any;
}
return (
    <>
      {/* Main Container */}
      <div className="flex mx-auto max-w-8xl sm:px-6 lg:px-0">
        {/* Main Content */}
        <div className="flex w-full sm:px-6 lg:px-8">
          <Layout>
            <MessagesSection>
              <PulseLoader color="#808080" size={7} className="pl-3" loading={isLoading && !conversation.pending} />
              {conversation.pending && <Message type='apiMessage'> {conversation.pending} </Message>}
              {/* {conversation && conversation.messages.slice(0).reverse().map((message: any, index) => ( */}
              {/* {conversation && conversation?.messages?.map((message, index) => ( */}
              {conversation && conversation.messages.slice(0).reverse().map((message: any, index) => (
              
                // <Message key={index} type={message.type} image={message.image}> {message.message} </Message>
                <Message key={index} type={message.type} image={message.image}> {message.message} </Message>
              ))}
            </MessagesSection>
            <InputSection {...{ setIsLoading, setConversation, conversation }} />
            {/* <button
              onClick={async () => {
                await supabaseClient.auth.signOut()
                router.push('/')
              }}
            >
              Logout
            </button> */}
          </Layout >
        </div>
      </div>
    </>
  )
}


export default Component