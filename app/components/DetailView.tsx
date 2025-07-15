import ReactMarkdown from "react-markdown";

type Item = {
  id: number;
  title: string;
  summary: string;  // markdown
  content: string;  // html
};

type Props = {
  item: Item | null;
};

export default function DetailView({ item }: Props) {
  if (!item) {
    return (
      <div className="p-6 text-gray-500 italic">
        Select an article to view its details.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>

      {/* Summary (Markdown) */}
      <div className="prose max-w-none text-gray-800">
        <ReactMarkdown>{item.summary}</ReactMarkdown>
      </div>

      <hr className="border-gray-300" />

      {/* Content (HTML) */}
      <div
        className="prose max-w-none text-gray-900"
        dangerouslySetInnerHTML={{ __html: item.content }}
      />
    </div>
  );
}
