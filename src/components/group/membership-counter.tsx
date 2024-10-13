import { TbUserCheck, TbUserScan } from 'react-icons/tb';

import { InlineTooltip } from '@/components/ui/tooltip';

interface MembershipCounterProps {
  approvedCount?: number;
  pendingCount?: number;
}

export default function MembershipCounter({ approvedCount, pendingCount }: MembershipCounterProps) {
  return (
    <InlineTooltip content='Jóváhagyott tagok és várakozók száma'>
      <div className='flex-row justify-between items-center text-sm text-slate-500 border border-slate-500 bg-slate-500/10 px-2.5 py-1 rounded-full w-fit inline'>
        <TbUserCheck className='text-green-500 inline' /> {approvedCount}
        {typeof pendingCount === 'number' ? (
          <>
            {' '}
            | {pendingCount} <TbUserScan className='inline' />
          </>
        ) : null}
      </div>
    </InlineTooltip>
  );
}
