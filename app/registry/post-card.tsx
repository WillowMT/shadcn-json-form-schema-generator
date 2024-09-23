'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Clipboard } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'
import { Link as LinkIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Dot } from 'lucide-react'

export const PostCard = ({ post }: { post: any }) => {
    const [liked, setLiked] = useState(false)
    const { toast } = useToast()

    const handleLike = () => {
        setLiked(!liked)
        // Here you would typically call an API to update the like status
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(post.content)
        toast({
            title: "Copied to clipboard",
            description: "The post content has been copied to your clipboard.",
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="w-full  mx-auto my-4 cursor-pointer">
                    <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>
                            <span className=' inline-flex items-center'>
                                {post.authorName} {post.authorName && <Dot />} {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='overflow-scroll border-t border-b mb-6'>
                        <pre className="whitespace-pre-wrap max-h-60 text-sm ">
                            {JSON.stringify(JSON.parse(post.content), null, 2)}
                        </pre>
                    </CardContent>
                    <CardFooter className='flex flex-col'>
                        <Button onClick={handleCopy} variant="outline" className='w-full mb-2'>
                            <Clipboard className="mr-2 h-4 w-4" />
                            Copy
                        </Button>
                        <Link href={`/api/raw/${post.id}`} target='_blank' className='w-full'>
                            <Button variant="outline" className='w-full'>
                                <LinkIcon className="mr-2 h-4 w-4" />
                                Raw
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </DialogTrigger>
            <DialogContent className="w-full max-w-3xl mx-auto my-4">
                <DialogHeader className='p-6'>
                    <DialogTitle>{post.title}</DialogTitle>
                    <DialogDescription>
                        <span className=' inline-flex items-center'>
                            {post.authorName} <Dot /> {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <CardContent className='overflow-scroll'>
                    <pre className="whitespace-pre-wrap max-h-96 text-sm">
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
                    <Link href={`/api/raw/${post.id}`} target='_blank'>
                        <Button variant="outline">
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Raw
                        </Button>
                    </Link>
                </CardFooter>
            </DialogContent>
        </Dialog>
    )
}