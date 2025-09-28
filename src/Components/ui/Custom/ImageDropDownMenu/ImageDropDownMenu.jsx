import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
// Optimized individual icon imports to reduce bundle size
import MoreVertical from "lucide-react/dist/esm/icons/more-vertical";
import Check from "lucide-react/dist/esm/icons/check";
import Download from "lucide-react/dist/esm/icons/download";
import Button from "@/Components/ui/button";

const ImageDropDownMenu = ({ 
  image, 
  isSelected = false, 
  onSelect, 
  onDownload, 
  selectedCount = 0 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = async (image) => {
    try {
      // Force download instead of opening in browser
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
      
      onDownload?.(image);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link method
      const link = document.createElement('a');
      link.href = image.largeImageURL || image.webformatURL;
      link.download = `${image.tags.split(',')[0]?.trim() || 'image'}-${image.id}.jpg`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    }
  };

  // Dropdown options configuration array
  const dropdownOptions = [
    {
      id: 'select',
      label: isSelected ? 'Deselect' : 'Select',
      icon: Check,
      action: () => {
        onSelect?.(image);
        setIsOpen(false); // Close dropdown after action
      },
      disabled: selectedCount > 1 && !isSelected,
      className: isSelected ? "bg-accent" : ""
    },
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      action: () => {
        handleDownload(image);
        setIsOpen(false); // Close dropdown after action
      },
      disabled: false,
      className: ""
    }
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-background/90 backdrop-blur-sm hover:bg-background"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="z-[10001]"
        sideOffset={5}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {dropdownOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <DropdownMenuItem 
              key={option.id}
              onClick={(e) => {
                e.stopPropagation();
                option.action();
              }}
              disabled={option.disabled}
              className={option.className}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ImageDropDownMenu;