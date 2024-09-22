import { SchemaFormComponent } from "@/components/schema-form";

export default function Home() {
  return (
    <div>
      <h1 className="py-2 text-3xl md:text-6xl max-w-3xl mx-auto font-extrabold text-center my-10 bg-gradient-to-t from-slate-900 via-slate-500 to-slate-400 bg-clip-text text-transparent">Shadcn Registry Schema Generator</h1>
      <SchemaFormComponent />
    </div>
  );
}
