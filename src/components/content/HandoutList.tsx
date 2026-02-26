import { HandoutCard } from './HandoutCard';

interface Handout {
  id: string;
  title: string;
  description?: string;
  file_type: string;
  file_size: number;
}

interface HandoutListProps {
  handouts: Handout[];
}

export function HandoutList({ handouts }: HandoutListProps) {
  if (!handouts || handouts.length === 0) return null;

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="my-8">
      <h3 className="text-lg font-bold text-text-primary mb-4">Resources & Downloads</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {handouts.map((handout) => (
          <HandoutCard
            key={handout.id}
            id={handout.id}
            title={handout.title}
            description={handout.description}
            fileType={handout.file_type}
            fileSize={formatBytes(handout.file_size)}
          />
        ))}
      </div>
    </div>
  );
}
