// components/checkout/PaymentSuccessToast.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: {
    date: string;
    paymentMethod: string;
    price: number;
    items: number;
    deliveryFee: number;
    serviceFee: number;
    total: number;
  };
}

export default function PaymentSuccessToast({
  open,
  onOpenChange,
  data,
}: Props) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-90
          rounded-3xl
          p-0
          overflow-hidden
          shadow-[0px_0px_20px_0px_#CBCACA40]
        "
      >
        <div className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <img src="/icon-park-solid_check-one.svg" className="h-14 w-14" />
          </div>

          <h2 className="text-lg font-extrabold">Payment Success</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Your payment has been successfully processed.
          </p>
        </div>

        <div className="border-t border-dashed px-6 py-4 text-sm">
          <Row label="Date" value={data.date} />
          <Row label="Payment Method" value={data.paymentMethod} />
          <Row
            label={`Price (${data.items} items)`}
            value={`Rp${data.price.toLocaleString("id-ID")}`}
          />
          <Row
            label="Delivery Fee"
            value={`Rp${data.deliveryFee.toLocaleString("id-ID")}`}
          />
          <Row
            label="Service Fee"
            value={`Rp${data.serviceFee.toLocaleString("id-ID")}`}
          />

          <div className="mt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>Rp{data.total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="p-6 pt-2">
          <button
            onClick={() => navigate("/orders")}
            className="h-12 w-full rounded-full bg-red-600 text-sm font-bold text-white"
          >
            See My Orders
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2 flex justify-between">
      <span className="text-neutral-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
