import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { Link, useLocation } from "wouter";

export function Header() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 cursor-pointer">
                <h1 className="text-2xl font-bold text-primary flex items-center">
                  <Store className="mr-2" size={28} />
                  StreetSupply
                </h1>
                <p className="text-xs text-muted-foreground font-medium">स्ट्रीट सप्लाई</p>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button 
                variant="ghost" 
                className={`text-muted-foreground hover:text-primary ${
                  isActive('/') ? 'text-primary bg-primary/10' : ''
                }`}
              >
                Home
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                variant="ghost" 
                className={`text-muted-foreground hover:text-primary ${
                  isActive('/about') ? 'text-primary bg-primary/10' : ''
                }`}
              >
                About
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button 
                variant="ghost" 
                className={`text-muted-foreground hover:text-primary ${
                  isActive('/how-it-works') ? 'text-primary bg-primary/10' : ''
                }`}
              >
                How it Works
              </Button>
            </Link>

            <Link href="/support">
              <Button 
                variant="ghost" 
                className={`text-muted-foreground hover:text-primary ${
                  isActive('/support') ? 'text-primary bg-primary/10' : ''
                }`}
              >
                Support
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Login
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}