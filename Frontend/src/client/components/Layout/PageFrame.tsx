type PageFrameProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export default function PageFrame({
  title,
  description,
  children,
}: PageFrameProps) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/70">
          LifeOS
        </p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          {description}
        </p>
      </header>

      {children ? (
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20">
          {children}
        </div>
      ) : null}
    </section>
  );
}
