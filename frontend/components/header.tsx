"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Menu, Globe, Sun, Moon, User, Phone } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { user, logout } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyPhoneToClipboard = () => {
    const phoneNumber = "+7 (123) 456-7890"
    navigator.clipboard.writeText(phoneNumber).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
      <div className="container mx-auto px-4">
        {/* Top bar with languages, contact, search and login */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-sm">
                  <Globe className="h-4 w-4" />
                  {language === "kk" ? "KZ" : language === "ru" ? "RU" : "EN"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="z-50">
                <DropdownMenuItem onClick={() => setLanguage("kk")}>
                  Қазақша {language === "kk" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ru")}>
                  Русский {language === "ru" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  English {language === "en" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden md:flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-sm flex items-center"
                onClick={copyPhoneToClipboard}
                title={t("copy_to_clipboard")}
              >
                <Phone className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                <span>+7 (123) 456-7890</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isSearchOpen ? (
              <div className="relative">
                <Input
                  placeholder={t("search")}
                  className="w-[200px] md:w-[300px] h-8 text-sm"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-8 w-8"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-4 w-4" />
                <span className="sr-only">{t("search")}</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">{t("toggle_theme")}</span>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{t("my_account")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-50">
                  <DropdownMenuItem>
                    <Link href="/account">{t("my_account")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/account/applications">{t("my_applications")}</Link>
                  </DropdownMenuItem>
                  {(user.role === "admin" || user.role === "moderator") && (
                    <DropdownMenuItem>
                      <Link href="/admin">{t("admin_panel")}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>{t("logout")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" className="h-8" asChild>
                <Link href="/login">{t("login")}</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Main header with logo and navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-12 w-12">
                <Image src="/logo.svg?height=48&width=48" alt="Logo" width={48} height={48} />
              </div>
              <div>
                <div className="font-bold text-xl text-blue-600 dark:text-blue-400">{t("education_center")}</div>
                <div className="text-xs text-muted-foreground">{t("center_subtitle")}</div>
              </div>
            </Link>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t("toggle_menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="px-2 py-6">
                <Link href="/" className="flex items-center mb-6">
                  <span className="text-xl font-bold">{t("education_center")}</span>
                </Link>
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="py-2 hover:text-primary">
                    {t("home")}
                  </Link>
                  <Link href="/about" className="py-2 hover:text-primary">
                    {t("about_center")}
                  </Link>
                  <Link href="/recognition" className="py-2 hover:text-primary">
                    {t("recognition")}
                  </Link>
                  <Link href="/accreditation" className="py-2 hover:text-primary">
                    {t("accreditation")}
                  </Link>
                  <Link href="/bologna" className="py-2 hover:text-primary">
                    {t("bologna")}
                  </Link>
                  <Link href="/news" className="py-2 hover:text-primary">
                    {t("news")}
                  </Link>
                  <Link href="/contact" className="py-2 hover:text-primary">
                    {t("contact")}
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>{t("home")}</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {t("about_center")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t("recognition")}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/recognition"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">{t("recognition_services")}</div>
                          <p className="text-sm leading-tight text-muted-foreground">{t("recognition_description")}</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/recognition/types" title={t("types_of_recognition")}>
                      {t("types_description")}
                    </ListItem>
                    <ListItem href="/recognition/application" title={t("application_process")}>
                      {t("application_process_description")}
                    </ListItem>
                    <ListItem href="/recognition/calculator" title={t("cost_calculator")}>
                      {t("calculator_description")}
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/accreditation" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>{t("accreditation")}</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/bologna" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>{t("bologna")}</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/news" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>{t("news")}</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>{t("contact")}</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* Toast notification for copied phone number */}
      {copied && <div className="toast-notification">{t("copied")}</div>}
    </header>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
