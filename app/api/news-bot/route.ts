import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(
      `https://gnews.io/api/v4/top-headlines?lang=ar&max=10&apikey=${process.env.GNEWS_API_KEY}`
    )

    const data = await res.json()

    return NextResponse.json({
      articles: data.articles || []
    })

  } catch (error) {
    return NextResponse.json({
      articles: []
    })
  }
}

