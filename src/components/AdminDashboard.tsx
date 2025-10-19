import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Briefcase, 
  Eye, 
  Edit, 
  Calendar,
  Globe,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  postsCount: number;
  jobsCount: number;
  publishedPosts: number;
  publishedJobs: number;
  onCreatePost: () => void;
  onCreateJob: () => void;
  onViewSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  postsCount,
  jobsCount,
  publishedPosts,
  publishedJobs,
  onCreatePost,
  onCreateJob,
  onViewSite
}) => {
  const stats = [
    {
      title: 'Total Blog Posts',
      value: postsCount,
      icon: FileText,
      description: `${publishedPosts} published`,
      color: 'text-blue-600'
    },
    {
      title: 'Job Postings',
      value: jobsCount,
      icon: Briefcase,
      description: `${publishedJobs} published`,
      color: 'text-green-600'
    },
    {
      title: 'Published Content',
      value: publishedPosts + publishedJobs,
      icon: Globe,
      description: 'Live on website',
      color: 'text-purple-600'
    },
    {
      title: 'Draft Content',
      value: (postsCount - publishedPosts) + (jobsCount - publishedJobs),
      icon: Edit,
      description: 'Ready to publish',
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      title: 'Create Blog Post',
      description: 'Write a new article or company update',
      icon: FileText,
      action: onCreatePost,
      variant: 'default' as const
    },
    {
      title: 'Create Job Posting',
      description: 'Add a new position to your careers page',
      icon: Briefcase,
      action: onCreateJob,
      variant: 'outline' as const
    },
    {
      title: 'View Live Website',
      description: 'See how your content looks to visitors',
      icon: Eye,
      action: onViewSite,
      variant: 'ghost' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Your Content Manager</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Manage your website content with ease. Create blog posts, job listings, and keep your audience engaged with fresh content.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <action.icon className="h-5 w-5" />
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {action.description}
              </p>
              <Button 
                variant={action.variant} 
                onClick={action.action}
                className="w-full"
              >
                {action.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips for Success */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">Tips for Success</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>Save as Draft first:</strong> Review your content before publishing to ensure quality.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>Regular updates:</strong> Fresh content keeps visitors engaged and improves SEO.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <Users className="h-4 w-4 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>Know your audience:</strong> Write content that addresses your readers' needs and interests.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};