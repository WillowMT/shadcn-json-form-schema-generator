import { getOnePost } from "@/lib/service";
import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";
export default async function EditPage({ params }: { params: { id: string } }) {
    const post = await getOnePost(params.id);
    const {user} = await validateRequest();

    if (!user) {
        return redirect('/');
    }

    if (!post || post.userId !== user?.id) {
        return redirect('/');
    }

    // user is the creator of the post

    return <div>Edit Page</div>;
}