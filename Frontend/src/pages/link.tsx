import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Globe,
  Smartphone,
  Monitor,
  MapPin,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getUrlAnalytics, type UrlAnalytics, type Url } from '@/api/url';
import toast from 'react-hot-toast';

const Analytics = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.state?.url as Url | undefined;

  const [analytics, setAnalytics] = useState<UrlAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAnalytics();
    }
  }, [id]);

  const fetchAnalytics = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const result = await getUrlAnalytics(parseInt(id));
      if (result.success && result.data) {
        setAnalytics(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch analytics');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('An error occurred while fetching analytics');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getDeviceIcon = (device: string) => {
    const lowerDevice = device.toLowerCase();
    if (lowerDevice.includes('mobile') || lowerDevice.includes('android') || lowerDevice.includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (lowerDevice.includes('tablet') || lowerDevice.includes('ipad')) {
      return <Monitor className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getUniqueCount = (arr: string[]) => {
    return [...new Set(arr)].length;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics || !url) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analytics not found</h3>
          <p className="text-muted-foreground mb-6">
            Unable to load analytics for this URL.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const uniqueCountries = getUniqueCount(analytics.countries || []);
  const uniqueDevices = getUniqueCount(analytics.devices || []);
  const uniqueCities = getUniqueCount(analytics.cities || []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {url.title || 'URL Analytics'}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <a
                href={url.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-mono text-sm flex items-center gap-1"
              >
                {url.shortUrl.replace(/^https?:\/\//, '')}
                <ExternalLink className="h-3 w-3" />
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
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalVisits}</div>
            <p className="text-xs text-muted-foreground">
              All time clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCountries}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.uniqueCountries} distinct
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Device Types</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueDevices}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.uniqueDevices} distinct
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cities</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCities}</div>
            <p className="text-xs text-muted-foreground">
              Unique locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>
              Countries where your link was accessed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.countries && analytics.countries.length > 0 ? (
              <div className="space-y-2">
                {[...new Set(analytics.countries)]
                  .slice(0, 10)
                  .map((country, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{country}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {analytics.countries.filter((c) => c === country).length}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No country data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Devices */}
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>
              Devices used to access your link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.devices && analytics.devices.length > 0 ? (
              <div className="space-y-2">
                {[...new Set(analytics.devices)]
                  .slice(0, 10)
                  .map((device, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device)}
                        <span className="text-sm font-medium">
                          {device.length > 30 ? `${device.substring(0, 30)}...` : device}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {analytics.devices.filter((d) => d === device).length}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No device data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cities */}
      {analytics.cities && analytics.cities.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Top Cities</CardTitle>
            <CardDescription>
              Cities where your link was accessed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[...new Set(analytics.cities)]
                .slice(0, 15)
                .map((city, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{city}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {analytics.cities.filter((c) => c === city).length}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Original URL */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Original URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex-1 break-all flex items-center gap-1"
            >
              {url.originalUrl}
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleCopy(url.originalUrl)}
              className="h-8 w-8 flex-shrink-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
