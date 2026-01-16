/**
 * Utility functions and constants for responsive background image positioning
 * 
 * These utilities help ensure important image elements remain visible across
 * different screen sizes by adjusting the object-position property.
 */

/**
 * Responsive object-position classes for background images
 * Format: "x% y%" where x is horizontal (0% = left, 100% = right) and y is vertical (0% = top, 100% = bottom)
 */
export const responsiveBackgroundPositions = {
  /**
   * For images with important content on the right side (like CYA image with man on right)
   * Shifts from right-focused on mobile to more centered on larger screens
   * More dramatic shifts for better visibility across screen sizes
   */
  rightFocused: "object-[85%_50%] sm:object-[75%_50%] md:object-[65%_50%] lg:object-[55%_50%] xl:object-[50%_50%] 2xl:object-[45%_50%]",
  
  /**
   * For images with important content on the left side
   * Shifts from left-focused on mobile to more centered on larger screens
   */
  leftFocused: "object-[25%_50%] sm:object-[35%_50%] md:object-[45%_50%] lg:object-[50%_50%] xl:object-[55%_50%]",
  
  /**
   * For images with important content in the center
   * Maintains center focus across all screen sizes
   */
  centerFocused: "object-[50%_50%]",
  
  /**
   * For images with important content at the top
   * Maintains top-center focus across all screen sizes
   */
  topFocused: "object-[50%_30%] sm:object-[50%_25%] md:object-[50%_20%]",
  
  /**
   * For images with important content at the bottom
   * Maintains bottom-center focus across all screen sizes
   */
  bottomFocused: "object-[50%_70%] sm:object-[50%_75%] md:object-[50%_80%]",
} as const;

/**
 * Get responsive background image classes
 * @param position - The position preset to use
 * @param additionalClasses - Any additional classes to apply
 * @returns Combined className string
 */
export function getResponsiveBackgroundClasses(
  position: keyof typeof responsiveBackgroundPositions,
  additionalClasses: string = "object-cover"
): string {
  return `${additionalClasses} ${responsiveBackgroundPositions[position]}`;
}

/**
 * Custom object-position values for specific use cases
 * Use these when the presets don't fit your needs
 */
export const customPositions = {
  // Example: CYA image with man on right, adjusted for very specific layouts
  cyaImage: "object-[85%_50%] sm:object-[75%_50%] md:object-[65%_50%] lg:object-[55%_50%] xl:object-[50%_50%] 2xl:object-[45%_50%]",
} as const;
