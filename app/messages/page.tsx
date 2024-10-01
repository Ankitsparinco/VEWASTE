'use client'
import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Send, Loader2 } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const geminiApiKey = "AIzaSyCaGf0I37zp8dv8asHJvj3uB0MEcMHEPcI";
    console.log('API Key:', geminiApiKey ? 'Present' : 'Missing')
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Function to check if the message is related to waste management
  const isRelatedToWasteManagement = (message: string) => {
    const wasteManagementKeywords = [
      'waste', 'recycling', 'compost', 'garbage', 'trash', 'landfill', 
      'sustainability', 'pollution', 'plastic', 'biodegradable', 'hazardous waste', 
      'reduction', 'reuse', 'environment', 'solid waste', 'nature', 
    ]
    return wasteManagementKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )
  }

  // Function to restructure and format generated text for better readability
  const formatGeneratedText = (text: string) => {
    // Split the text into paragraphs based on periods followed by two spaces
    const paragraphs = text.split(/\.\s+/).map((para, idx) => (
      <p key={idx} className="mb-2">
        {para.trim() + (idx < text.length - 1 ? '.' : '')}
      </p>
    ))
    return paragraphs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Validate if the input is related to waste management
    if (!isRelatedToWasteManagement(input.trim())) {
      setError('Please ask questions related to waste management.')
      return
    }

    setIsLoading(true)
    setError('')

    const newMessage: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, newMessage])
    setInput('')

    try {
      const geminiApiKey = "AIzaSyCaGf0I37zp8dv8asHJvj3uB0MEcMHEPcI";
      if (!geminiApiKey) throw new Error('API key is missing')

      const genAI = new GoogleGenerativeAI(geminiApiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })

      console.log('Sending message:', newMessage.content)
      const result = await model.generateContent(newMessage.content)
      const responseText = result.response.text()
      console.log('Received response:', responseText)

      const assistantMessage: Message = { role: 'assistant', content: responseText }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-green-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
              msg.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-green-500 text-black p-2 rounded-lg'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="bg-green-100 text-black p-4 rounded-md border border-green-200">
                  {formatGeneratedText(msg.content)}
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about waste management..."
            className="flex-grow px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  )
}
