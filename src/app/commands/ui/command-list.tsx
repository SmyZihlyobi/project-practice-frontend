'use client';

import { Accordion } from '@/components/ui/accordion';
import { CommandItem } from './members-table';

const commands = [
  {
    commandName: 'Смузихлёбы',
    commandId: 12312,
  },
  {
    commandName: 'Золики',
    commandId: 1212,
  },
];

export const CommandList = () => {
  return (
    <Accordion type="multiple" className="w-full">
      {commands.map(command => (
        <CommandItem
          key={String(command.commandId)}
          id={command.commandId}
          commandName={command.commandName}
        />
      ))}
    </Accordion>
  );
};
