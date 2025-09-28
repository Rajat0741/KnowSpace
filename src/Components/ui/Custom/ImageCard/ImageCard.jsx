import React from 'react';
import { Check } from 'lucide-react';
import ImageDropDownMenu from '../ImageDropDownMenu/ImageDropDownMenu';

const ImageCard = ({ 
  image, 
  isSelected = false, 
  onSelect, 
  onDownload, 
  onDoubleClick,
  selectedCount = 0 
}) => {
  if (!image) return null;

  const tags = image.tags.split(',').slice(0, 3); // Only show first 3 tags

  const handleCardClick = (e) => {
    // Don't trigger selection if clicking on dropdown
    if (e.target.closest('[data-dropdown-trigger]')) return;
    onSelect?.(image);
  };

  const handleDoubleClick = (e) => {
    // Don't trigger double-click if clicking on dropdown
    if (e.target.closest('[data-dropdown-trigger]')) return;
    onDoubleClick?.(image);
  };

  const downloadImage = async (image) => {
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

  return (
    <div 
      className={`relative rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-200 hover:shadow-xl border-2 ${
        isSelected ? 'border-primary shadow-primary/20' : 'border-border/50 hover:border-primary/50'
      }`}
      onClick={handleCardClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Image Container */}
      <div className="relative group h-48">
        <img 
          src={image.webformatURL} 
          alt={image.tags} 
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        
        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1 z-10">
            <Check className="h-3 w-3" />
          </div>
        )}
        
        {/* Dropdown Menu */}
        <div 
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          data-dropdown-trigger
        >
          <ImageDropDownMenu
            image={image}
            isSelected={isSelected}
            onSelect={onSelect}
            onDownload={downloadImage}
            selectedCount={selectedCount}
          />
        </div>
        
        {/* Author overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-white text-xs truncate">by {image.user}</p>
          <p className="text-white/80 text-xs mt-1">Double-click to quick select</p>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="inline-block bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
