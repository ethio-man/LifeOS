export default function Modal({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) {
  if (!isOpen) return null;
  return <div>{children}</div>;
}
