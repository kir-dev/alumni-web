import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PageSizeDropdownProps {
  limit: number;
  setLimit: (limit: number) => void;
}

export function PageSizeDropdown({ limit, setLimit }: PageSizeDropdownProps) {
  return (
    <Select value={String(limit)} onValueChange={(value) => setLimit(Number(value))}>
      <SelectTrigger className='w-20'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[10, 20, 50, 100].map((value) => (
          <SelectItem key={value} onClick={() => setLimit(value)} value={String(value)}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
