import { User } from '@prisma/client';
import { TbTableExport } from 'react-icons/tb';

import { Button, ButtonProps } from '@/components/ui/button';
import { exportUsersToCsv } from '@/lib/utils';

interface UserListExportButtonProps extends Omit<ButtonProps, 'children' | 'onClick'> {
  users: User[];
  fileName: string;
}

export function UserListExportButton({ users, fileName, variant, ...props }: UserListExportButtonProps) {
  const onExport = () => {
    exportUsersToCsv(users, fileName);
  };

  return (
    <Button onClick={onExport} variant={variant ?? 'outline'} {...props}>
      <TbTableExport />
      Exportálás
    </Button>
  );
}
