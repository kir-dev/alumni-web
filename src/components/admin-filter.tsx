import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface AdminFilterProps {
  isAdmin: boolean;
  onToggleAdmin: (isAdmin: boolean) => void;
}

export function AdminFilter({ isAdmin, onToggleAdmin }: AdminFilterProps) {
  return (
    <div className='flex space-x-2 items-center border border-slate-200 dark:border-slate-800 p-2 rounded-md h-10'>
      <Checkbox id='admin-filter' checked={isAdmin} onCheckedChange={onToggleAdmin} />
      <Label className='m-0' htmlFor='admin-filter'>
        Adminra szűrés
      </Label>
    </div>
  );
}
