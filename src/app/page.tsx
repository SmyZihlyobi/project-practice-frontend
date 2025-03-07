import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
              src="/students.jpg"
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
              src="/companies.jpg"
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

      <Dialog>
        <DialogTrigger asChild>
          <div className="mt-12 text-center text-sm text-gray-600 flex ml-auto mr-auto w-max">
            <Button variant="ghost">Создано с ❤️ командой Смузихлёбы</Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Наша команда</DialogTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://t.me/Demorganbtw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Александр - lead | backend
                    </a>
                    <a
                      href="https://t.me/IvanMalkS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Иван - lead fronted
                    </a>
                    <a
                      href="https://t.me/El_CockFORpancakes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Никита - frontend
                    </a>
                    <a
                      href="https://t.me/EgorBB52"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Егор - frontend
                    </a>
                    <a
                      href="https://t.me/Th3ro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Сергей - devops
                    </a>
                    <a
                      href="https://t.me/Aero56"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Владимир - покоритель кубернетиса
                    </a>
                    <a
                      href="https://t.me/Aero56"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      Никита - технический писатель | аналитик
                    </a>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Написать в Telegram</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
