export function PageHeading({ eyebrow, title, desc, children }: { eyebrow?: string; title: string; desc?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-xs font-bold tracking-wider text-primary uppercase">{eyebrow}</p> : null}
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{title}</h1>
        {desc ? <p className="mt-1 text-muted-foreground">{desc}</p> : null}
      </div>
      {children}
    </div>
  );
}
