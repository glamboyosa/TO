"use client"

import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { env } from "@/env.mjs"
import { Auth, Enhancer } from "@/fetch-functions/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTheme } from "next-themes"
import { useDropzone } from "react-dropzone"
import { TypeAnimation } from "react-type-animation"

import { PrismaUser, UserAuthType } from "@/types/user"
import { getPublicId } from "@/lib/helpers/getPublicId"
import { prismaClient } from "@/lib/prisma"
import useActiveTab from "@/lib/store/useActiveTab"
import useUser from "@/lib/store/useUser"
import { buttonVariants } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Toaster from "@/components/Toaster"
import CookingLoader from "@/components/loading/cooking-loader"
import { SiteHeader } from "@/components/site-header"

import { decrementCredits, deleteImagefromCloudinary } from "../actions"

export default function EnhancerPage() {
  const [files, setFiles] = useState<File[]>([])
  const [downloadStarted, setDownloadStarted] = useState(false)
  const [arbitrary, setArbitrary] = useState(false)
  const [publicId, setPublicId] = useState("")
  const user = useUser((state) => state.user)
  const setUser = useUser((state) => state.setUser)
  const setActiveTab = useActiveTab((state) => state.setActiveTab)
  const { toast } = useToast()
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
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

  const { data, isLoading, isError } = useQuery<UserAuthType>(
    ["authUser"],
    () => Auth.fetchUser(),
    {
      staleTime: 5 * 120 * 1000, // in 10 mins you become stale,
    }
  )
  const submitImageToCloudinary = useMutation(
    ["submitImageForCloudinary"],
    (body: FormData) => Enhancer.submitImageToCloudinary(body)
  )
  const submitImageForTransformation = useMutation(
    ["submitImageForTransformation"],
    (body: { cloudinaryURL: string }) => Enhancer.submitImageToAPI(body)
  )
  const removeFileHandler = () => {
    setFiles([])
  }
  const { push } = useRouter()
  const { theme } = useTheme()
  async function convertFileToDataUrl(blobOrFile: File | Blob) {
    const reader = new FileReader()
    reader.readAsDataURL(blobOrFile)
    await new Promise(
      (resolve) =>
        (reader.onload = function () {
          resolve("")
        })
    )
    return reader.result
  }
  const submitHandler = async () => {
    const formData = new FormData()
    const file = files[0]

    try {
      const base64 = await convertFileToDataUrl(file)

      formData.append("file", base64 as string)
      formData.append("upload_preset", env.NEXT_PUBLIC_UPLOAD_PRESET)

      const cloudinaryResponse = await submitImageToCloudinary.mutateAsync(
        formData
      )

      const publicId = getPublicId(cloudinaryResponse.secure_url)
      setPublicId(publicId)
      // transform the image

      const cloudinaryTransformedImage = `https://res.cloudinary.com/glamboyosa/image/upload/c_scale,h_530,w_700/${publicId}.jpg`
      const body = {
        cloudinaryURL: cloudinaryTransformedImage,
      }
      await submitImageForTransformation.mutateAsync(body)
    } catch (error) {
      toast({
        title: "Uh Oh! Something went wrong",

        description: `We've had trouble processing your image. Please try again.`,
      })
      console.log(error)
    }
  }

  const downloadImageCallback = async () => {
    setDownloadStarted(true)
    const { success, creditsCount } = await decrementCredits(
      user?.email as string
    )
    if (success) {
      const imgBlob = await fetch(
        submitImageForTransformation.data?.output_url as string
      ).then((resp) => resp.blob())
      const a = document.createElement("a")
      a.href = (await convertFileToDataUrl(imgBlob)) as string
      a.download = `${crypto.randomUUID()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      toast({
        title: `${
          creditsCount === 1
            ? "Attention! only 1 credit left"
            : `${creditsCount} left`
        }`,
        description: `You only have ${creditsCount} left. Consider buying some credits to take full advantage of the platform.`,
      })
      await deleteImagefromCloudinary(publicId)
      setDownloadStarted(false)
      submitImageForTransformation.reset()
      submitImageToCloudinary.reset()
    } else {
      setDownloadStarted(false)
      toast({
        title: "Something went wrong",
        description: `Looks like something went wrong downloading the image, Please try again later.`,
      })
    }
  }

  useEffect(() => {
    if (isDragReject || fileRejections.length > 0) {
      toast({
        title: "Something Went Wrong",
        description: "File too big",
      })
    }
  }, [isDragReject, fileRejections])
  useLayoutEffect(() => {
    if (window.location.pathname === "/enhancer") {
      setActiveTab("enhancer")
    }
    setArbitrary(!arbitrary)
  }, [])

  if (!arbitrary) {
    return null
  }
  if (data?.user && user === null) {
    setUser(data?.user)
  }
  if (user) {
    if (
      user.freeCredits === 0 ||
      (user.paidCredits && user.paidCredits.number === 0)
    ) {
      toast({
        title: "Attention! No credits left",

        description: `You only have 0 credits left. Consider buying some credits to take full advantage of the platform.`,
      })
    }
  }
  if (isError) {
    push("/sign-in")
    console.log("error")
  }
  if (
    submitImageForTransformation.isLoading ||
    submitImageToCloudinary.isLoading
  ) {
    return (
      <div className="flex flex-col items-center justify-center">
        <TypeAnimation
          wrapper="h1"
          sequence={[
            // Same String at the start will only be typed once, initially
            "One sec, we're cooking...",
            2000,
            "One sec, we're cooking..",
            1500,
            "One sec, we're cooking.",
            1500,
            "One sec, we're cooking..",
            1500,
            "One sec, we're cooking...",
            2000,
          ]}
          speed={50}
          className="mb-10 mt-20  font-serif text-3xl font-bold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-5xl xl:mt-0"
          repeat={Infinity}
        />

        <CookingLoader theme={theme as "light" | "dark"} />
      </div>
    )
  }
  // handle image download UI
  if (
    submitImageForTransformation.data &&
    !submitImageForTransformation.isLoading
  ) {
    return (
      <div className="flex flex-col items-center justify-center">
        <SiteHeader />
        <h1 className=" mb-8 mt-24 text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-5xl">
          All done 😄
        </h1>
        <div className="mb-8  flex aspect-auto flex-col items-center gap-8 md:flex-row">
          <div className="flex flex-col gap-6 ">
            <h3 className="text-xl">Original Picture</h3>

            <img
              src={submitImageForTransformation.data.input_url}
              className={` w-[90vw] overflow-hidden rounded-lg shadow md:w-[37vw] ${
                theme === "light" ? "shadow-black/30" : "shadow-white/30"
              }`}
              alt="your input image"
            />
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-xl">Enhanced Picture</h3>

            <img
              src={submitImageForTransformation.data.output_url}
              className={`w-[90vw] overflow-hidden rounded-lg shadow  md:w-[37vw] ${
                theme === "light" ? "shadow-black/30" : "shadow-white/30"
              }`}
              alt="your ouput upscaled image"
            />
          </div>
        </div>
        <button
          disabled={downloadStarted}
          className={`${buttonVariants({
            size: "lg",
            variant: "outline",
          })} `}
          onClick={downloadImageCallback}
        >
          Download your image 🚀
        </button>
        <Toaster />
      </div>
    )
  }
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
                <div
                  key={acceptedFile.name}
                  className={`mt-4  rounded-md p-8 shadow-lg ${
                    theme === "undefined"
                      ? "shadow-white"
                      : theme === "light"
                      ? "shadow-black"
                      : "shadow-white/70"
                  }`}
                >
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
          <button
            onClick={submitHandler}
            disabled={files.length === 0}
            className={`${buttonVariants({ size: "lg" })} mt-10`}
          >
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
