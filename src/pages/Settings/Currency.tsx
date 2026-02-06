"use client"

import React from "react"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
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

  return (
    <div className="container mx-auto w-full px-2 py-3">
      <Card className="pt-3 sm:pt-[40px]">
        <CardContent>

          {/* Add Button */}
          <div className="mb-4 w-full flex justify-end">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0333AE] hover:bg-[#0333AE] text-xs sm:text-sm w-full sm:w-auto">
                  <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Add currency
                </Button>
              </DialogTrigger>

              <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add new currency</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAddCurrency} className="space-y-3 sm:space-y-4">
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

                  <Button type="submit" className="bg-[#0333AE] hover:bg-[#0333AE] w-full sm:w-auto">
                    Add currency
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Code</TableHead>
                  <TableHead className="text-xs sm:text-sm">Name</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Symbol</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Country</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Exchange rate</TableHead>
                  <TableHead className="text-xs sm:text-sm">Base currency</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
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
                    <TableCell className="text-xs sm:text-sm">{currency.currency}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{currency.name}</TableCell>
                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{currency.symbol}</TableCell>
                    <TableCell className="text-xs sm:text-sm hidden md:table-cell">{currency.country}</TableCell>
                    <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{currency.exchange_rate}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{currency.base_currency}</TableCell>

                    <TableCell>
                      <div className="flex gap-1 sm:gap-2 flex-wrap">

                        {/* Edit */}
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 sm:h-10 sm:w-10"
                              onClick={() => setEditingCurrency(currency)}
                            >
                              <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit currency</DialogTitle>
                            </DialogHeader>

                            {editingCurrency && (
                              <form onSubmit={handleUpdateCurrency} className="space-y-3 sm:space-y-4">

                                <div>
                                  <Label>Currency code</Label>
                                  <Input name="currency" defaultValue={editingCurrency.currency} required />
                                </div>

                                <div>
                                  <Label>Currency name</Label>
                                  <Input name="name" defaultValue={editingCurrency.name} required />
                                </div>

                                <div>
                                  <Label>Symbol</Label>
                                  <Input name="symbol" defaultValue={editingCurrency.symbol} required />
                                </div>

                                <div>
                                  <Label>Country</Label>
                                  <Input name="country" defaultValue={editingCurrency.country} required />
                                </div>

                                <div>
                                  <Label>Exchange rate</Label>
                                  <Input name="exchange_rate" type="number" step="0.01" defaultValue={editingCurrency.exchange_rate} required />
                                </div>

                                <div>
                                  <Label>Base currency</Label>
                                  <Input name="base_currency" defaultValue={editingCurrency.base_currency} required />
                                </div>

                                <Button type="submit" className="bg-[#0333AE] hover:bg-[#0333AE] w-full sm:w-auto">
                                  Update currency
                                </Button>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* Delete */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 sm:h-10 sm:w-10"
                          onClick={() => handleDeleteCurrency(currency.currency)}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!isLoading && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-xs sm:text-sm">

              <div className="text-muted-foreground text-center sm:text-left">
                Page {currentPage} of {Math.ceil(currencies.length / currenciesPerPage)}
              </div>

              <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-xs sm:text-sm"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(currencies.length / currenciesPerPage)}
                  className="text-xs sm:text-sm"
                >
                  Next
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
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
