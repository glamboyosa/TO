import { env } from "env.mjs"

import { ImageAIResult, ImageTransformResult } from "@/types/enhancer"
import { UserAuthType } from "@/types/user"

export const Auth = {
  fetchUser: (): Promise<UserAuthType> =>
    fetch("/api/users").then((res) => res.json()),
}

export const Enhancer = {
  submitImageToAPI: (body: {
    cloudinaryURL: string | ArrayBuffer
  }): Promise<ImageAIResult> =>
    fetch("/api/upload", {
      method: "post",
      body: JSON.stringify(body),
    }).then((res) => res.json()),
  submitImageToCloudinary: (body: FormData): Promise<ImageTransformResult> =>
    fetch(
      `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "post",
        body,
      }
    ).then((res) => res.json()),
}
