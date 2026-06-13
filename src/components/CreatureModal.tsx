import { useEffect } from 'react';
import { X, Download } from 'lucide-react';
import type { Creature } from '../utils/creatureGenerator';
import CreatureCard from './CreatureCard';
import { useRef, useState, useCallback } from 'react';
import { domToPng } from 'modern-screenshot';

interface Props {
  creature: Creature;
  onClose: () => void;
}

export default function CreatureModal({ creature, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await domToPng(cardRef.current, {
        scale: 2,
        backgroundColor: '#13131f',
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${creature.name.replace(/[^a-z0-9]/gi, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  }, [creature.name]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Card */}
        <CreatureCard creature={creature} cardRef={cardRef} />

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="download-btn mt-4 w-full justify-center"
        >
          <Download size={16} />
          <span>{downloading ? 'Saving...' : 'Download Card'}</span>
        </button>
      </div>
    </div>
  );
}