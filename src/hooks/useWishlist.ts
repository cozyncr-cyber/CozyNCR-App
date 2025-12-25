import { useEffect, useState, useCallback } from "react";
import { isWishlisted, toggleWishlist } from "@/lib/services/wishlist";
import { useUser } from "@/src/contexts/UserContext";

export function useWishlist(listingId?: string) {
  const user = useUser();
  const userId = user?.current?.$id;

  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initial check
  useEffect(() => {
    if (!userId || !listingId) return;

    let mounted = true;

    const check = async () => {
      const exists = await isWishlisted(userId, listingId);
      if (mounted) setWishlisted(exists);
    };

    check();

    return () => {
      mounted = false;
    };
  }, [userId, listingId]);

  const toggle = useCallback(async () => {
    if (!userId || !listingId) return;

    setLoading(true);
    setWishlisted((prev) => !prev); // optimistic

    try {
      await toggleWishlist(userId, listingId);
    } catch (err) {
      setWishlisted((prev) => !prev); // rollback
      console.error("Wishlist toggle failed", err);
    } finally {
      setLoading(false);
    }
  }, [userId, listingId]);

  return {
    wishlisted,
    loading,
    toggle,
  };
}
