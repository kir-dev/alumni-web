import { IconType } from 'react-icons';
import { TbAlignJustified, TbPhoto, TbSquareHalf, TbSquarePlus } from 'react-icons/tb';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { StaticSiteBlock } from '@/types/site-editor.types';

interface AddBlockFieldProps {
  onAdd: (type: StaticSiteBlock['type']) => void;
}

export function AddBlockField({ onAdd }: AddBlockFieldProps) {
  return (
    <Drawer>
      <DrawerTrigger className='w-full border-2 border-dashed border-primary-500 rounded-md p-10 flex flex-col gap-2 items-center justify-center text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-800 mt-10'>
        <TbSquarePlus />
        Blokk hozzáadása
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='flex flex-col items-center'>
          <DrawerTitle>Blokk hozzáadása</DrawerTitle>
          <DrawerDescription>Válassz egy blokkot az alábbiak közül!</DrawerDescription>
        </DrawerHeader>
        <div className='flex gap-5 flex-wrap p-5 justify-center'>
          {Blocks.map((block) => (
            <DrawerClose key={block.type}>
              <Button
                onClick={() => onAdd(block.type)}
                variant='secondary'
                className='flex flex-col p-5 h-fit items-start'
              >
                <div className='flex gap-2 items-center text-lg'>
                  <block.icon />
                  <strong>{block.name}</strong>
                </div>
                <p>{block.description}</p>
              </Button>
            </DrawerClose>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose>
            <Button variant='secondary' className='px-10'>
              Mégse
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type AddBlockType = {
  type: StaticSiteBlock['type'];
  icon: IconType;
  name: string;
  description: string;
};

const Blocks: AddBlockType[] = [
  {
    type: 'Text',
    icon: TbAlignJustified,
    name: 'Szöveg',
    description: 'Markdown szöveg megjelenítése',
  },
  {
    type: 'Image',
    icon: TbPhoto,
    name: 'Kép',
    description: 'Egy kép megjelenítése',
  },
  {
    type: 'ImageText',
    icon: TbSquareHalf,
    name: 'Kép és szöveg',
    description: 'Kép és szöveg megjelenítése egymás mellett',
  },
];
