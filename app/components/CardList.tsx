import { Card, CardContent } from "@/components/ui/card";

type Item = {
  id: number;
  title: string;
  link: string;
  published_date: string;
};

type Props = {
  items: Item[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function CardList({ items, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-4 w-72">
      {items.map((item) => (
        <Card
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`cursor-pointer ${
            selectedId === item.id ? "border-primary ring-1 ring-primary" : ""
          }`}
        >
          <CardContent className="p-4">
            <h3 className="text-md font-semibold">{item.title}</h3>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View Source
            </a>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(item.published_date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}