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
    <footer className="py-8">
      <div className="container mx-auto px-4 max-lg:pb-12">
        <div className="text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                Создано с ❤️ командой <span className="font-medium">Смузихлёбы</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-4 text-center">Наша команда</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-3">
                <a
                  href="https://t.me/Demorganbtw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg transition-all flex items-center gap-2"
                >
                  <span className="font-medium">Александр</span>
                  <span className="text-muted-foreground text-sm">lead | backend</span>
                </a>
                <a
                  href="https://t.me/IvanMalkS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg transition-all flex items-center gap-2"
                >
                  <span className="font-medium">Иван</span>
                  <span className="text-muted-foreground text-sm">lead frontend</span>
                </a>
                <a
                  href="https://t.me/El_CockFORpancakes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg transition-all flex items-center gap-2"
                >
                  <span className="font-medium">Никита</span>
                  <span className="text-muted-foreground text-sm">frontend</span>
                </a>
                <a
                  href="https://t.me/EgorBB52"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg transition-all flex items-center gap-2"
                >
                  <span className="font-medium">Егор</span>
                  <span className="text-muted-foreground text-sm">frontend</span>
                </a>
                <a
                  href="https://t.me/Th3ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg transition-all flex items-center gap-2"
                >
                  <span className="font-medium">Сергей</span>
                  <span className="text-muted-foreground text-sm">devops</span>
                </a>
                <a
                  href="https://t.me/Aero56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg transition-all flex items-center gap-2"
                >
                  <span className="font-medium">Владимир</span>
                  <span className="text-muted-foreground text-sm">
                    покоритель кубиков
                  </span>
                </a>
                <a
                  href="https://t.me/astrozzzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg transition-all flex items-center gap-2"
                >
                  <span className="font-medium">Никита</span>
                  <span className="text-muted-foreground text-sm">аналитик</span>
                </a>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
