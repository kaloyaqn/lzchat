import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"

const API_KEY = "vij notes";

function App() {

  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      message: "Здравейте, аз съм Кондьо! Асистент на радиоклуб Хасково LZ1KAM",
      sender: "ChatGPT"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }
  
    const newMessages = [...messages, newMessage];
    //updatevame state-a na suobshtenieto
    setMessages(newMessages);
    //chatgpt pishe
    setTyping(true);
    //processvame suobshtenieto kum Chatgpt
    await processMessageChat(newMessages); // pass array of messages
  }
  

  async function processMessageChat(chatMessages) {

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });

    const systemMessage = {
      role: "system",
      content: "Speak like a chalga singera and before every sentence use the words 'Жив съм не искам друго, живее ми се лудо! ' or 'Полудявам! Да те нямам! ' and explain like talking to a 10 year old." //Explain all concepts like I am either a 60 year old or 10 years old
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages":[
        systemMessage,
        ...apiMessages // [msg1,msg2,msg3]
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },      
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      //console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
       [...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
       }]
      );
      setTyping(false);
    })
  }

  return (
    <div className="App">
      <div className="konteiner">
        <MainContainer>
            <ChatContainer>
              <MessageList
                scrollBehavior='smooth'
                typingIndicator={typing ? <TypingIndicator content="Кондьо мисли..."/> : null}
              >
              {messages.map((message, i) => {
                  //console.log(message)
                  return <Message key={i} model={message} />
                })}
              </MessageList>
              <MessageInput placeholder='Напишете събобщението си тук' onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
      </div>
    </div>
  )
}

export default App
