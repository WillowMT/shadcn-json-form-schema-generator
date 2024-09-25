import SignupForm from "@/components/signup-form";

export default function SignupPage() {
    return <div className="grid place-items-center h-screen">
        <SignupForm />
    </div>
}

export const metadata = {
    title: "Signup",
    description: "Signup to your account",
}