import { Tailwind, TailwindProps } from '@react-email/components';

import { generateColorPaletteFromHex, getHexForColor } from '@/lib/utils';
import { RootGroup } from '@/types/group.types';

interface ConfiguredTailwindProps extends TailwindProps {
  rootGroup?: RootGroup;
}

export function ConfiguredTailwind({ config, children, rootGroup: group, ...props }: ConfiguredTailwindProps) {
  const primaryColor = getHexForColor(group?.color ?? 'primary');

  return (
    <Tailwind
      config={{
        theme: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          extend: {
            colors: {
              primary: generateColorPaletteFromHex(primaryColor),
            },
          },
        },
        ...config,
      }}
      {...props}
    >
      {children}
    </Tailwind>
  );
}
