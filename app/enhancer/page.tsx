"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import { useDropzone } from "react-dropzone"

import { buttonVariants } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function EnhancerPage() {
  const [files, setFiles] = useState<File[]>([])
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log("trigger on click and on drop")
      setFiles([...files, ...acceptedFiles])
    },
    [files]
  )
  const { getRootProps, getInputProps, isDragReject, fileRejections } =
    useDropzone({
      accept: {
        "image/apng": [".apng"],
        "image/avif": [".avif"],
        "image/jpeg": [".jpg", ".jpeg", ".jfif", ".pjpeg", ".pjp"],
        "image/png": [".png"],
        "image/webp": [".webp"],
      },
      maxFiles: 1,
      onDrop,
      maxSize: 4194304,
    })
  const { toast } = useToast()
  const { data, isLoading, isError } = useQuery<{ success: boolean }>(
    ["authUser"],
    {
      queryFn: () => fetch("/api/users").then((res) => res.json()),
    }
  )
  const removeFileHandler = () => {
    setFiles([])
  }
  const { push } = useRouter()
  if (isError) {
    push("/sign-in")
    console.log("error")
  }
  useEffect(() => {
    if (isDragReject || fileRejections.length > 0) {
      toast({
        title: "Something Went Wrong",
        description: "Please upload appropriate file type",
      })
    }
  }, [isDragReject, fileRejections])
  return (
    <section>
      {data?.success && !isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-10  mt-20 text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-5xl xl:mt-0">
            Upload your picture, we&apos;ll handle the rest 😄
          </h1>
          <div
            {...getRootProps({
              className:
                "p-10 rounded-sm border-dashed border-2 border-gray-300 w-1/2 h-56 text-center flex flex-col items-center justify-center",
            })}
          >
            <input {...getInputProps()} />
            <p>Drag & Drop, or click to select image</p>
          </div>
          <aside className="  pr-[2px]">
            {files.length > 0 &&
              files.map((acceptedFile) => (
                <div key={acceptedFile.name} className="mt-4 bg-gray-100 p-8">
                  <div className="flex space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-file-text"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" x2="8" y1="13" y2="13"></line>
                      <line x1="16" x2="8" y1="17" y2="17"></line>
                      <line x1="10" x2="8" y1="9" y2="9"></line>
                    </svg>

                    <span>{acceptedFile.name} </span>
                    <div
                      className="mr-auto cursor-pointer"
                      onClick={removeFileHandler}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x"
                      >
                        <line x1="18" x2="6" y1="6" y2="18"></line>
                        <line x1="6" x2="18" y1="6" y2="18"></line>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
          </aside>
          <button className={`${buttonVariants({ size: "lg" })} mt-10`}>
            Upload Image 🚀
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-10  mt-20 text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-5xl xl:mt-0">
            Upload your picture, we&apos;ll handle the rest 😄
          </h1>
        </div>
      )}
    </section>
  )
}
