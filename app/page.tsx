import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import Toaster from "@/components/Toaster"

export default function IndexPage() {
  return (
    <div>
      <section className="container grid grid-cols-1 items-center gap-6 pb-8 pt-6 md:py-10 lg:grid-cols-2">
        <div className="flex max-w-[980px] flex-col items-center justify-center gap-2">
          <h1 className="mt-20 text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl xl:mt-0">
            TO –{" "}
            <span className="relative  inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-pink">
              <span className="relative">AI Enhanced Clarity</span>
            </span>{" "}
            <div className="mt-2">at Your Fingertips</div>
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Upscale and Enhance your blurry pictures with the power of AI. 100%
            Private. Open Source.
          </p>
          <div className="flex items-center justify-center">
            <Link
              href={siteConfig.links.enhancer}
              target="_blank"
              rel="noreferrer"
              className={`${buttonVariants({ size: "lg" })} mt-4`}
            >
              Try it out now
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center overflow-hidden">
          <Image
            src="/woman.avif"
            className="rounded blur-sm"
            alt="a woman"
            width={300}
            height={300}
            priority
          />
          <Image
            src="/woman.avif"
            className="z-10 -ml-24 mt-44 rounded"
            alt="a woman"
            width={300}
            height={300}
            priority
          />
        </div>
      </section>
      <Toaster fromIndex />
    </div>
  )
}
