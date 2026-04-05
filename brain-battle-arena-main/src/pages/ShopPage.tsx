import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { CoinDisplay } from '@/components/CoinDisplay';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { rewardItems } from '@/data/mockData';
import { RewardItem } from '@/types/game';
import { ArrowLeft, Lock, Check, ShoppingBag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ShopPage() {
  const navigate = useNavigate();
  const { profile, user, refreshProfile } = useAuth();
  const coins = profile?.total_coins || 0;
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const handlePurchase = async (item: RewardItem) => {
    if (!user || coins < item.cost || purchasedItems.includes(item.id)) return;
    
    await supabase.from('profiles').update({
      total_coins: coins - item.cost,
    }).eq('user_id', user.id);
    
    setPurchasedItems([...purchasedItems, item.id]);
    await refreshProfile();
    toast({ title: "🎉 Item Unlocked!", description: `You've unlocked the ${item.name}!` });
  };

  const getItemStatus = (item: RewardItem) => {
    if (purchasedItems.includes(item.id)) return 'purchased';
    if (coins >= item.cost) return 'available';
    return 'locked';
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft size={20} /> Back
          </Button>
          <Logo size="sm" showTagline={false} />
          <CoinDisplay amount={coins} size="md" />
        </div>

        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingBag className="text-coin" size={32} />
            <h1 className="font-display text-3xl font-bold">Coin Shop</h1>
          </div>
          <p className="font-body text-muted-foreground">Redeem your coins for exclusive rewards!</p>
        </div>

        <div className="card-gaming p-6 text-center glow-gold">
          <p className="font-body text-muted-foreground mb-2">Your Balance</p>
          <CoinDisplay amount={coins} size="lg" showLabel />
        </div>

        <div className="grid grid-cols-2 gap-4 animate-fade-in">
          {rewardItems.map((item) => {
            const status = getItemStatus(item);
            return (
              <div key={item.id} className={`card-gaming p-4 text-center transition-all duration-300 ${
                status === 'available' ? 'border-coin/50 hover:glow-gold cursor-pointer' :
                status === 'purchased' ? 'border-success/50 bg-success/10' : 'opacity-60'
              }`}>
                <div className="text-5xl mb-3">{item.icon}</div>
                <h3 className="font-display font-bold text-lg mb-1">{item.name}</h3>
                <p className="font-body text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CoinDisplay amount={item.cost} size="sm" />
                </div>
                {status === 'purchased' ? (
                  <div className="flex items-center justify-center gap-2 text-success">
                    <Check size={16} /><span className="font-display text-sm">Owned</span>
                  </div>
                ) : status === 'available' ? (
                  <Button onClick={() => handlePurchase(item)} className="btn-gaming w-full" size="sm">Unlock</Button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Lock size={16} /><span className="font-display text-sm">Need {item.cost - coins} more</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
