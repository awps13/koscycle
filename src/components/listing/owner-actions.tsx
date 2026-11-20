"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormSelect } from "@/components/forms/form-select";
import { deleteListing, setListingStatus } from "@/lib/actions/listing";
import { LISTING_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(status);
  return (
    <div className={cn(pending && "pointer-events-none opacity-60")}>
      <FormSelect
        name="status"
        value={value}
        onValueChange={(v) => {
          setValue(v);
          startTransition(async () => {
            const res = await setListingStatus(id, v);
            if (res.ok) toast.success("Status iklan diperbarui");
            else toast.error(res.message ?? "Gagal memperbarui status");
          });
        }}
        options={LISTING_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
      />
    </div>
  );
}

export function DeleteListingButton({
  id,
  redirectTo,
  compact,
}: {
  id: string;
  redirectTo?: string;
  compact?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size={compact ? "icon" : "default"} className={compact ? "size-10" : "h-10 rounded-lg"} />
        }
        aria-label="Hapus iklan"
      >
        <Trash2 className="size-4" />
        {compact ? null : "Hapus"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus iklan ini?</DialogTitle>
          <DialogDescription>
            Iklan, foto, dan percakapan terkait akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await deleteListing(id, redirectTo);
                if (res?.ok) {
                  toast.success("Iklan dihapus");
                  setOpen(false);
                } else if (res) toast.error(res.message ?? "Gagal menghapus");
              })
            }
          >
            {pending ? "Menghapus…" : "Ya, hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OwnerActions({ id, status }: { id: string; status: string }) {
  return (
    <div className="space-y-3 rounded-2xl border bg-mint/40 p-5">
      <p className="text-sm font-bold">Ini iklanmu</p>
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">Status iklan</p>
        <StatusSelect id={id} status={status} />
      </div>
      <div className="flex gap-2">
        <Link
          href={`/barang/${id}/edit`}
          className={cn(buttonVariants({ variant: "outline" }), "h-10 flex-1 rounded-lg bg-background font-semibold")}
        >
          <Pencil className="size-4" /> Edit Iklan
        </Link>
        <DeleteListingButton id={id} redirectTo="/dashboard" />
      </div>
    </div>
  );
}
