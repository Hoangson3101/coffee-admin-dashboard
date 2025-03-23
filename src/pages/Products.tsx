
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductsTable from '@/components/products/ProductsTable';
import PageTransition from '@/components/ui/PageTransition';

const Products = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
        
        <ProductsTable />
      </div>
    </PageTransition>
  );
};

export default Products;
