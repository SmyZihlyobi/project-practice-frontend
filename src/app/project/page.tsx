import { Card } from '@/components/ui/card';
import Filter from './ui/filter';
import { Projects } from './ui/projects';

export default function Pages() {
  return (
    <div>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="p-4">
              <Filter></Filter>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Card className="p-4">
              <Projects></Projects>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
