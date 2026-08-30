import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { X, UploadCloud, FileText, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import { BlueprintGrid } from '../common/BlueprintGrid';

interface UploadCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadCSVModal: React.FC<UploadCSVModalProps> = ({ isOpen, onClose }) => {
  const { importCSV, resetToDefaultDataset } = useData();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [parseStatus, setParseStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      setParseStatus('error');
      setStatusMessage('Please select a valid .csv file format.');
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileContent(text);
      setParseStatus('idle');
      setStatusMessage(`File "${file.name}" loaded (${(file.size / 1024).toFixed(1)} KB). Ready to import.`);
    };
    reader.onerror = () => {
      setParseStatus('error');
      setStatusMessage('Failed to read file content.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (!fileContent) return;
    const success = importCSV(fileContent, selectedFileName || 'Custom CSV');
    if (success) {
      setParseStatus('success');
      setStatusMessage('Dataset successfully imported & analytics recalculated!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setParseStatus('error');
      setStatusMessage('Validation failed: Missing required fields or invalid format.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0f141f] text-slate-100 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <BlueprintGrid opacity={0.03} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-amber-400" />
          Import Construction Dataset
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Upload any CSV file compatible with the BIM-AI Construction analytics schema.
        </p>

        {/* Drag and drop target */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-5 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-amber-500 bg-amber-500/10'
              : 'border-slate-700 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-amber-400 mb-3 shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-slate-200 block">
            {selectedFileName ? selectedFileName : 'Drag & drop your CSV file here'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">or browse files from your computer</span>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-lg text-xs flex items-center gap-2 font-mono ${
              parseStatus === 'error'
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                : parseStatus === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800 border border-slate-700 text-slate-300'
            }`}
          >
            {parseStatus === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : parseStatus === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : null}
            <span className="line-clamp-2">{statusMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              resetToDefaultDataset();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default (1,000 Projects)
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={!fileContent}
              onClick={handleConfirmImport}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-md font-sans"
            >
              Apply & Parse Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
