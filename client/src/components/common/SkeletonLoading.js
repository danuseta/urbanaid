const SkeletonLoading = {
  articleSkeleton() {
    return `
        <div class="animate-pulse">
          <div class="h-48 bg-gray-200 rounded-lg w-full mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      `;
  },

  reportSkeleton() {
    return `
        <div class="animate-pulse">
          <div class="h-24 bg-gray-200 rounded-lg w-full mb-4"></div>
          <div class="flex gap-4 mb-4">
            <div class="h-10 bg-gray-200 rounded w-1/4"></div>
            <div class="h-10 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      `;
  },

  profileSkeleton() {
    return `
        <div class="animate-pulse">
          <div class="h-32 w-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      `;
  },

  heroSkeleton() {
    return `
            <section class="hero-section relative overflow-hidden animate-pulse">
                <div class="container mx-auto px-4">
                    <div class="flex flex-col md:flex-row md:items-center justify-center py-12">
                        <div class="w-full md:w-1/2 md:order-2 flex justify-center">
                            <div class="relative tilt-card max-w-lg w-full">
                                <div class="h-64 md:h-[400px] bg-gray-200 rounded-2xl w-full"></div>
                            </div>
                        </div>
                        
                        <div class="w-full md:w-1/2 text-center md:text-left md:order-1 mt-8 md:mt-0 flex justify-center">
                            <div class="max-w-lg w-full">
                                <div class="h-8 sm:h-10 md:h-12 lg:h-14 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                                
                                <div class="space-y-3 mb-6 md:mb-8">
                                    <div class="h-4 bg-gray-200 rounded w-full"></div>
                                    <div class="h-4 bg-gray-200 rounded w-11/12"></div>
                                    <div class="h-4 bg-gray-200 rounded w-10/12"></div>
                                    <div class="h-4 bg-gray-200 rounded w-9/12"></div>
                                </div>
                                
                                <div class="flex flex-row justify-center md:justify-start space-x-4">
                                    <div class="h-10 bg-gray-200 rounded w-24"></div>
                                    <div class="h-10 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
  }

};

export default SkeletonLoading;