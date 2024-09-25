import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";
import { getOwnPost } from "@/lib/service";
import { PostCard } from "@/app/registry/post-card";

export default async function MePage() {
    const { user } = await validateRequest();

    if (!user) {
        return redirect('/');
    }

    const posts = await getOwnPost(user.id);
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Posts</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} isOwner={true} />
                ))}
            </div>
        </div>
    );
}

export const revalidate = 3