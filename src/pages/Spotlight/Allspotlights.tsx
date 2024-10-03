"use client"

import { useEffect, useState } from 'react'
import { GetAllPosters, UpdatePosterInfo, UpdatePosterImage, DeletePoster } from '@/utils/ApiCalls'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

interface Poster {
  id: string
  title: string
  description: string
  store?: { name: string }
  image: string
}

export default function AllSpotlights() {
  const [posters, setPosters] = useState<Poster[]>([])
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [banner, setBanner] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [postersPerPage] = useState(5)

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const { data } = await GetAllPosters()
        if (data.success) {
          setPosters(data.data)
        } else {
          console.log('Failed to load posters.')
        }
      } catch (error) {
        toast.error('Failed to fetch posters.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosters()
  }, [])

  const handlePosterUpdate = async () => {
    if (selectedPoster) {
      try {
        const body = { title, description }
        await UpdatePosterInfo(selectedPoster.id, body)

        setPosters(
          posters.map((p: Poster) =>
            p.id === selectedPoster.id ? { ...p, title, description } : p
          )
        )
        toast.success('Poster updated successfully.')
        closeModal()
      } catch (error) {
        toast.error('Failed to update poster info.')
      }
    }
  }

  const handleBannerUpdate = async () => {
    if (selectedPoster && banner) {
      const formData = new FormData()
      formData.append('image', banner)

      try {
        await UpdatePosterImage(selectedPoster.id, formData)
        toast.success('Poster banner updated successfully.')

        setPosters(
          posters.map((p: Poster) =>
            p.id === selectedPoster.id
              ? { ...p, image: URL.createObjectURL(banner) }
              : p
          )
        )

        closeModal()
      } catch (error) {
        toast.error('Failed to update poster banner.')
      }
    }
  }

  const handlePosterDelete = async (posterId: string) => {
    try {
      await DeletePoster(posterId)
      setPosters(posters.filter((p: Poster) => p.id !== posterId))
      toast.success('Poster deleted successfully.')
    } catch (error) {
      toast.error('Failed to delete poster.')
    }
  }

  const openModal = (poster: Poster) => {
    setSelectedPoster(poster)
    setTitle(poster.title)
    setDescription(poster.description)
    setBanner(null)
    setBannerPreview(poster.image)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPoster(null)
    setTitle('')
    setDescription('')
    setBanner(null)
    setBannerPreview(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBanner(e.target.files[0])
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  // Pagination logic
  const indexOfLastPoster = currentPage * postersPerPage
  const indexOfFirstPoster = indexOfLastPoster - postersPerPage
  const currentPosters = posters.slice(indexOfFirstPoster, indexOfLastPoster)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[300px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-20 w-20" /></TableCell>
      <TableCell><Skeleton className="h-10 w-20" /></TableCell>
    </TableRow>
  )

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">All spotlights</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Banner</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : (
              currentPosters.map((poster: Poster) => (
                <TableRow key={poster.id}>
                  <TableCell className="font-medium">{poster.title}</TableCell>
                  <TableCell>{poster.description}</TableCell>
                  <TableCell>{poster.store?.name}</TableCell>
                  <TableCell>
                    <img src={poster.image} alt={poster.title} className="w-20 h-20 object-cover rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => openModal(poster)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handlePosterDelete(poster.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.ceil(posters.length / postersPerPage)}
          </div>
          <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(posters.length / postersPerPage)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
          </div>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Poster</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="banner" className="text-right">
                Banner
              </Label>
              <div className="col-span-3">
                <Input
                  id="banner"
                  type="file"
                  onChange={handleFileChange}
                />
                {bannerPreview && (
                  <div className="mt-2">
                    <img
                      src={bannerPreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button className='bg-[#0333AE] hover:bg-[#0333AE]' onClick={handlePosterUpdate}>Update info</Button>
            <Button className='bg-[#0333AE] hover:bg-[#0333AE]' onClick={handleBannerUpdate}>Update banner</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}