'use client'

import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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
  const [localTags, setLocalTags] = useState<string[]>([])

  useEffect(() => {
    setLocalTags(tags)
  }, [tags])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault()
      if (!localTags.includes(input.trim())) {
        const newTags = [...localTags, input.trim()]
        setLocalTags(newTags)
        setTags(newTags)
      }
      setInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = localTags.filter(tag => tag !== tagToRemove)
    setLocalTags(newTags)
    setTags(newTags)
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded">
      {localTags.map(tag => (
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

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

const ImportDialog: React.FC<{ onImport: (data: Schema) => void }> = ({ onImport }) => {
  const [importData, setImportData] = useState('')

  const handleImport = () => {
    try {
      const parsedData = JSON.parse(importData) as Schema
      onImport(parsedData)
    } catch (error) {
      console.error("Invalid JSON data", error)
      alert("Invalid JSON data. Please check your input and try again.")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Import JSON</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import JSON</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Paste your JSON here"
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            className="h-[200px]"
          />
        </div>
        <Button onClick={handleImport}>Import</Button>
      </DialogContent>
    </Dialog>
  )
}

export function SchemaFormComponent() {
  const [isClient, setIsClient] = useState(false)
  const [schema, setSchema] = useLocalStorage<Schema>('schemaFormData', {
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
  });

  const { control, handleSubmit, reset, setValue } = useForm<Schema>({
    defaultValues: schema
  });

  const [copy, setCopy] = useState(false);

  useEffect(() => {
    setIsClient(true)
    reset(schema);
  }, [schema, reset]);

  const onSubmit = (data: Schema) => {
    console.log('Form submitted:', data);
    setSchema(data);
  };

  const handleReset = () => {
    const defaultSchema = {
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
    };
    reset(defaultSchema);
    setSchema(defaultSchema);
  };

  const handleImport = (importedData: Schema) => {
    reset(importedData);
    setSchema(importedData);
  };

  const addFile = () => {
    setValue('files', [...schema.files, { path: '', content: '', type: '', target: '' }]);
  };

  const removeFile = (index: number) => {
    setValue('files', schema.files.filter((_, i) => i !== index));
  };

  const getJsonOutput = () => {
    const output = {
      ...schema,
      files: schema.files.map(file => {
        const { target, ...rest } = file;
        return target ? { target, ...rest } : rest;
      })
    };
    return JSON.stringify(output, null, 2);
  };

  if (!isClient) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 flex justify-between flex-col md:flex-row gap-4">
      <Card className="mb-4 border-none shadow-none flex-grow max-w-2xl">
        <CardHeader>
          <CardTitle>Schema Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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
                )}
              />
            </div>
            <div>
              <Label htmlFor="registryDependencies">Registry Dependencies</Label>
              <Controller
                name="registryDependencies"
                control={control}
                render={({ field }) => (
                  <TagForm
                    tags={field.value}
                    setTags={field.onChange}
                    placeholder="Add registry dependency"
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor="dependencies">Dependencies</Label>
              <Controller
                name="dependencies"
                control={control}
                render={({ field }) => (
                  <TagForm
                    tags={field.value}
                    setTags={field.onChange}
                    placeholder="Add dependency"
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor="devDependencies">Dev Dependencies</Label>
              <Controller
                name="devDependencies"
                control={control}
                render={({ field }) => (
                  <TagForm
                    tags={field.value}
                    setTags={field.onChange}
                    placeholder="Add dev dependency"
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor="tailwindConfig">Tailwind Config (JSON format)</Label>
              <Controller
                name="tailwind.config"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    value={JSON.stringify(field.value, null, 2)}
                    onChange={(e) => {
                      try {
                        field.onChange(JSON.parse(e.target.value));
                      } catch (error) {
                        console.error("Invalid JSON for Tailwind config");
                      }
                    }}
                    className="font-mono"
                  />
                )}
              />
            </div>
            <div>
              <Label className='mr-2'>Files</Label>
              <Controller
                name="files"
                control={control}
                render={({ field }) => (
                  <>
                    {field.value.map((file, index) => (
                      <Card key={index} className="mb-2 p-2">
                        <Input
                          placeholder="Path"
                          value={file.path}
                          onChange={(e) => {
                            const newFiles = [...field.value];
                            newFiles[index].path = e.target.value;
                            field.onChange(newFiles);
                          }}
                          className="mb-2"
                        />
                        <Select
                          onValueChange={(val) => {
                            const newFiles = [...field.value];
                            newFiles[index].type = val;
                            field.onChange(newFiles);
                          }}
                          value={file.type}
                        >
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
                          onChange={(e) => {
                            const newFiles = [...field.value];
                            newFiles[index].content = e.target.value;
                            field.onChange(newFiles);
                          }}
                          className="mb-2 min-h-[200px]"
                        />
                        <Input
                          placeholder="Target (Optional)"
                          value={file.target}
                          onChange={(e) => {
                            const newFiles = [...field.value];
                            newFiles[index].target = e.target.value;
                            field.onChange(newFiles);
                          }}
                          className="mb-2"
                        />
                        <Button className='mt-2' onClick={() => removeFile(index)} variant="destructive" size={"sm"}>Remove File</Button>
                      </Card>
                    ))}
                    <Button onClick={addFile} className="mt-2 border-black dark:border-white" variant={"outline"}>Add File</Button>
                  </>
                )}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit">Submit</Button>
              <Button type="button" onClick={handleReset} variant="destructive">Reset</Button>
              <ImportDialog onImport={handleImport} />
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className='h-fit flex-1'>
        <CardHeader>
          <CardTitle>JSON Output</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className=" p-4 rounded-md overflow-auto text-sm">
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