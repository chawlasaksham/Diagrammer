import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const FeaturedCarousel = ({ templates, onTemplateClick, onUseTemplate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % templates.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (templates.length === 0) return null;

  const currentTemplate = templates[currentIndex];

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Star" size={20} className="text-warning" />
          <h2 className="text-lg font-heading-medium text-text-primary">
            Featured Templates
          </h2>
        </div>
      </div>

      <div className="relative">
        {/* Main Carousel Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Section */}
          <div className="relative h-64 lg:h-80 overflow-hidden">
            <Image
              src={currentTemplate.image}
              alt={currentTemplate.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Navigation Arrows */}
            {templates.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-micro"
                >
                  <Icon name="ChevronLeft" size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-micro"
                >
                  <Icon name="ChevronRight" size={20} />
                </button>
              </>
            )}

            {/* Slide Indicators */}
            {templates.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {templates.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-micro ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 text-xs font-body-medium bg-accent text-white rounded-full">
                  Featured
                </span>
                <span className={`px-2 py-1 text-xs font-body-medium rounded-full ${
                  currentTemplate.complexity === 'beginner' ? 'bg-success-50 text-success' :
                  currentTemplate.complexity === 'intermediate'? 'bg-warning-50 text-warning' : 'bg-error-50 text-error'
                }`}>
                  {currentTemplate.complexity}
                </span>
              </div>
              <h3 className="text-xl font-heading-semibold text-text-primary mb-2">
                {currentTemplate.title}
              </h3>
              <p className="text-text-secondary">
                {currentTemplate.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 mb-4 text-sm text-text-tertiary">
              <div className="flex items-center space-x-1">
                <Icon name="Download" size={14} />
                <span>{currentTemplate.usageCount.toLocaleString()} uses</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} className="text-warning" />
                <span>{currentTemplate.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{currentTemplate.estimatedTime}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {currentTemplate.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-secondary-100 text-text-secondary rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Integrations Preview */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Zap" size={14} className="text-text-tertiary" />
                <span className="text-xs text-text-tertiary">Integrations:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {currentTemplate.integrations.slice(0, 3).map((integration, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-primary-50 text-primary rounded-md"
                  >
                    {integration}
                  </span>
                ))}
                {currentTemplate.integrations.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-primary-50 text-primary rounded-md">
                    +{currentTemplate.integrations.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => onTemplateClick(currentTemplate)}
                className="flex-1 px-4 py-2 bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-micro"
              >
                Preview
              </button>
              <button
                onClick={() => onUseTemplate(currentTemplate)}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-micro"
              >
                Use Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;