
'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Clipboard } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'
import { Link as LinkIcon } from 'lucide-react'

export const PostCard = ({ post }: { post: any }) => {
    const [liked, setLiked] = useState(false)
    const { toast } = useToast()

    const handleLike = () => {
        setLiked(!liked)
        // Here you would typically call an API to update the like status
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(post, null, 2))
        toast({
            title: "Copied to clipboard",
            description: "The post content has been copied to your clipboard.",
        })
    }

    return (
        <Card className="w-full max-w-md mx-auto my-4">
            <CardHeader>
                <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent className='overflow-scroll'>
                <pre className="whitespace-pre-wrap max-h-60 text-sm">
                    {JSON.stringify(JSON.parse(post.content), null, 2)}
                </pre>
            </CardContent>
            <CardFooter className="flex pt-4">
                <Button onClick={handleLike} variant="ghost" className='mr-auto'>
                    <Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-current text-red-500' : ''}`} />
                    {liked ? 'Liked' : 'Like'}
                </Button>
                <Button onClick={handleCopy} variant="outline" className='mr-2'>
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy
                </Button>
                <Link href={`/api/raw?path=${post.id}`} target='_blank'>
                    <Button variant="outline">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        View
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}