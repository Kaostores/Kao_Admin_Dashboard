"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent  } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAddCurrencyMutation, useGetCurrenciesQuery, useUpdateCurrencyMutation, useDeleteCurrencyMutation } from '@/services/apiSlice'

interface Currency {
  id: number
  currency: string
  name: string
  symbol: string
  country: string
  exchange_rate: number
  base_currency: string
}

const Currency = () => {
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [addCurrency] = useAddCurrencyMutation()
  const [updateCurrency] = useUpdateCurrencyMutation();
  const [deleteCurrency] = useDeleteCurrencyMutation()
  const [currentPage, setCurrentPage] = useState(1);
  const currenciesPerPage = 5;

  const { data, isLoading, isError, error } = useGetCurrenciesQuery({});

  const currencies = data?.data || [];
  console.log("This is currencies", currencies)

  const currenciesArray = Array.isArray(currencies) ? currencies : []

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const indexOfLastCurrency = currentPage * currenciesPerPage;
  const indexOfFirstCurrency = indexOfLastCurrency - currenciesPerPage;
  const currentCurrencies = currenciesArray.slice(indexOfFirstCurrency, indexOfLastCurrency);

  const handleAddCurrency = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    const newCurrency = {
      currency: formData.get('currency') as string,
      name: formData.get('name') as string,
      symbol: formData.get('symbol') as string,
      country: formData.get('country') as string,
      exchange_rate: Number(formData.get('exchange_rate')),
      base_currency: formData.get('base_currency') as string,
    }

    try {
      await addCurrency(newCurrency).unwrap()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Failed to add currency:', error)
    }
  }

  const handleUpdateCurrency = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCurrency) return;
  
    const formData = new FormData(event.currentTarget);
    const updatedCurrency = {
      currency_uuid: editingCurrency.id,
      currency: formData.get('currency') as string,
      name: formData.get('name') as string,
      symbol: formData.get('symbol') as string,
      country: formData.get('country') as string,
      exchange_rate: Number(formData.get('exchange_rate')),
      base_currency: formData.get('base_currency') as string,
    };
  
    try {
      await updateCurrency(updatedCurrency).unwrap();
      setIsEditDialogOpen(false);
      setEditingCurrency(null);
    } catch (error) {
      console.error('Failed to update currency:', error);
    }
  };

  const handleDeleteCurrency = async (currencyCode: string) => {
    try {
      await deleteCurrency(currencyCode).unwrap();
      console.log("Currency deleted")
    } catch (error) {
      console.error('Failed to delete currency:', error);
    }
  };

  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-8 w-[80px]" /></TableCell>
    </TableRow>
  )

  if (isError) {
    console.error('Failed to load currencies:', error)
    return <div>Failed to load currencies. Check the console for details.</div>
  }

  // const formatCurrency = (amount: any, currencyCode: any) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: currencyCode,
  //   }).format(amount);
  // }

  return (
    <div className="container mx-auto p-6">
      <Card className='pt-[40px]'>
        <CardContent>
          <div className="mb-4 w-[100%] justify-end flex">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className='bg-[#0333AE] hover:bg-[#0333AE]'>
                  <Plus className="mr-2 h-4 w-4"/> Add currency
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add new currency</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCurrency} className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" name="currency" required />
                  </div>
                  <div>
                    <Label htmlFor="name">Currency name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input id="symbol" name="symbol" required />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" required />
                  </div>
                  <div>
                    <Label htmlFor="exchange_rate">Exchange rate</Label>
                    <Input id="exchange_rate" name="exchange_rate" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="base_currency">Base currency</Label>
                    <Input id="base_currency" name="base_currency" required />
                  </div>
                  <Button type="submit" className="bg-[#0333AE] hover:bg-[#0333AE]">Add currency</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Exchange rate</TableHead>
                <TableHead>Base currency</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : currentCurrencies.map((currency: Currency) => (
                <TableRow key={currency.id}>
                  <TableCell>{currency.currency}</TableCell>
                  <TableCell>{currency.name}</TableCell>
                  <TableCell>{currency.symbol}</TableCell>
                  <TableCell>{currency.country}</TableCell>
                  <TableCell>{currency.exchange_rate}</TableCell>
                  <TableCell>{currency.base_currency}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setEditingCurrency(currency)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit currency</DialogTitle>
                          </DialogHeader>
                          {editingCurrency && (
                            <form onSubmit={handleUpdateCurrency} className="space-y-4">
                              <div>
                                <Label htmlFor="edit-currency">Currency code</Label>
                                <Input id="edit-currency" name="currency" defaultValue={editingCurrency.currency} required />
                              </div>
                              <div>
                                <Label htmlFor="edit-name">Currency name</Label>
                                <Input id="edit-name" name="name" defaultValue={editingCurrency.name} required />
                              </div>
                              <div>
                                <Label htmlFor="edit-symbol">Symbol</Label>
                                <Input id="edit-symbol" name="symbol" defaultValue={editingCurrency.symbol} required />
                              </div>
                              <div>
                                <Label htmlFor="edit-country">Country</Label>
                                <Input id="edit-country" name="country" defaultValue={editingCurrency.country} required />
                              </div>
                              <div>
                                <Label htmlFor="edit-exchange_rate">Exchange rate</Label>
                                <Input id="edit-exchange_rate" name="exchange_rate" type="number" step="0.01" defaultValue={editingCurrency.exchange_rate} required />
                              </div>
                              <div>
                                <Label htmlFor="edit-base_currency">Base currency</Label>
                                <Input id="edit-base_currency" name="base_currency" defaultValue={editingCurrency.base_currency} required />
                              </div>
                              <Button type="submit" className='bg-[#0333AE] hover:bg-[#0333AE]'>Update currency</Button>
                            </form>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteCurrency(currency.currency)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!isLoading && (
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {Math.ceil(currencies.length / currenciesPerPage)}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(currencies.length / currenciesPerPage)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Currency