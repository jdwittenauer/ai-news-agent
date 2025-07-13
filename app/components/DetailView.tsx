type Item = {
  id: number;
  title: string;
  summary: string;
  content: string;
};

type Props = {
  item: Item | null;
};

export default function DetailView({ item }: Props) {
  if (!item) {
    return <div className="text-gray-500">Select a story to view details.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">{item.title}</h2>
      <p className="text-gray-700">{item.summary}</p>
      <hr />
      <div className="prose max-w-none text-gray-900">
        {item.content}
      </div>
    </div>
  );
}