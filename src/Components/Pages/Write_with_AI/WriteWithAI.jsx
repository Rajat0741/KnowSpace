import React, { useState } from 'react'
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Functions, ID } from 'appwrite'
import conf from '@/conf/conf'
import service from '@/appwrite/config'
import { Sparkles, Zap, Crown, Plus, Minus, Send, CheckCircle, Loader2 } from 'lucide-react'
import Button from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { updatePreferences } from '@/store/preferencesSlice'

const MAX_SOURCES = 10;


const functions = new Functions(service.client);

// Mock usage data - replace with actual API call


export default function WriteWithAI() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [prompt, setPrompt] = useState('')
  const [requestType, setRequestType] = useState('basic')
  const [style, setStyle] = useState('moderate')
  const [sources, setSources] = useState([''])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const userData = useSelector((state) => state.auth.userData)
  const preferences = useSelector((state) => state.preferences)
  const dispatch = useDispatch()

  // Dynamically get usage data from Redux state (updates on reload)
  const mockUsageData = React.useMemo(() => ({
    basic: { uses: preferences?.basic_uses || 0 },
    pro: { uses: preferences?.pro_uses || 0 },
    ultra: { uses: preferences?.ultra_uses || 0 }
  }), [preferences?.basic_uses, preferences?.pro_uses, preferences?.ultra_uses]);

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

    // Check if user has remaining uses for selected request type
    if (mockUsageData[requestType].uses <= 0) {
      toast.error(`No ${requestType} uses remaining`, {
        description: 'Please wait for your uses to reset.'
      })
      return
    }

    setLoading(true)

    try {
      // Filter out empty sources and validate URLs
      const validSources = sources.filter(s => {
        const trimmed = s.trim()
        if (!trimmed) return false
        
        // Basic URL validation
        try {
          new URL(trimmed)
          return true
        } catch {
          return false
        }
      })

      // Create tracking document with status "queued"
      const trackingDoc = await service.databases.createDocument(
        conf.appWriteDatabaseId,
        conf.appWriteTrackingCollectionId,
        ID.unique(),
        {
          userid: userData.$id,
          title: title.trim(),
          prompt: prompt.trim(),
          category: category,
          request_type: requestType,
          style,
          sources: validSources,
          status: 'queued',
          error: null
        }
      )

      // Prepare request body with tracking document ID
      const requestBody = {
        userid: userData.$id,
        trackingId: trackingDoc.$id,
        title: title.trim(),
        category: category,
        prompt: prompt.trim(),
        request_type: requestType,
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

      // Update user preferences in Redux state
      const updatedPrefs = {
        basic_uses: preferences.basic_uses,
        pro_uses: preferences.pro_uses,
        ultra_uses: preferences.ultra_uses,
        [`${requestType}_uses`]: mockUsageData[requestType].uses - 1
      }
      dispatch(updatePreferences(updatedPrefs))

      setSuccess(true)
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

      setTimeout(() => setSuccess(false), 3000)

    } catch (error) {
      console.error('AI Generation error:', error)

      // Check if it's a CORS error
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        toast.error('Connection Error', {
          description: 'Unable to connect to AI service. This might be a CORS issue in development. Your used uses will be restored on refreshing the website.'
        })
      } else {
        toast.error('Failed to start AI generation', {
          description: `${error.message || 'Please try again later'}. Your used uses will be restored on refreshing the website.`
        })
      }
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen relative">
      {/* Enhanced background with animated gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/25 via-blue-50/20 to-indigo-50/30 dark:from-purple-950/15 dark:via-blue-950/10 dark:to-indigo-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent dark:from-gray-900/70" />
        {/* Floating orbs for AI theme */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-10">
          <div className="absolute top-20 left-20 w-60 h-60 bg-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }}></div>
        </div>
      </div>

      {/* Usage Tracking - Top Right Corner */}
      <div className="absolute top-8 right-3 z-20 hidden lg:block">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-purple-200/40 dark:border-blue-800/40 rounded-xl p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Uses Remaining
            </h3>
          </div>

          <div className="space-y-2">
            {/* Basic Plan */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Normal</span>
              </div>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {mockUsageData.basic.uses}
              </span>
            </div>

            {/* Pro Plan */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-gradient-to-br from-purple-500 to-pink-600 rounded">
                  <Zap className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Medium</span>
              </div>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {mockUsageData.pro.uses}
              </span>
            </div>

            {/* Ultra Plan */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-gradient-to-br from-amber-500 to-orange-600 rounded">
                  <Crown className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-xs font-medium text-amber-700 dark:text-amber-300">High</span>
              </div>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {mockUsageData.ultra.uses}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">

        {/* Success Message */}
        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50 rounded-xl backdrop-blur-sm">
            <div className="p-1 bg-green-500 rounded-full">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent font-medium">
              AI generation started successfully! Check the tracking drawer for progress.
            </span>
          </div>
        )}

        {/* Main Form Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-white/80 to-blue-50/60 dark:from-purple-950/30 dark:via-gray-900/80 dark:to-blue-950/30 backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm"></div>

          <div className="relative border border-purple-200/40 dark:border-blue-800/40 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                <Send className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Generate Post
              </h2>
            </div>

            <form onSubmit={handleExecute} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Post Title *
                </label>
                <Input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter an engaging title for your post"
                  className="bg-white/90 dark:bg-gray-900/50 border-purple-300/70 dark:border-blue-600/70 focus:border-purple-500 dark:focus:border-blue-400"
                  required
                />
              </div>

              {/* Category and Request Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white/90 dark:bg-gray-900/50 border border-purple-300/70 dark:border-blue-600/70 focus:border-purple-500 dark:focus:border-blue-400 rounded-lg transition-all duration-300"
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
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Reasoning Effort
                  </label>
                  <select
                    value={requestType}
                    onChange={e => setRequestType(e.target.value)}
                    className="w-full px-3 py-2 bg-white/90 dark:bg-gray-900/50 border border-purple-300/70 dark:border-blue-600/70 focus:border-purple-500 dark:focus:border-blue-400 rounded-lg transition-all duration-300"
                  >
                    <option value="basic">Normal - {mockUsageData.basic.uses} uses left</option>
                    <option value="pro">Medium - {mockUsageData.pro.uses} uses left</option>
                    <option value="ultra">High - {mockUsageData.ultra.uses} uses left</option>
                  </select>
                </div>
              </div>

              {/* Article Length */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Article Length
                </label>
                <select
                  value={style}
                  onChange={e => setStyle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/90 dark:bg-gray-900/50 border border-purple-300/70 dark:border-blue-600/70 focus:border-purple-500 dark:focus:border-blue-400 rounded-lg transition-all duration-300"
                >
                  <option value="concise">Concise</option>
                  <option value="moderate">Moderate</option>
                  <option value="extended">Extended</option>
                </select>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  AI Instructions *
                </label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe what you want the AI to write about. Be specific about tone, style, and key points to cover..."
                  className="w-full h-32 px-3 py-2 bg-white/90 dark:bg-gray-900/50 border border-purple-300/70 dark:border-blue-600/70 focus:border-purple-500 dark:focus:border-blue-400 rounded-lg resize-none transition-all duration-300"
                  required
                />
              </div>

              {/* Sources */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">
                  Sources (Optional) — up to {MAX_SOURCES}
                </label>
                <div className="space-y-3">
                  {sources.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Input
                        value={s}
                        onChange={e => updateSource(i, e.target.value)}
                        placeholder={`Source ${i+1} — URL to web pages, PDFs, images (JPG/PNG), JSON/XML files, or GitHub repos`}
                        type="url"
                        className="flex-1 bg-white/90 dark:bg-gray-900/50 border-purple-300/70 dark:border-blue-600/70 focus:border-purple-500 dark:focus:border-blue-400"
                      />
                      {sources.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeSource(i)}
                          variant="outline"
                          size="sm"
                          className="border-red-200/50 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/30"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  {sources.length < MAX_SOURCES && (
                    <Button
                      type="button"
                      onClick={addSource}
                      variant="outline"
                      className="border-purple-200/50 dark:border-blue-700/50 text-purple-600 dark:text-blue-400 hover:bg-purple-50/50 dark:hover:bg-blue-950/30"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Source
                    </Button>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base py-3"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Post</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
