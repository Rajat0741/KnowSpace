import React, { useState } from 'react'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Functions, ID } from 'appwrite'
import { Client } from 'appwrite'
import conf from '@/conf/conf'

const MAX_SOURCES = 5;

const client = new Client()
  .setEndpoint(conf.appWriteUrl)
  .setProject(conf.appWriteProjectId);

const functions = new Functions(client);

export default function WriteWithAI() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [prompt, setPrompt] = useState('')
  const [requestType, setRequestType] = useState('basic')
  const [style, setStyle] = useState('moderate')
  const [sources, setSources] = useState([''])
  const [loading, setLoading] = useState(false)

  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()

  const updateSource = (index, value) => {
    const next = [...sources]
    next[index] = value
    setSources(next)
  }

  const addSource = () => {
    if (sources.length >= MAX_SOURCES) return
    setSources(prev => [...prev, ''])
  }

  const removeSource = (index) => {
    setSources(prev => prev.filter((_, i) => i !== index))
  }

  const handleExecute = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }
    if (!category) {
      toast.error('Please select a category')
      return
    }
    if (!prompt.trim()) {
      toast.error('Please provide instructions for the AI')
      return
    }

    if (!userData?.$id) {
      toast.error('You must be logged in to use this feature')
      navigate('/login')
      return
    }

    setLoading(true)
    
    try {
      // Filter out empty sources
      const validSources = sources.filter(s => s.trim() !== '')
      
      // Prepare request body
      const requestBody = {
        userId: userData.$id,
        title: title.trim(),
        category: category,
        prompt: prompt.trim(),
        requestType,
        style,
        sources: validSources
      }

      // Call Appwrite function
      if (!conf.appWriteAIGenerationFunctionId) {
        throw new Error('AI Generation function ID is not configured')
      }
      // eslint-disable-next-line no-unused-vars
      const execution = await functions.createExecution(
        conf.appWriteAIGenerationFunctionId,
        JSON.stringify(requestBody),
        true 
      )
      
      toast.success('AI post generation started!', {
        description: 'You will be notified when your article is ready. Check the tracking drawer for progress.'
      })

      // Reset form
      setTitle('')
      setCategory('')
      setPrompt('')
      setSources([''])
      setRequestType('basic')
      setStyle('moderate')
      
    } catch (error) {
      console.error('AI Generation error:', error)
      
      // Check if it's a CORS error
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        toast.error('Connection Error', {
          description: 'Unable to connect to AI service. This might be a CORS issue in development. Please check the console for details.'
        })
      } else {
        toast.error('Failed to start AI generation', {
          description: error.message || 'Please try again later'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-md p-4">
        <h2 className="text-lg font-semibold mb-2">Generate a post with AI (asynchronous)</h2>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          This page helps you create a complete blog post using AI. The generation runs asynchronously — after you hit Execute, the job will run on the server and you will be notified when the draft is ready.
        </p>
      </div>

      <form onSubmit={handleExecute} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Post title" 
            className="w-full border rounded p-2 dark:bg-slate-800 dark:border-slate-700" 
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)} 
            className="w-full border rounded p-2 dark:bg-slate-800 dark:border-slate-700" 
            required
          >
            <option value="">Select a category...</option>
            <option value="Technology">Technology</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Tutorials">Tutorials</option>
            <option value="News">News</option>
            <option value="Reviews">Reviews</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Request Type</label>
          <select 
            value={requestType} 
            onChange={e => setRequestType(e.target.value)} 
            className="w-full border rounded p-2 dark:bg-slate-800 dark:border-slate-700"
          >
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="ultra">Ultra</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Article Length</label>
          <select 
            value={style} 
            onChange={e => setStyle(e.target.value)} 
            className="w-full border rounded p-2 dark:bg-slate-800 dark:border-slate-700"
          >
            <option value="concise">Concise </option>
            <option value="moderate">Moderate </option>
            <option value="extended">Extended </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prompt (what you want the AI to write) *</label>
          <textarea 
            value={prompt} 
            onChange={e => setPrompt(e.target.value)} 
            placeholder="Give the AI instructions and tone..." 
            className="w-full border rounded p-2 min-h-[140px] dark:bg-slate-800 dark:border-slate-700" 
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sources (optional) — up to {MAX_SOURCES}</label>
          <div className="space-y-2">
            {sources.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input 
                  value={s} 
                  onChange={e => updateSource(i, e.target.value)} 
                  placeholder={`Source ${i+1} — url to a public webpage or file`} 
                  className="flex-1 border rounded p-2 dark:bg-slate-800 dark:border-slate-700" 
                  type="url"
                />
                {sources.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeSource(i)} 
                    className="text-sm text-red-600 dark:text-red-400 px-2 py-1 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {sources.length < MAX_SOURCES && (
              <div>
                <button 
                  type="button" 
                  onClick={addSource} 
                  className="text-sm text-blue-600 dark:text-blue-400 px-2 py-1 hover:underline"
                >
                  + Add source
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded transition-colors"
          >
            {loading ? 'Executing…' : 'Execute'}
          </button>
        </div>
      </form>
    </div>
  )
}
