import React from "react";

export const WelcomeLoadingSkeleton = React.memo(() => (
  <div className="text-center py-12">
    <div className="animate-pulse">
      <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-6"></div>
      <div className="h-8 bg-navy-light rounded w-64 mx-auto mb-4"></div>
      <div className="h-4 bg-navy-light rounded w-48 mx-auto"></div>
    </div>
  </div>
));

WelcomeLoadingSkeleton.displayName = "WelcomeLoadingSkeleton";

export const SuggestionsLoadingSkeleton = React.memo(() => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-20 bg-navy-light rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  </div>
));

SuggestionsLoadingSkeleton.displayName = "SuggestionsLoadingSkeleton";

export const ProgressLoadingSkeleton = React.memo(() => (
  <div className="bg-navy-light rounded-lg p-4 mb-6">
    <div className="animate-pulse">
      <div className="h-4 bg-navy rounded w-32 mb-2"></div>
      <div className="h-2 bg-navy rounded w-full mb-2"></div>
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-6 bg-navy rounded w-16"></div>
        ))}
      </div>
    </div>
  </div>
));

ProgressLoadingSkeleton.displayName = "ProgressLoadingSkeleton";