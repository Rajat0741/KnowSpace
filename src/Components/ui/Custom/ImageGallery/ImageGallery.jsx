import React, { useState } from 'react';
import ImageCard from '../ImageCard/ImageCard';
import Button from "@/Components/ui/button";
import { Download } from 'lucide-react';

const ImageGallery = ({ images = [] }) => {
  const [selectedImages, setSelectedImages] = useState(new Set());

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

  const downloadImage = (image) => {
    console.log('Downloaded:', image.tags.split(',')[0]);
  };

  const downloadSelected = () => {
    const selectedImageObjects = images.filter(img => selectedImages.has(img.id));
    selectedImageObjects.forEach(image => {
      const link = document.createElement('a');
      link.href = image.largeImageURL || image.webformatURL;
      link.download = `${image.tags.split(',')[0]?.trim() || 'image'}-${image.id}.jpg`;
      link.click();
    });
    console.log(`Downloaded ${selectedImageObjects.length} images`);
  };

  const toggleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.id)));
    }
  };

  if (!images.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No images to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selection Controls */}
      <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {selectedImages.size} of {images.length} selected
          </span>
          <Button variant="outline" size="sm" onClick={toggleSelectAll}>
            {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
          </Button>
          {selectedImages.size > 0 && (
            <Button variant="outline" size="sm" onClick={() => setSelectedImages(new Set())}>
              Clear
            </Button>
          )}
        </div>
        
        {selectedImages.size > 0 && (
          <Button onClick={downloadSelected} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download ({selectedImages.size})
          </Button>
        )}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            isSelected={selectedImages.has(image.id)}
            onSelect={toggleImageSelection}
            onDownload={downloadImage}
            selectedCount={selectedImages.size}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
