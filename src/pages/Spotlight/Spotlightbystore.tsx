/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { GetSpotlightsByStore, GetStoresByStatus } from '@/utils/ApiCalls';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Spotlightbystore = () => {
  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState('');
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await GetStoresByStatus('approved');
        if (response.success) {
          setStores(response.data);
        } else {
          toast.error('Failed to load stores.');
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Failed to fetch stores.');
      }
    };

    fetchStores();
  }, []);

  const fetchSpotlights = async (storeId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await GetSpotlightsByStore(storeId);
      if (response.data.success) {
        setSpotlights(response.data.data);
      } else {
        setSpotlights([]);
        setError('No spotlights found for this store.');
      }
    } catch (error) {
      setError('An error occurred while fetching spotlights.');
      toast.error('Failed to fetch spotlights.');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreChange = (value: string) => {
    setStoreId(value);
    if (value) {
      fetchSpotlights(value);
    }
  };

  return (
    <div className="w-full px-3 mt-6 sm:mt-10">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg">
            Spotlights by Store
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">

            {/* Store Select */}
            <Select value={storeId} onValueChange={handleStoreChange}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Select a store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store: any) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Loading */}
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : error ? (
              /* Error */
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            ) : spotlights.length > 0 ? (
              /* Table */
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">
                        Title
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Description
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Banner
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {spotlights.map((spotlight: any) => (
                      <TableRow key={spotlight.id}>
                        <TableCell className="text-xs sm:text-sm font-medium whitespace-nowrap">
                          {spotlight.title}
                        </TableCell>

                        <TableCell className="text-xs sm:text-sm min-w-[200px]">
                          {spotlight.description}
                        </TableCell>

                        <TableCell>
                          <img
                            src={spotlight.image}
                            alt={spotlight.title}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              /* Empty State */
              <Alert>
                <AlertTitle>No spotlights found</AlertTitle>
                <AlertDescription className="text-sm">
                  There are no spotlights available for this store.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Spotlightbystore;
