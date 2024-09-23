import { getAllPublishedPost } from "@/lib/service"
import { PostCard } from "./post-card"

export default async function RegistryPage() {
    const posts = await getAllPublishedPost()
    return <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
        {
            posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))
        }

        </div>
    </div>
}


// const RegistryPage = ({ posts }) => {
//   return (
//     <div className="container mx-auto p-4">
//       {posts.map((post) => (
//         <PostCard key={post.id} post={post} />
//       ))}
//     </div>
//   )
// }

// export default RegistryPage
