import PageFrame from "../components/Layout/PageFrame";

export default function JobsPage() {
  return (
    <PageFrame
      title="Jobs"
      description="Track applications and interviews with a proper page frame instead of a migration stub."
    >
      <p className="text-sm leading-6 text-slate-300">
        The job pipeline data can be rendered here once the list endpoint is in
        use.
      </p>
    </PageFrame>
  );
}
