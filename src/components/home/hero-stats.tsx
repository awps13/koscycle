import { CAMPUSES } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import { getStats } from "@/lib/queries";

function Stat({ value, label, tone }: { value: string; label: string; tone?: "primary" | "gold" }) {
  return (
    <div>
      <p
        className={
          tone === "gold"
            ? "text-2xl font-extrabold text-gold"
            : tone === "primary"
              ? "text-2xl font-extrabold text-primary"
              : "text-2xl font-extrabold"
        }
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export async function HeroStats() {
  const stats = await getStats();
  const campuses = Math.max(stats.activeCampuses, CAMPUSES.length);
  return (
    <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-6 sm:max-w-lg">
      <Stat value={`${formatNumber(stats.soldThisMonth)}+`} label="Barang Teroper Bulan Ini" tone="primary" />
      <Stat value={`${campuses} Kampus`} label="Terhubung se-Indonesia" />
      <Stat value="100% KTM" label="Penjual Wajib Unggah KTM" tone="gold" />
    </div>
  );
}

export function HeroStatsFallback() {
  return (
    <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-6 sm:max-w-lg">
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-7 w-20 animate-pulse rounded bg-muted" />
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
