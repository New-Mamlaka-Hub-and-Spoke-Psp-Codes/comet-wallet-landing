import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CometMark } from './icons';

interface LegalPageProps {
  eyebrow: string;
  title: string;
  pageTitle: string;
  source: string;
}

export default function LegalPage({ eyebrow, title, pageTitle, source }: LegalPageProps) {
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <section className="legal-page wrap">
      <div className="legal-hero">
        <span className="eyebrow">
          <CometMark width={14} height={14} />
          {eyebrow}
        </span>
        <h1>{title}</h1>
      </div>
      <article className="legal-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
      </article>
    </section>
  );
}
