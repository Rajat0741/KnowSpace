import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Drawer } from "vaul";
// Optimized individual icon imports to reduce bundle size
import Globe from "lucide-react/dist/esm/icons/globe";
import Search from "lucide-react/dist/esm/icons/search";
import Filter from "lucide-react/dist/esm/icons/filter";
import X from "lucide-react/dist/esm/icons/x";
import Download from "lucide-react/dist/esm/icons/download";
import InfiniteScroll from 'react-infinite-scroll-component';
import usePixabayInfinite from '@/hooks/usePixabayInfinite';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";
import Button from "@/Components/ui/button";
import ImageCard from "../ImageCard/ImageCard";

// Constants
const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "nature", label: "Nature" },
  { value: "animals", label: "Animals" },
  { value: "business", label: "Business" },
  { value: "computer", label: "Technology" },
  { value: "food", label: "Food" },
  { value: "sports", label: "Sports" },
  { value: "travel", label: "Travel" },
  { value: "buildings", label: "Architecture" }
];

const ORDER_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "latest", label: "Latest" }
];

export default function VaulDrawer({ 
  onImageSelect, 
  triggerContent = null
}) {
  const [searchQuery, setSearchQuery] = useState("nature");
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState("popular");
  const [inputValue, setInputValue] = useState("nature");
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = usePixabayInfinite({ query: searchQuery, category, order });
  

  // Flatten pages into a single images array (memoized)
  const images = useMemo(() => (data ? data.pages.flatMap(p => p.hits) : []), [data]);
  const loading = isLoading;

  // Utility functions
  const resetSearch = useCallback(() => {
    // clear selections and scroll to top when performing a new search
    setSelectedImages(new Set());
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo?.(0, 0);
    }
  }, []);

  const doSearch = useCallback(() => {
    // Apply trimmed input as the active search query
    setSearchQuery((inputValue || '').trim());
  }, [inputValue]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      doSearch();
    }
  }, [doSearch]);

  const clearSelections = useCallback(() => {
    setSelectedImages(new Set());
  }, []);

  // Reset selections when drawer closes
  const handleDrawerClose = useCallback((open) => {
    setIsOpen(open);
    if (!open) {
      // Clear selections when drawer closes
      setSelectedImages(new Set());
    }
  }, []);

  // images is our single source of truth derived from react-query pages

  // Reset when search query changes
  useEffect(() => {
    resetSearch();
  }, [searchQuery, order, category, resetSearch]);

  // default search is initialized to 'nature' via initial state

  // Using InfiniteScroll component for pagination; loadMore triggers fetchNextPage
  const loadMore = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const toggleImageSelection = (image) => {
    setSelectedImages(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(image.id)) {
        newSelected.delete(image.id);
      } else {
        newSelected.add(image.id);
      }
      return newSelected;
    });
  };

  // Enhanced download function with blob support
  const downloadImage = async (image) => {
    try {
      const imageUrl = image.largeImageURL || image.webformatURL;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${image.tags.split(',')[0]?.trim() || 'image'}-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback method
      const link = document.createElement('a');
      link.href = image.largeImageURL || image.webformatURL;
      link.download = `${image.tags.split(',')[0]?.trim() || 'image'}-${image.id}.jpg`;
      link.target = '_blank';
      link.click();
    }
  };

  // Download multiple selected images
  const downloadSelected = async () => {
  const selectedImageObjects = images.filter(img => selectedImages.has(img.id));
    
    for (const image of selectedImageObjects) {
      await downloadImage(image);
      // Small delay between downloads to prevent browser blocking
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  // Select primary image and close drawer
  const selectPrimaryImage = () => {
    if (selectedImages.size >= 1) {
  const selectedImageObjects = images.filter(img => selectedImages.has(img.id));
      if (selectedImages.size === 1) {
        onImageSelect?.(selectedImageObjects[0]); // Single image
      } else {
        onImageSelect?.(selectedImageObjects); // Multiple images array
      }
      setIsOpen(false);
    }
  };

  // Quick select on double-click
  const handleDoubleClickImage = (image) => {
    onImageSelect?.(image);
    setIsOpen(false);
  };

  return (
    <Drawer.Root direction="right" open={isOpen} onOpenChange={handleDrawerClose}>
      <Drawer.Trigger className="flex items-center justify-center w-full h-12 border-2 border-dashed border-border/50 rounded-lg cursor-pointer bg-gradient-to-br from-background/50 via-background/30 to-background/20 hover:from-background/60 hover:via-background/40 hover:to-background/30 transition-all duration-300 group/pixabay backdrop-blur-sm">
        {triggerContent || (
          <>
            <Globe className="w-5 h-5 text-muted-foreground group-hover/pixabay:text-primary transition-colors mr-2" />
            <span className="text-sm text-muted-foreground group-hover/pixabay:text-foreground transition-colors">
              Pixabay
            </span>
          </>
        )}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]" />
        <Drawer.Content
          className="right-0 top-0 bottom-0 fixed z-[10000] outline-none w-[90vw] flex"
          style={{ '--initial-transform': 'calc(100% + 8px)' }}
        >
          <div className="bg-card h-full w-full flex flex-col border-l border-border shadow-2xl shadow-black/50">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-border bg-card/95 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <Drawer.Title className="font-semibold text-foreground text-lg">
                      Choose Image from Pixabay
                    </Drawer.Title>
                    <Drawer.Close asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </Drawer.Close>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Drawer.Description className="text-muted-foreground text-xs">
                      Search and select images
                    </Drawer.Description>
                    <span className="text-xs text-primary">
                      • 💡 Double-click to quick select
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Search and Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for images..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {CATEGORIES.find(c => c.value === category)?.label || "All Categories"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 z-[10001]">
                      {CATEGORIES.map((cat) => (
                        <DropdownMenuItem
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          className={category === cat.value ? "bg-accent" : ""}
                        >
                          {cat.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        {ORDER_OPTIONS.find(o => o.value === order)?.label || "Popular"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="z-[10001]">
                      {ORDER_OPTIONS.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => setOrder(option.value)}
                          className={order === option.value ? "bg-accent" : ""}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="flex items-center">
                    <Button variant="primary" size="sm" onClick={doSearch} className="ml-2">Search</Button>
                  </div>
                </div>

                {/* Selection Status */}
                {selectedImages.size > 0 && (
                  <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <span className="text-sm text-primary font-medium">
                      {selectedImages.size} image{selectedImages.size !== 1 ? 's' : ''} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelections}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div 
              ref={scrollContainerRef}
              id="pixabay-scrollable"
              className="flex-1 overflow-y-auto p-6 pt-0"
            >
              {error && (
                <div className="text-center py-8">
                  <p className="text-destructive">Error: {error}</p>
                </div>
              )}
              
              {!error && (
                <>
                  <InfiniteScroll
                    dataLength={images.length}
                    next={loadMore}
                    hasMore={Boolean(hasNextPage)}
                    loader={isFetchingNextPage ? (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-muted-foreground">Loading more images...</span>
                        </div>
                      </div>
                    ) : null}
                    scrollableTarget="pixabay-scrollable"
                    style={{ overflow: 'visible' }}
                    endMessage={null}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      {images.map((image, index) => (
                        <ImageCard
                          key={`${image.id}-${index}`}
                          image={image}
                          isSelected={selectedImages.has(image.id)}
                          onSelect={toggleImageSelection}
                          onDownload={downloadImage}
                          onDoubleClick={handleDoubleClickImage}
                          selectedCount={selectedImages.size}
                        />
                      ))}
                    </div>
                  </InfiniteScroll>

                  {loading && (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-muted-foreground">Loading images...</span>
                      </div>
                    </div>
                  )}
                  
                  {!loading && images.length === 0 && searchQuery && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No images found for "{searchQuery}"</p>
                      <p className="text-sm text-muted-foreground mt-2">Try different keywords</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-6 border-t border-border bg-card/95 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedImages.size === 0 && 'No images selected'}
                  {selectedImages.size === 1 && 'One image selected'}
                  {selectedImages.size > 1 && `${selectedImages.size} images selected`}
                </div>
                <div className="flex gap-3">
                  <Drawer.Close asChild>
                    <Button variant="outline">Cancel</Button>
                  </Drawer.Close>
                  {selectedImages.size > 0 && (
                    <Button variant="secondary" onClick={downloadSelected}>
                      <Download className="h-4 w-4 mr-2" />
                      Download {selectedImages.size > 1 ? 'All' : ''}
                    </Button>
                  )}
                  <Button
                    disabled={selectedImages.size === 0 || selectedImages.size > 1}
                    onClick={selectPrimaryImage}
                  >
                    Select Image
                    {selectedImages.size > 1 && ' (Select one only)'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}