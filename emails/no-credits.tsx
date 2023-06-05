import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

const NoCredits = ({
  firstName,
  newFreeCreditsDate,
}: {
  firstName: string
  newFreeCreditsDate: Date
}) => (
  <Html>
    <Head />
    <Preview>No Credits Left</Preview>
    <Tailwind>
      <Body className="m-auto bg-white font-sans">
        <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
          <Text className="text-[14px] leading-[24px] text-black">
            Hello {firstName},
          </Text>
          <Text className="text-[14px] leading-[24px] text-black">
            Unfortunately, you have no more free credits left to upscale images.
            We&apos;re working really hard to allow you purchase more credits.
          </Text>
          <Text className="text-[14px] leading-[24px] text-black">
            Don&apos;t fret. Your credits will automatically renew on{" "}
            {new Date(newFreeCreditsDate).toLocaleDateString()}
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)
export default NoCredits
