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

const SignUpEmail = ({ firstName }: { firstName: string }) => (
  <Html>
    <Head />
    <Preview>Thank you for signing up for TO</Preview>
    <Tailwind>
      <Body className="m-auto bg-white font-sans">
        <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
          <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
            Thank you for signing up for TO 💖
          </Heading>
          <Text className="text-[14px] leading-[24px] text-black">
            Hello {firstName},
          </Text>
          <Text className="text-[14px] leading-[24px] text-black">
            I&apos;m Osa. We are thrilled you signed up and want to use our
            service. You get 4 free credits weekly. At the end of the week,
            unused credits rollover and get added to your total.
          </Text>
          <Text className="text-[14px] leading-[24px] text-black">
            Your information is also 100% private. We <strong>DO NOT</strong>{" "}
            store your images.
          </Text>

          <Section className="my-[32px] text-center">
            <Button
              pX={20}
              pY={12}
              className="rounded bg-[#EE85B5] text-center text-[12px] font-semibold text-white no-underline"
              href="https://to.glamboyosa.xyz/enhancer"
            >
              Use the enhancer 🚀
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)
export default SignUpEmail
