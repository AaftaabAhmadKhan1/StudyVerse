'use client';

import { useState } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ChannelSubscribeButtonProps {
  channelId: string;
  className: string;
  subscribedClassName?: string;
  iconClassName?: string;
}

export default function ChannelSubscribeButton({
  channelId,
  className,
  subscribedClassName,
  iconClassName = 'w-4 h-4',
}: ChannelSubscribeButtonProps) {
  const { isSubscribedToChannel, subscribeToChannel, signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const isSubscribed = isSubscribedToChannel(channelId);

  const handleClick = async () => {
    if (loading || isSubscribed) return;

    setLoading(true);
    const result = await subscribeToChannel(channelId);
    setLoading(false);

    if (result.requiresAuth) {
      signIn();
      return;
    }

    if (!result.ok && result.error) {
      window.alert(result.error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || isSubscribed}
      className={isSubscribed ? subscribedClassName || className : className}
    >
      {loading ? (
        <Loader2 className={`${iconClassName} animate-spin`} />
      ) : isSubscribed ? (
        <Check className={iconClassName} />
      ) : (
        <Bell className={iconClassName} />
      )}
      {loading ? 'Subscribing...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
    </button>
  );
}
