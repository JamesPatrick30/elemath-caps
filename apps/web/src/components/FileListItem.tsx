import { FileText, FileSpreadsheet, Image, File, Download, Trash2 } from 'lucide-react';
import type { UploadedFile } from '../types/dashboard.types';

const iconMap = {
  pdf: FileText,
  doc: FileText,
  sheet: FileSpreadsheet,
  image: Image,
  other: File,
};

const iconColorMap = {
  pdf: 'text-mango-300',
  doc: 'text-sky-300',
  sheet: 'text-leaf-400',
  image: 'text-sun-300',
  other: 'text-parchment-400',
};

function formatSize(sizeKb: number) {
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} MB`;
  return `${sizeKb} KB`;
}

export default function FileListItem({
  file,
  onDelete,
}: {
  file: UploadedFile;
  onDelete?: (id: string) => void;
}) {
  const Icon = iconMap[file.type];

  return (
    <div className="flex items-center gap-3 border-2 border-canopy-700 bg-canopy-950/60 px-3 py-2.5">
      <Icon className={`h-4 w-4 shrink-0 ${iconColorMap[file.type]}`} />

      <div className="flex-1 overflow-hidden">
        <p className="truncate text-xs text-parchment-100">{file.name}</p>
        <p className="text-[10px] text-parchment-500">
          {formatSize(file.sizeKb)} · uploaded {file.uploadedAt}
        </p>
      </div>

      <button className="p-1 text-parchment-500 hover:text-leaf-400" title="Download">
        <Download className="h-3.5 w-3.5" />
      </button>
      <button
        className="p-1 text-parchment-500 hover:text-mango-400"
        title="Remove"
        onClick={() => onDelete?.(file.id)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}