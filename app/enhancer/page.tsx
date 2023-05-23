"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond"

import { buttonVariants } from "@/components/ui/button"

// Import FilePond styles
import "filepond/dist/filepond.min.css"
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
import { ActualFileObject, FilePondFile, FilePondInitialFile } from "filepond"

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

export default function EnhancerPage() {
  const [files, setFiles] = useState<
    (string | FilePondInitialFile | Blob | ActualFileObject)[] | FilePondFile[]
  >([])
  const { data, isLoading, isError } = useQuery<{ success: boolean }>(
    ["authUser"],
    {
      queryFn: () => fetch("/api/users").then((res) => res.json()),
    }
  )
  const { push } = useRouter()
  if (isError) {
    push("/sign-in")
  }
  return (
    <section>
      {data?.success && !isLoading && (
        <div className="flex flex-col items-center justify-center">
          <FilePond
            files={
              files as (
                | string
                | FilePondInitialFile
                | Blob
                | ActualFileObject
              )[]
            }
            onupdatefiles={(e) => {
              setFiles(e)
            }}
            allowMultiple={false}
            maxFiles={1}
            server="/api/upload"
            className="mb-2"
            name="files" /* sets the file input name, it's filepond by default */
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
          <button className={buttonVariants({ size: "lg" })}>
            Upload Image 🚀
          </button>
        </div>
      )}
    </section>
  )
}
