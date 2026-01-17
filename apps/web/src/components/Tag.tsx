type TagProps = {
  label: string;
  className?: string;
};

export default function Tag({ label, className }: TagProps) {
  return <span className={className}>{label}</span>;
}
