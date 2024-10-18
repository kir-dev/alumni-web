'use client';

import { useEffect, useRef, useState } from 'react';
import { TbSearch } from 'react-icons/tb';

import { trpc } from '@/_trpc/client';
import { EventListItem } from '@/components/group/event-list-item';
import { GroupListItem } from '@/components/group/group-list-item';
import { NewsListItem } from '@/components/group/news-list-item';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

export function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const publicSearch = trpc.publicSearch.useQuery(debouncedSearch, {
    enabled: debouncedSearch.length > 0,
  });

  useEffect(() => {
    const keybinding = (e: KeyboardEvent) => {
      if (e.key === '/' && !focused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && focused) {
        setFocused(false);
      }
    };

    window.addEventListener('keydown', keybinding);
    return () => window.removeEventListener('keydown', keybinding);
  }, [focused]);

  return (
    <>
      <div
        className={cn(
          'w-screen h-screen bg-black/50 absolute z-20 top-0 left-0 right-0 bottom-0 animate-in fade-in fade-out',
          {
            hidden: !focused,
          }
        )}
        onClick={() => setFocused(false)}
      />
      <div
        className='overlay relative flex-1 min-h-10 z-30'
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const link = target.closest('a');
          if (link) {
            setFocused(false);
          }
        }}
      >
        <div
          className={cn(
            'absolute left-0 right-0 bg-slate-300 dark:bg-slate-900 rounded-md pointer-events-auto max-h-[calc(100vh-10rem)] flex flex-col space-y-0',
            {
              '': focused,
            }
          )}
        >
          <div className='flex relative items-center bg-slate-200 dark:bg-slate-800 rounded-md'>
            <TbSearch className='text-slate-400 mx-4' />
            <Input
              ref={inputRef}
              onFocus={() => setFocused(true)}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Keresés...'
            />
            {!focused && (
              <span className='absolute right-2 text-slate-400 border border-slate-400 px-2 rounded-md'>/</span>
            )}
          </div>
          {focused && (
            <>
              {!debouncedSearch && <p className='text-center py-2'>Gépelj a kereséshez!</p>}
              {debouncedSearch && (
                <div className='space-y-2 p-2 overflow-auto'>
                  {publicSearch.isLoading && [1, 2, 3].map((i) => <Skeleton className='h-20' key={i} />)}
                  {publicSearch.data?.news.map((news) => (
                    <NewsListItem
                      news={{
                        ...news,
                        publishDate: new Date(news.publishDate),
                      }}
                      key={news.id}
                    />
                  ))}
                  {publicSearch.data?.events.map((event) => (
                    <EventListItem
                      event={{
                        ...event,
                        startDate: new Date(event.startDate),
                        endDate: new Date(event.endDate),
                      }}
                      key={event.id}
                    />
                  ))}
                  {publicSearch.data?.groups.map((group) => <GroupListItem group={group} key={group.id} />)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
