import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUrl, type CreateUrlParams } from '@/api/url';
import toast from 'react-hot-toast';

const urlSchema = yup.object({
  originalUrl: yup
    .string()
    .url('Please enter a valid URL')
    .required('URL is required')
    .max(2048, 'URL is too long'),
  customUrl: yup
    .string()
    .optional()
    .matches(
      /^[a-zA-Z0-9-_]+$/,
      'Custom URL can only contain letters, numbers, hyphens and underscores'
    )
    .min(3, 'Custom URL must be at least 3 characters')
    .max(50, 'Custom URL must not exceed 50 characters'),
  title: yup
    .string()
    .optional()
    .max(200, 'Title must not exceed 200 characters'),
});

interface CreateUrlModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateUrlModal = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateUrlModalProps) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik<CreateUrlParams>({
    initialValues: {
      originalUrl: '',
      customUrl: '',
      title: '',
    },
    validationSchema: urlSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const params: CreateUrlParams = {
          originalUrl: values.originalUrl.trim(),
          ...(values.customUrl && { customUrl: values.customUrl.trim() }),
          ...(values.title && { title: values.title.trim() }),
        };

        const result = await createUrl(params);
        if (result.success) {
          formik.resetForm();
          onSuccess();
        } else {
          toast.error(result.message || 'Failed to create URL');
        }
      } catch (error) {
        toast.error('An error occurred while creating URL');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClose = () => {
    if (!loading) {
      formik.resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Short URL</DialogTitle>
          <DialogDescription>
            Enter a URL to shorten. You can optionally add a custom alias and
            title.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="originalUrl">
              Original URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="originalUrl"
              name="originalUrl"
              type="url"
              placeholder="https://example.com"
              value={formik.values.originalUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              className={
                formik.touched.originalUrl && formik.errors.originalUrl
                  ? 'border-destructive'
                  : ''
              }
            />
            {formik.touched.originalUrl && formik.errors.originalUrl && (
              <p className="text-sm text-destructive">
                {formik.errors.originalUrl}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customUrl">Custom Alias (Optional)</Label>
            <Input
              id="customUrl"
              name="customUrl"
              type="text"
              placeholder="my-custom-link"
              value={formik.values.customUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              className={
                formik.touched.customUrl && formik.errors.customUrl
                  ? 'border-destructive'
                  : ''
              }
            />
            {formik.touched.customUrl && formik.errors.customUrl && (
              <p className="text-sm text-destructive">
                {formik.errors.customUrl}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Letters, numbers, hyphens, and underscores only (3-50 characters)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="My Awesome Link"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              className={
                formik.touched.title && formik.errors.title
                  ? 'border-destructive'
                  : ''
              }
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-destructive">{formik.errors.title}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create URL'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

