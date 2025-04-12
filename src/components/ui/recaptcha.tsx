'use client';

import React, { useEffect, useState } from 'react';

import { axiosInstance } from '@/lib/axios';
import { useReCaptcha } from 'next-recaptcha-v3';

import { Button } from './button';
import { Skeleton } from './skeleton';

interface RecaptchaProps {
  onChange(isVerified: boolean): void;
}

export const Recaptcha = (props: RecaptchaProps) => {
  const { onChange } = props;
  const { executeRecaptcha } = useReCaptcha();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onChange(isVerified);
  }, [isVerified, onChange]);

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      const token = await executeRecaptcha('form_submit');

      if (token) {
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-recaptcha`,
          { token },
        );
        if (response.status === 200) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      }
    } catch (error) {
      console.error('ERROR with reCAPTCHA:', error);
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!isLoading ? (
        <Button
          type="button"
          onClick={handleVerify}
          disabled={isVerified}
          variant={isVerified ? 'positive' : 'destructive'}
          className="disabled:opacity-100 w-full"
        >
          {isVerified ? 'Человек 😳' : 'Подтвердите что вы не робот... 🤖'}
        </Button>
      ) : (
        <Skeleton className="h-[36] w-full" />
      )}
      <div className="text-xs mt-2">
        This site is protected by reCAPTCHA and the Google{' '}
        <a className="text-blue-600" href="https://policies.google.com/privacy">
          Privacy Policy{' '}
        </a>
        and{' '}
        <a className="text-blue-600" href="https://policies.google.com/terms">
          Terms of Service
        </a>{' '}
        apply.
      </div>
    </div>
  );
};
