import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export interface Comment {
  id: string
  post_id: string
  post_type: string
  parent_id: string | null
  author_name: string
  author_email: string
  content: string
  created_at: string
  updated_at: string
  replies?: Comment[]
}

// GET: Fetch comments for a specific post
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const postId = searchParams.get('postId')
  const postType = searchParams.get('postType') || 'posts'

  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('post_type', postType)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    // Organize comments into threads (parent comments with their replies)
    const commentMap = new Map<string, Comment>()
    const rootComments: Comment[] = []

    // First pass: create a map of all comments
    comments.forEach((comment: Comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    // Second pass: organize into parent-child relationships
    comments.forEach((comment: Comment) => {
      const commentWithReplies = commentMap.get(comment.id)!
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id)
        if (parent) {
          parent.replies!.push(commentWithReplies)
        } else {
          // If parent doesn't exist, treat as root comment
          rootComments.push(commentWithReplies)
        }
      } else {
        rootComments.push(commentWithReplies)
      }
    })

    return NextResponse.json({ comments: rootComments })
  } catch (error) {
    console.error('Error in GET /api/comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, postType = 'posts', parentId, authorName, authorEmail, content } = body

    // Validate required fields
    if (!postId || !authorName || !authorEmail || !content) {
      return NextResponse.json(
        { error: 'postId, authorName, authorEmail, and content are required' },
        { status: 400 },
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(authorEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Sanitize content (basic XSS prevention)
    const sanitizedContent = content.trim().substring(0, 5000)
    const sanitizedName = authorName.trim().substring(0, 100)

    if (sanitizedContent.length < 1) {
      return NextResponse.json({ error: 'Comment content cannot be empty' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        post_type: postType,
        parent_id: parentId || null,
        author_name: sanitizedName,
        author_email: authorEmail.toLowerCase().trim(),
        content: sanitizedContent,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
