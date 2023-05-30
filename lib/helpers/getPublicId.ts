export function getPublicId(cloudinaryURL: string) {
  const publicId = cloudinaryURL.split("/").pop() as string
  return publicId.split(".")[0]
}
