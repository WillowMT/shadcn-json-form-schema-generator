import { SchemaFormComponent } from "@/components/schema-form";

export default function Home() {
  return (
    <div>
      <h1 className="py-2 text-3xl md:text-5xl font-extrabold text-center my-10 bg-gradient-to-tl from-slate-800 via-violet-500 to-zinc-400 bg-clip-text text-transparent">Shadcn Registry Schema Generator</h1>
      <SchemaFormComponent />
    </div>
  );
}
