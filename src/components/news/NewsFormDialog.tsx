
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { newsFormSchema, NewsFormValues } from '@/lib/news-schemas';
import { UserRole } from '@/types';
import { Calendar, Gift, Info, Megaphone, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface NewsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: NewsFormValues) => void;
  initialValues: NewsFormValues;
  title: string;
  description: string;
  submitLabel: string;
  userRole: UserRole;
}

const NewsFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  title,
  description,
  submitLabel,
  userRole
}: NewsFormDialogProps) => {
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    initialValues.expiresAt ? new Date(initialValues.expiresAt) : undefined
  );
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialValues.imageUrl);
  
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: initialValues
  });
  
  const handleSubmit = (values: NewsFormValues) => {
    onSubmit({
      ...values,
      expiresAt: expiryDate ? expiryDate.toISOString() : '',
    });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('imageUrl', url);
    setImagePreview(url);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Titre */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de l'actualité" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Contenu */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Contenu de l'actualité" 
                      rows={5} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleImageChange(e);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    URL d'une image pour illustrer l'actualité (optionnel)
                  </FormDescription>
                  <FormMessage />
                  
                  {imagePreview && (
                    <div className="mt-2 border rounded-md p-2 bg-gray-50">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu" 
                        className="w-full h-auto max-h-32 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/400x300?text=Image+invalide";
                          setImagePreview("https://via.placeholder.com/400x300?text=Image+invalide");
                        }}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
            
            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="info" id="info" />
                        <Label htmlFor="info" className="flex items-center">
                          <Info className="w-4 h-4 mr-1" />
                          Information
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="announcement" id="announcement" />
                        <Label htmlFor="announcement" className="flex items-center">
                          <Megaphone className="w-4 h-4 mr-1" />
                          Annonce
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="offer" id="offer" />
                        <Label htmlFor="offer" className="flex items-center">
                          <Gift className="w-4 h-4 mr-1" />
                          Offre
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Date d'expiration */}
            <div className="space-y-2">
              <Label>Date d'expiration</Label>
              <div className="flex space-x-2 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[240px] justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {expiryDate ? (
                        format(expiryDate, 'dd MMMM yyyy', { locale: fr })
                      ) : (
                        <span>Aucune date d'expiration</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                {expiryDate && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setExpiryDate(undefined)}
                  >
                    Effacer
                  </Button>
                )}
              </div>
            </div>
            
            {/* Visibilité - Modified for supplier restrictions */}
            <div className="space-y-2">
              <Label>Visibilité</Label>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="visibleToClient"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          id="visibleToClient"
                        />
                      </FormControl>
                      <Label htmlFor="visibleToClient">Visible pour les clients</Label>
                    </FormItem>
                  )}
                />
                
                {/* Only show supplier visibility option for admin users */}
                {userRole === "admin" && (
                  <FormField
                    control={form.control}
                    name="visibleToSupplier"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                            id="visibleToSupplier"
                          />
                        </FormControl>
                        <Label htmlFor="visibleToSupplier">Visible pour les fournisseurs</Label>
                      </FormItem>
                    )}
                  />
                )}
                
                {userRole === "admin" && (
                  <FormField
                    control={form.control}
                    name="visibleToAdmin"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                            id="visibleToAdmin"
                          />
                        </FormControl>
                        <Label htmlFor="visibleToAdmin">Visible pour les administrateurs</Label>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewsFormDialog;
