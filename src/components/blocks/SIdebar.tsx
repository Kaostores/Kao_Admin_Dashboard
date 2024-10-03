
"use client"

import { useState } from "react"
import pc from "../../assets/ellipse.png"
import { useNavigate, useLocation } from "react-router-dom"
// import { useDispatch } from "react-redux"
// import { toast } from "react-toastify"
// import { logoutUser } from "@/services/reducers"
import { useProfileImage } from '@/pages/Settings/ProfileImageContext'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Home,
  Users,
  Store,
  Wallet,
  Frown,
  Settings,
  // LogOut,
  Plus,
  List,
  Tags,
  Ticket,
  ShoppingCart
} from "lucide-react"


type NavItem = {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  { title: "Home", href: "/app/admin", icon: <Home className="h-5 w-5" /> },
  {
    title: "Users",
    href: "#",
    icon: <Users className="h-5 w-5" />,
    submenu: [
      { title: "Vendors", href: "/app/admin/vendors" },
      { title: "Agents", href: "/app/admin/agents" },
      { title: "Customers", href: "/app/admin/customers" },
    ],
  },
  {
    title: "Categories",
    href: "#",
    icon: <List className="h-5 w-5" />,
    submenu: [
      { title: "Create", href: "/app/admin/create-categories" },
      { title: "Categories", href: "/app/admin/category-lists" },
      { title: "Categories & subs", href: "/app/admin/categories&sub-categories" },
    ],
  },
  {
    title: "Coupon",
    href: "#",
    icon: <Ticket className="h-5 w-5" />,
    submenu: [
      { title: "Create", href: "/app/admin/coupon" },
      { title: "Coupons", href: "/app/admin/coupon-list" },
    ],
  },
  {
    title: "Brand",
    href: "#",
    icon: <Tags className="h-5 w-5" />,
    submenu: [
      { title: "Create", href: "/app/admin/brand" },
      { title: "Brands", href: "/app/admin/brand-list" },
    ],
  },
  { title: "Stores", href: "/app/admin/stores", icon: <Store className="h-5 w-5" /> },
  { title: "Orders", href: "/app/admin/orders", icon: <ShoppingCart className="h-5 w-5" /> },
  { title: "Wallet", href: "/app/admin/wallet", icon: <Wallet className="h-5 w-5" /> },
  { title: "Complaints", href: "/app/admin/complaints", icon: <Frown className="h-5 w-5" /> },
  { title: "Settings", href: "/app/admin/settings", icon: <Settings className="h-5 w-5" /> },
  {
    title: "Spotlight",
    href: "#",
    icon: <Plus className="h-5 w-5" />,
    submenu: [
      { title: "Add spotlight", href: "/app/admin/add-spotlight" },
      { title: "Spotlight by store", href: "/app/admin/spotlight-by-store" },
      { title: "All Spotlights", href: "/app/admin/allspotlight" },
    ],
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  // const dispatch = useDispatch()
  const { profileImage } = useProfileImage()
  const [openAccordions, setOpenAccordions] = useState<string[]>([])

  // const handleLogout = () => {
  //   dispatch(logoutUser())
  //   toast.success("You have logged out successfully", {
  //     autoClose: 3000,
  //     closeButton: true,
  //     onClose: () => {
  //       navigate("/")
  //     },
  //   })
  // }

  const handleAccordionChange = (value: string) => {
    setOpenAccordions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  return (
    <div className="flex h-full w-64 flex-col bg-[#0333ae] text-white pb-[20px]">
      <div className="flex items-center justify-center p-6">
        <div className="mb-[15px] w-[100%] justify-center flex">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden">
            <img src={profileImage || pc} alt='' className='w-[100%] h-[100%] object-cover' />
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <Accordion
          type="multiple"
          value={openAccordions}
          onValueChange={setOpenAccordions}
          className="w-full space-y-2"
        >
          {navItems.map((item, index) => (
            <AccordionItem value={item.title} key={index} className="border-none">
              {item.submenu ? (
                <AccordionTrigger
                  onClick={() => handleAccordionChange(item.title)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white/10",
                    openAccordions.includes(item.title) && "bg-white/10"
                  )}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3 text-sm font-medium hover:text-[#fff] hover:no-underline">{item.title}</span>
                  </div>
                  {/* <ChevronDown className="h-4 w-4 transition-transform duration-200" /> */}
                </AccordionTrigger>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-white/10 hover:text-[#fff] px-3",
                    location.pathname === item.href && "bg-white hover:bg-white hover:text-[#0333ae] text-[#0333ae]"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  {item.icon}
                  <span className="ml-3 text-sm font-medium">{item.title}</span>
                </Button>
              )}
              {item.submenu && (
                <AccordionContent>
                  <div className="ml-6 space-y-1 mt-[8px]">
                    {item.submenu.map((subItem, subIndex) => (
                      <Button
                        key={subIndex}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-white hover:bg-white/10 hover:text-white",
                          location.pathname === subItem.href && "bg-white text-[#0333ae] hover:bg-white hover:text-[#0333ae]"
                        )}
                        onClick={() => navigate(subItem.href)}
                      >
                        <span className="text-xs">{subItem.title}</span>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
      {/* <div className="p-3">
        <Button
          variant="secondary"
          className="w-full bg-white text-[#0333ae] hover:bg-white/90"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div> */}
    </div>
  )
}