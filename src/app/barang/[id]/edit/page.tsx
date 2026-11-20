import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ListingForm } from "@/components/forms/listing-form";
import { updateListing } from "@/lib/actions/listing";
import { getListingById } from "@/lib/queries";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Edit Iklan" };

export default function EditListingPage({ params }: PageProps<"/barang/[id]/edit">) {
  return (
    <div className="bg-surface">
      <div className="container-page max-w-3xl py-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Edit Iklan</h1>
        <div className="mt-8">
          <Suspense fallback={<div className="h-[600px] animate-pulse rounded-2xl bg-muted" />}>
            <EditForm params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function EditForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await requireUser(`/barang/${id}/edit`);
  const item = await getListingById(id);
  if (!item || item.sellerId !== me.id) notFound();

  return (
    <ListingForm
      action={updateListing.bind(null, item.id)}
      submitLabel="Simpan Perubahan"
      initial={{
        title: item.title,
        description: item.description,
        category: item.category,
        campus: item.campus,
        area: item.area ?? "",
        type: item.type,
        price: item.price,
        barterWish: item.barterWish ?? "",
        condition: item.condition,
        images: item.images,
      }}
    />
  );
}
