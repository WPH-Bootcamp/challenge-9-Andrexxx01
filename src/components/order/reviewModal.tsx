import { useState } from "react";
import { api } from "@/services/api/axios";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  transactionId: string;
  restaurantId: number;
  menuIds: number[];
  onSuccess: () => void;
}

export default function ReviewModal({
  open,
  onClose,
  transactionId,
  restaurantId,
  menuIds,
  onSuccess,
}: ReviewModalProps) {
  const [star, setStar] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSend = async () => {
    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post("/api/review", {
        transactionId,
        restaurantId,
        star,
        comment: comment.trim(),
        menuIds,
      });

      onSuccess();
      onClose();
      setComment("");
      setStar(5);
    } catch {
      setError("Failed to send review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
 
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Modal */}
      <div className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-[0px_0px_20px_0px_#CBCACA40]">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-extrabold">Give Review</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Please share your thoughts about our service!
            </p>
          </div>

          {/* Rating */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStar(n)}
                className={`text-2xl ${
                  n <= star ? "text-yellow-400" : "text-neutral-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Please share your thoughts about our service!"
            className="h-28 w-full resize-none rounded-xl border p-3 text-sm outline-none focus:ring-2 focus:ring-red-500"
          />

          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          <button
            onClick={handleSend}
            disabled={loading}
            className="h-12 w-full rounded-full bg-red-600 text-sm font-bold text-white disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
