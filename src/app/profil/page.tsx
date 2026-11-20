import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeading } from "@/components/page-heading";
import { KtmUpload } from "@/components/forms/ktm-upload";
import { ProfileForm } from "@/components/forms/profile-form";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Profil & KTM" };

export default function ProfilPage({ searchParams }: PageProps<"/profil">) {
  return (
    <div className="container-page max-w-4xl py-10">
      <PageHeading eyebrow="Akun" title="Profil & Verifikasi KTM" />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
        <Profile searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Profile({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const me = await requireUser("/profil");
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border bg-background p-6">
        <h2 className="mb-5 font-bold">Data Diri</h2>
        <ProfileForm
          initial={{ name: me.name, email: me.email, campus: me.campus, whatsapp: me.whatsapp, image: me.image }}
        />
      </section>
      <section className="rounded-2xl border bg-background p-6">
        <h2 className="mb-1 font-bold">Kartu Tanda Mahasiswa (KTM)</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Verifikasi KTM bikin pembeli lebih percaya dan COD jadi lebih aman.
        </p>
        <KtmUpload ktmUrl={me.ktmUrl} verified={me.ktmVerified} next={next} />
      </section>
    </div>
  );
}
