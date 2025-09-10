const ANIMATION_VARIANTS = {
  FADE_IN_UP: {
    initial: {
      opacity: 0,
      transform: 'translateY(40px)',
    },
    animate: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
    exit: {
      opacity: 0,
      transform: 'translateY(40px)',
    },
  },
  FADE_IN_DOWN: {
    initial: {
      opacity: 0,
      transform: 'translateY(-40px)',
    },
    animate: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
    exit: {
      opacity: 0,
      transform: 'translateY(-40px)',
    },
  },
} as const;

export default ANIMATION_VARIANTS;
