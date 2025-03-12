import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { ReactNode } from 'react';

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <ReCaptchaProvider>{children}</ReCaptchaProvider>;
}
