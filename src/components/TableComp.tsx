import { useEffect, useState } from 'react';
import { getTopStores } from '@/utils/ApiCalls';
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const TableComp = () => {
  const [topStores, setTopStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopStores = async () => {
      try {
        const response = await getTopStores();
        setTopStores(response?.data || []);
      } catch (error) {
        setError('Failed to fetch top stores.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStores();
  }, []);

  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
    </TableRow>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Total Orders</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : topStores.length > 0 ? (
            topStores.map((store: any) => (
              <TableRow key={store._id}>
                <TableCell className="font-medium">{store.storeDetails.name}</TableCell>
                <TableCell>{store.storeDetails.category}</TableCell>
                <TableCell>{store.totalOrders}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No top selling store
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComp;