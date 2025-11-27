import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, Edit, Trash2, ExternalLink, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { getUrls, deleteUrl, type Url } from '@/api/url';
import { CreateUrlModal } from '@/components/CreateUrlModal';
import { EditUrlModal } from '@/components/EditUrlModal';
import { DeleteUrlDialog } from '@/components/DeleteUrlDialog';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<Url | null>(null);

  // Fetch URLs on component mount
  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const result = await getUrls();
      if (result.success && result.data) {
        setUrls(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch URLs');
      }
    } catch (error) {
      toast.error('An error occurred while fetching URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    fetchUrls();
    toast.success('URL created successfully!');
  };

  const handleEditClick = (url: Url) => {
    setSelectedUrl(url);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSelectedUrl(null);
    fetchUrls();
    toast.success('URL updated successfully!');
  };

  const handleDeleteClick = (url: Url) => {
    setSelectedUrl(url);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUrl) return;

    try {
      const result = await deleteUrl(selectedUrl.id);
      if (result.success) {
        toast.success('URL deleted successfully!');
        setDeleteDialogOpen(false);
        setSelectedUrl(null);
        fetchUrls();
      } else {
        toast.error(result.message || 'Failed to delete URL');
      }
    } catch (error) {
      toast.error('An error occurred while deleting URL');
    }
  };

  const handleCopy = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My URLs</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your shortened URLs
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Create Short URL
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All URLs</CardTitle>
          <CardDescription>
            {urls.length} {urls.length === 1 ? 'URL' : 'URLs'} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              ))}
            </div>
          ) : urls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <ExternalLink className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No URLs yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Get started by creating your first short URL. It's quick and
                easy!
              </p>
              <Button onClick={() => setCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First URL
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Title</TableHead>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Short URL</TableHead>
                    <TableHead className="text-center">Clicks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {urls.map((url) => (
                    <TableRow key={url.id}>
                      <TableCell className="font-medium">
                        {url.title || (
                          <span className="text-muted-foreground italic">
                            Untitled
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <a
                          href={url.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 max-w-md"
                        >
                          {truncateUrl(url.originalUrl)}
                          <ExternalLink className="h-3 w-3 opacity-50" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-mono text-sm"
                          >
                            {url.shortUrl.replace(/^https?:\/\//, '')}
                          </a>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleCopy(url.shortUrl)}
                            className="h-6 w-6"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{url.visitCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(url.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              navigate(`/link/${url.id}`, { state: { url } })
                            }
                            title="View Analytics"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEditClick(url)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDeleteClick(url)}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create URL Modal */}
      <CreateUrlModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit URL Modal */}
      {selectedUrl && (
        <EditUrlModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          url={selectedUrl}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedUrl && (
        <DeleteUrlDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          url={selectedUrl}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default Dashboard;
