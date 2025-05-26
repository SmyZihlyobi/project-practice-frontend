import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function Page() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-10 mb-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Проектная деятельность ИКНТ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Для студентов</CardTitle>
            <CardDescription>
              Участвуйте в проектах, создавайте команды и развивайте свои навыки
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Image
              src="/images/index/students.jpg"
              alt="Студенты"
              width={400}
              height={300}
              className="rounded-lg"
            />
            <p className="text-center">
              Просматривайте список команд, создавайте свои и присоединяйтесь к проектам.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <a href="/student/join-project" className="w-full text-center">
                Зарегистрировать команду
              </a>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Для компаний</CardTitle>
            <CardDescription>
              Создавайте проекты и находите талантливых студентов для реализации ваших
              идей.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Image
              src="/images/index/companies.jpg"
              alt="Компании"
              width={400}
              height={300}
              className="rounded-lg"
            />
            <p className="text-center">
              Зарегистрируйте компанию и создавайте проекты для привлечения студентов.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <a href="/company/registration-company" className="w-full text-center">
                Зарегистрировать компанию
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Как это работает?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">1. Регистрация</h3>
            <p>Компании регистрируются и создают проекты, студенты формируют команды.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">2. Выбор проекта</h3>
            <p>Студенты выбирают проекты, которые им интересны, и подают заявки.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">3. Реализация</h3>
            <p>Команды работают над проектами под руководством компаний.</p>
          </div>
        </div>
      </div>

      <div className="content mt-5">
        <div className="mb-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Удобнее в приложении! 📱</h3>
          <p className="text-muted-foreground mb-4">
            Скачайте приложение для вашей платформы
          </p>
          <div className="flex justify-center">
            <div className="grid grid-cols-2 mt-4 gap-6 w-max">
              <div className="relative group">
                <a
                  href="#"
                  className="inline-flex flex-col items-center gap-1 p-3 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground w-24"
                  aria-disabled="true"
                >
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span className="text-sm">iPhone</span>
                </a>
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  Скоро
                </div>
              </div>

              <a
                href="https://disk.yandex.ru/d/pFzsCwBkFfiIsw"
                className="inline-flex flex-col items-center gap-1 p-3 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground w-24"
              >
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
                </svg>
                <span className="text-sm">Android</span>
              </a>

              <a
                href="https://disk.yandex.ru/d/Y_h4CCPgssHzMA"
                className="inline-flex flex-col items-center gap-1 p-3 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground w-24"
              >
                <svg
                  width="40"
                  height="40"
                  fill="currentColor"
                  viewBox="0 0 452.986 452.986"
                >
                  <path d="M165.265 53.107 21.689 81.753v132.531l143.575-2.416V53.107m266.033 192.476-233.18-3.991v164.822l233.18 46.571V245.583m-266.032-4.486L21.69 238.659v132.509l143.575 28.668V241.097M431.297 0l-233.18 46.528V211.35l233.18-3.969V0" />
                </svg>
                <span className="text-sm">Windows</span>
              </a>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://disk.yandex.ru/d/iiWdxZ3oErbJvg"
                      className="inline-flex flex-col items-center gap-1 p-3 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground w-24"
                    >
                      <svg width="40" height="40" fill="currentColor" viewBox="0 0 50 50">
                        <path d="M47.3 21.01c-.58-1.6-1.3-3.16-2.24-4.66-.93-1.49-2.11-2.93-3.63-4.13-1.51-1.19-3.49-2.09-5.59-2.26l-.78-.04c-.27.01-.57.01-.85.04-.57.06-1.11.19-1.62.34-1.03.32-1.93.8-2.72 1.32-1.42.94-2.55 2.03-3.57 3.15.01.02.03.03.04.05l.22.28c.51.67 1.62 2.21 2.61 3.87 1.23-1.2 2.83-2.65 3.49-3.07.5-.31.99-.55 1.43-.68.23-.06.44-.11.64-.12.1-.02.19-.01.3-.02l.38.02c.98.09 1.94.49 2.85 1.19 1.81 1.44 3.24 3.89 4.17 6.48.95 2.6 1.49 5.44 1.52 8.18 0 1.31-.17 2.57-.57 3.61-.39 1.05-1.38 1.45-2.5 1.45-1.63 0-2.81-.7-3.76-1.68-1.04-1.09-2.02-2.31-2.96-3.61-.78-1.09-1.54-2.22-2.26-3.37-1.27-2.06-2.97-4.67-4.15-6.85L25 16.35c-.31-.39-.61-.78-.94-1.17-1.11-1.26-2.34-2.5-3.93-3.56-.79-.52-1.69-1-2.72-1.32-.51-.15-1.05-.28-1.62-.34-.18-.02-.36-.03-.54-.03-.11 0-.21-.01-.31-.01l-.78.04c-2.1.17-4.08 1.07-5.59 2.26-1.52 1.2-2.7 2.64-3.63 4.13-.94 1.5-1.66 3.06-2.24 4.66-1.13 3.2-1.74 6.51-1.75 9.93.01 1.78.24 3.63.96 5.47.7 1.8 2.02 3.71 4.12 4.77 1.03.53 2.2.81 3.32.81 1.23.03 2.4-.32 3.33-.77 1.87-.93 3.16-2.16 4.33-3.4 2.31-2.51 4.02-5.23 5.6-8 .44-.76.86-1.54 1.27-2.33-.21-.41-.42-.84-.64-1.29-.62-1.03-1.39-2.25-1.95-3.1-.83 1.5-1.69 2.96-2.58 4.41-1.59 2.52-3.3 4.97-5.21 6.98-.95.98-2 1.84-2.92 2.25-.47.2-.83.27-1.14.25-.43 0-.79-.1-1.13-.28-.67-.35-1.3-1.1-1.69-2.15-.4-1.04-.57-2.3-.57-3.61.03-2.74.57-5.58 1.52-8.18.93-2.59 2.36-5.04 4.17-6.48.91-.7 1.87-1.1 2.85-1.19l.38-.02c.11.01.2 0 .3.02.2.01.41.06.64.12.26.08.54.19.83.34.2.1.4.21.6.34 1 .64 1.99 1.58 2.92 2.62.72.81 1.41 1.71 2.1 2.63L25 25.24c.75 1.55 1.53 3.09 2.39 4.58 1.58 2.77 3.29 5.49 5.6 8 .68.73 1.41 1.45 2.27 2.1.61.48 1.28.91 2.06 1.3.93.45 2.1.8 3.33.77 1.12 0 2.29-.28 3.32-.81 2.1-1.06 3.42-2.97 4.12-4.77.72-1.84.95-3.69.96-5.47-.01-3.42-.62-6.73-1.75-9.93z" />
                      </svg>
                      <span className="text-sm">Meta Quest</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] text-center">
                    <p>
                      Meta Quest, продукт компании Meta,
                      <br />
                      которая признана экстремистской
                      <br />
                      организацией в России
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
