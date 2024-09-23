import { getAllPublishedPost } from "@/lib/service"
import { PostCard } from "./post-card"

export default async function RegistryPage() {
    const posts = await getAllPublishedPost()
    return <div className="container mx-auto p-4">
        <h1 className="text-3xl md:text-5xl text-center font-bold mb-4 py-10">
            Explore What Others Have Created!
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
        {
            posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))
        }
        </div>
    </div>
}
