import { Button, Flex, Text, Icon } from '@chakra-ui/react';
import { signIn, signOut, useSession } from "next-auth/react";

// Google SVG Icon Component
const GoogleIcon = (props: any) => (
  <Icon viewBox="0 0 48 48" boxSize={5} {...props}>
    <path fill="#EA4335" d="M24 9.5c3.98 0 7.16 1.59 9.3 2.92l6.93-6.93C35.07 2.93 29.82 0 24 0 14.61 0 6.59 5.1 2.47 12.51l7.88 6.13C12.41 12.12 17.77 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.09 24.5c0-1.65-.15-3.25-.44-4.78H24v9.05h12.59c-.55 2.97-2.15 5.5-4.58 7.19l7.04 5.47c4.09-3.77 6.41-9.33 6.41-16.93z" />
    <path fill="#FBBC05" d="M10.35 28.9a14.3 14.3 0 010-9.8V13.57H2.47a23.99 23.99 0 000 20.86l7.88-6.13z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.14 15.91-5.82l-7.04-5.47c-2 1.34-4.57 2.13-8.86 2.13-6.23 0-11.59-3.62-13.48-8.64H2.47v6.83A23.99 23.99 0 0024 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </Icon>
);

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Flex direction="column" align="center" gap={3}>
        <Text>Signed in as {session.user?.email}</Text>
        <Button 
          colorScheme="red" 
          onClick={() => signOut()}
          size="md"
          px={6}
          py={4}
        >
          Sign out
        </Button>
      </Flex>
    );
  }

  return (
    <Flex direction="column" align="center" gap={3}>
      <Button 
        colorScheme="blue" 
        onClick={() => signIn("google", { callbackUrl: "/" })}
        size="md"
        px={6}
        py={4}
        leftIcon={<GoogleIcon />}
      >
        Sign in with Google
      </Button>
    </Flex>
  );
}
