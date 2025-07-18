import { Card, CardContent } from "@/components/ui/card";

type Article = {
  id: number;
  title: string;
  link: string;
  published_date: string;
};

export default function CardList({ articles, onSelect, selectedId }: {
  articles: Article[];
  onSelect: (article: Article) => void;
  selectedId?: number;
}) {
  return (
    <div className="flex flex-col gap-4 w-72">
      {articles.map((article) => (
        <Card
          key={article.id}
          className={`cursor-pointer ${
            selectedId === article.id ? "border-primary ring-1 ring-primary" : ""
          }`}
          onClick={() => onSelect(article)}
        >
          <CardContent className="p-4">
            <h3 className="text-md font-semibold">{article.title}</h3>
            <p className="text-sm text-gray-500">{article.published_date}</p>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {article.link}
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
