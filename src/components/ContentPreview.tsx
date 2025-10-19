import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Copy, ExternalLink, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ContentPreviewProps {
  title: string;
  slug: string;
  status: 'draft' | 'published';
  type: 'post' | 'job';
  excerpt?: string;
  summary?: string;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({
  title,
  slug,
  status,
  type,
  excerpt,
  summary
}) => {
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const contentUrl = `${baseUrl}/${type === 'post' ? 'resources' : 'jobs'}/${slug}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied to clipboard!' });
    } catch (err) {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Badge variant={status === 'published' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        {excerpt || summary}
      </p>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <span>Slug: /{type === 'post' ? 'resources' : 'jobs'}/{slug}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(slug)}
          className="h-auto p-1"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="flex gap-2">
        {status === 'published' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(contentUrl, '_blank')}
            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            Preview Live
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(contentUrl)}
          className="flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          Copy URL
        </Button>
      </div>
    </Card>
  );
};