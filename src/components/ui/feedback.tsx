'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';

function FeedbackDialog() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const submitted = localStorage.getItem('feedbackSubmitted');
    if (submitted) {
      setHasSubmitted(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = () => {
    localStorage.setItem('feedbackSubmitted', 'true');
    setHasSubmitted(true);
    setIsVisible(false);
  };

  if (hasSubmitted) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isVisible && (
          <Button className="fixed flex flex-col p-2 sm:p-3 gap-1 bottom-4 left-4 sm:bottom-6 sm:left-6 duration-300 shadow-lg w-auto h-auto rounded-full sm:rounded-lg">
            <p className="text-xs sm:text-sm">Фидбек</p>
            <Image
              src="/images/feedback/tralalero-tralala.png"
              width={60}
              height={42}
              alt="tralalero tralala"
              className="w-12 h-auto sm:w-16"
            />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border-none max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-800">
            Помогите нам улучшиться!
          </DialogTitle>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Ваша обратная связь много значит для нас 🌟
          </p>
        </DialogHeader>
        <div className="py-2 sm:py-4">
          <iframe
            src="https://forms.yandex.ru/u/67ff8327493639931c3a8e48/?iframe=1"
            frameBorder="0"
            name="ya-form-67ff8327493639931c3a8e48"
            className="w-full min-h-[530px]  rounded-md"
            title="Feedback Form"
          />
        </div>
        <DialogFooter className="flex justify-between items-center">
          <p className="text-xs sm:text-sm text-gray-600">Спасибо! 😊</p>
          <Button
            onClick={handleSubmit}
            className="bg-slate-800 text-white hover:bg-gray-600 text-xs sm:text-sm"
          >
            Больше не показывать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { FeedbackDialog };
