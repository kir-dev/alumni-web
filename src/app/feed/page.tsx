import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { EventFeedItemComponent } from '@/components/feed/event-feed-item';
import { NewsFeedItemComponent } from '@/components/feed/news-feed-item';
import { authOptions } from '@/config/auth.config';
import { EventFeedItem, getFeed, NewsFeedItem } from '@/lib/feed';

export default async function FeedPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return notFound();
  }
  const feed = await getFeed(session.user.id);

  return (
    <main>
      <h1>Hírfolyam</h1>
      {feed.map((feedItem) => {
        if (isEventFeedItem(feedItem)) {
          return <EventFeedItemComponent key={feedItem.event.id} eventFeedItem={feedItem} />;
        }
        if (isNewsFeedItem(feedItem)) {
          return <NewsFeedItemComponent key={feedItem.news.id} newsFeedItem={feedItem} />;
        }
      })}
    </main>
  );
}

function isEventFeedItem(feedItem: any): feedItem is EventFeedItem {
  return feedItem.type === 'event';
}

function isNewsFeedItem(feedItem: any): feedItem is NewsFeedItem {
  return feedItem.type === 'news';
}
