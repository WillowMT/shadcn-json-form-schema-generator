'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from 'lucide-react'


type File = {
  content: string
  type: string
  target: string
  path: string
}

type Schema = {
  name: string
  type: string
  registryDependencies: string[]
  dependencies: string[]
  devDependencies: string[]
  tailwind: {
    config: Record<string, unknown>
  }
  cssVars: Record<string, unknown>
  files: File[]
}

const typeOptions = [
  "registry:style",
  "registry:lib",
  "registry:example",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:theme",
  "registry:page",
]

type TagInputProps = {
  tags: string[]
  setTags: (tags: string[]) => void
  placeholder: string
}

const TagForm: React.FC<TagInputProps> = ({ tags, setTags, placeholder }) => {
  const [input, setInput] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault()
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()])
      }
      setInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded">
      {tags.map(tag => (
        <span key={tag} className="bg-primary text-primary-foreground pl-3 pr-2 py-1 rounded-full text-sm flex items-center">
          {tag}
          <button onClick={() => removeTag(tag)} className="ml-1 focus:outline-none">
            <X size={14} />
          </button>
        </span>
      ))}
      <Input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        className="flex-grow border-none focus:ring-0 shadow-none"
      />
    </div>
  )
}

export function SchemaFormComponent() {
  const [schema, setSchema] = useState<Schema>({
    name: '',
    type: 'registry:block',
    registryDependencies: [],
    dependencies: [],
    devDependencies: [],
    tailwind: {
      config: {}
    },
    cssVars: {},
    files: []
  })
  const [copy, setCopy] = useState(false)



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSchema(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (index: number, field: keyof File, value: string) => {
    setSchema(prev => ({
      ...prev,
      files: prev.files.map((file, i) =>
        i === index ? { ...file, [field]: value } : file
      )
    }))
  }

  const addFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setSchema(prev => ({
      ...prev,
      files: [...prev.files, { path: '', content: '', type: '', target: '' }]
    }))
  }

  const removeFile = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setSchema(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const handleTailwindConfigChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const config = JSON.parse(e.target.value)
      setSchema(prev => ({
        ...prev,
        tailwind: { config }
      }))
    } catch (error) {
      console.error("Invalid JSON for Tailwind config")
    }
  }

  const handleTypeChange = (value: string) => {
    setSchema(prev => ({ ...prev, type: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted:', schema)
  }

  const getJsonOutput = () => {
    const output = {
      ...schema,
      files: schema.files.map(file => {
        const { target, ...rest } = file
        return target ? { target, ...rest } : rest
      })
    }
    return JSON.stringify(output, null, 2)
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Schema Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={schema.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={handleTypeChange} value={schema.type}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="registryDependencies">Registry Dependencies</Label>
              <TagForm
                tags={schema.registryDependencies}
                setTags={(tags) => setSchema(prev => ({ ...prev, registryDependencies: tags }))}
                placeholder="Add registry dependency"
              />
            </div>
            <div>
              <Label htmlFor="dependencies">Dependencies</Label>
              <TagForm
                tags={schema.dependencies}
                setTags={(tags) => setSchema(prev => ({ ...prev, dependencies: tags }))}
                placeholder="Add dependency"
              />
            </div>
            <div>
              <Label htmlFor="devDependencies">Dev Dependencies</Label>
              <TagForm
                tags={schema.devDependencies}
                setTags={(tags) => setSchema(prev => ({ ...prev, devDependencies: tags }))}
                placeholder="Add dev dependency"
              />
            </div>
            <div>
              <Label htmlFor="tailwindConfig">Tailwind Config (JSON format)</Label>
              <Textarea
                id="tailwindConfig"
                value={JSON.stringify(schema.tailwind.config, null, 2)}
                onChange={handleTailwindConfigChange}
                className="font-mono"
              />
            </div>
            <div>
              <Label className='mr-2'>Files</Label>
              {schema.files.map((file, index) => (
                <Card key={index} className="mb-2 p-2">
                  <Input
                    placeholder="Path"
                    value={file.path}
                    onChange={(e) => handleFileChange(index, 'path', e.target.value)}
                    className="mb-2"
                  />
                  <Select onValueChange={(val) => handleFileChange(index, 'type', val)} >
                    <SelectTrigger className="w-full mb-2">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Content"
                    value={file.content}
                    onChange={(e) => handleFileChange(index, 'content', e.target.value)}
                    className="mb-2"
                  />
                  <Input
                    placeholder="Target (Optional)"
                    value={file.target}
                    onChange={(e) => handleFileChange(index, 'target', e.target.value)}
                    className="mb-2"
                  />

                  <Button className='mt-2' onClick={(e) => removeFile(index, e)} variant="destructive" size={"sm"}>Remove File</Button>
                </Card>
              ))}
              <Button onClick={addFile} className="mt-2 border-black dark:border-white" variant={"outline"}>Add File</Button>
            </div>
            {/* <Button type="submit">Submit</Button> */}
          </form>
        </CardContent>
      </Card>
      <Card className='h-fit'>
        <CardHeader>
          <CardTitle>JSON Output</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className=" p-4 rounded-md overflow-auto">
              {getJsonOutput()}
          </pre>
        </CardContent>
        <CardFooter>
          <Button className='w-full' onClick={() => { setCopy(true); navigator.clipboard.writeText(getJsonOutput()) }}>{copy ? "Copied!" : "Copy JSON"}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}