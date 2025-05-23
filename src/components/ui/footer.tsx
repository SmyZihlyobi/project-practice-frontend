import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

function Footer() {
  return (
    <footer>
      <Dialog>
        <DialogTrigger asChild>
          <div className="mt-12 text-center text-sm text-gray-600 flex ml-auto mr-auto w-max">
            <Button variant="ghost">Создано с ❤️ командой Смузихлёбы</Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Наша команда</DialogTitle>
          </DialogHeader>
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
              Владимир - покоритель кубиков
            </a>
            <a
              href="https://t.me/astrozzzz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline block"
            >
              Никита - технический писатель | аналитик
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
export { Footer };
