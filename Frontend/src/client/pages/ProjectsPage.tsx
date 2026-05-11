import PageFrame from "../components/Layout/PageFrame";

export default function ProjectsPage() {
  return (
    <PageFrame
      title="Projects"
      description="Review your active and planned work with a page layout that already renders cleanly."
    >
      <p className="text-sm leading-6 text-slate-300">
        Once connected, this view can show cards, progress, tags, and links for
        each project.
      </p>
    </PageFrame>
  );
}
