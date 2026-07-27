import { Upload } from 'lucide-react';
import FileListItem from './FileListItem';
import type { UploadedFile } from '../types/dashboard.types';

export default function ClassFilesList({
  files,
  onDelete,
}: {
  files: UploadedFile[];
  onDelete?: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-pixel text-[10px] tracking-wide text-parchment-300">
          Uploaded Files
        </p>
        <button className="flex items-center gap-1.5 border-2 border-canopy-700 px-2.5 py-1 text-[11px] text-parchment-300 hover:border-leaf-400 hover:text-leaf-300">
          <Upload className="h-3.5 w-3.5" />
          Upload
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {files.length === 0 ? (
          <p className="border-2 border-dashed border-canopy-700 px-3 py-4 text-center text-xs text-parchment-500">
            No files uploaded yet for this class.
          </p>
        ) : (
          files.map((file) => (
            <FileListItem key={file.id} file={file} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}