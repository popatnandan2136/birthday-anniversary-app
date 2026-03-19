// Template mapping based on relation and age category
const templateMap = {
  // Little Sister Templates
  little_sister: [
    'sister-cute-1',
    'sister-princess-2',
    'sister-balloon-3',
  ],

  // Elder Sister Templates
  elder_sister: [
    'sister-elegant-1',
    'sister-memory-2',
    'sister-sparkle-3',
  ],

  // Little Brother Templates
  little_brother: [
    'brother-adventure-1',
    'brother-rocket-2',
    'brother-hero-3',
  ],

  // Elder Brother Templates
  elder_brother: [
    'brother-cool-1',
    'brother-memory-2',
    'brother-strong-3',
  ],

  // Child 0-5 Templates
  child_0_5: [
    'cartoon-baby-1',
    'cartoon-toy-2',
    'cartoon-giggle-3',
  ],

  // Child 5-10 Templates
  child_5_10: [
    'cartoon-fun-1',
    'kids-party-2',
    'cartoon-adventure-3',
  ],

  // Teen Templates
  teen: [
    'modern-neon-1',
    'memory-slideshow-2',
    'modern-cool-3',
  ],

  // Father Templates
  father: [
    'classic-gold-1',
    'family-memory-2',
    'elegant-dark-3',
  ],

  // Mother Templates
  mother: [
    'emotional-love-1',
    'memory-timeline-2',
    'elegant-rose-3',
  ],

  // Friend Templates
  friend: [
    'party-neon-1',
    'funny-moments-2',
    'party-colorful-3',
  ],

  // Son Templates
  son: [
    'proud-parent-1',
    'family-joy-2',
    'memory-timeline-3',
  ],

  // Daughter Templates
  daughter: [
    'proud-parent-1',
    'family-joy-2',
    'memory-timeline-3',
  ],

  // Wife/Anniversary Templates
  wife: [
    'romantic-rose-1',
    'love-story-2',
    'romantic-hearts-3',
  ],

  // Husband/Anniversary Templates
  husband: [
    'romantic-dark-1',
    'memory-journey-2',
    'romantic-evening-3',
  ],
};

// Get templates based on relation and age category
const getTemplatesForRelation = (relation, ageCategory = null) => {
  let key = relation;

  // Add age category suffix if applicable
  if (ageCategory && ['little', 'elder', 'child'].includes(ageCategory)) {
    if (relation === 'sister') {
      key = `${ageCategory}_sister`;
    } else if (relation === 'brother') {
      key = `${ageCategory}_brother`;
    } else if (relation === 'son' || relation === 'daughter') {
      key = 'child';
    }
  }

  // Handle teen category
  if (ageCategory === 'teen' && (relation === 'son' || relation === 'daughter')) {
    key = 'teen';
  }

  return templateMap[key] || [];
};

// Get template design details
const getTemplateDesign = (templateId) => {
  const designs = {
    // Cute Templates
    'sister-cute-1': {
      name: 'Sister Cute 1',
      colors: ['#FFB6C1', '#FFE4E1', '#FFFFFF'],
      features: ['balloons', 'sparkles', 'cartoon-ui'],
      bgColor: '#FFF0F5',
    },
    'sister-princess-2': {
      name: 'Sister Princess 2',
      colors: ['#FFB6DC', '#FFF0F5', '#FFFFFF'],
      features: ['crown', 'stars', 'sparkles'],
      bgColor: '#FFE4F5',
    },
    'sister-balloon-3': {
      name: 'Sister Balloon 3',
      colors: ['#FF69B4', '#FFB6C1', '#FFFFFF'],
      features: ['balloons', 'confetti', 'animation'],
      bgColor: '#FFF0F5',
    },

    // Cartoon Templates
    'cartoon-baby-1': {
      name: 'Cartoon Baby 1',
      colors: ['#FFD700', '#FFA500', '#FFFFFF'],
      features: ['animated-character', 'bright-colors', 'cute-animation'],
      bgColor: '#FFFACD',
    },
    'cartoon-toy-2': {
      name: 'Cartoon Toy 2',
      colors: ['#FF6B9D', '#FFC75F', '#FFFFFF'],
      features: ['toys', 'bright-animation', 'playful'],
      bgColor: '#FFF8DC',
    },
    'cartoon-fun-1': {
      name: 'Cartoon Fun 1',
      colors: ['#00BFFF', '#FFD700', '#FFFFFF'],
      features: ['animated-characters', 'rainbow', 'confetti'],
      bgColor: '#F0FFFF',
    },
    'kids-party-2': {
      name: 'Kids Party 2',
      colors: ['#FF1493', '#00CED1', '#FFD700'],
      features: ['party-hats', 'balloons', 'confetti'],
      bgColor: '#FFFACD',
    },

    // Modern/Teen Templates
    'modern-neon-1': {
      name: 'Modern Neon 1',
      colors: ['#00FF00', '#FF00FF', '#00FFFF'],
      features: ['dark-mode', 'neon-lights', 'photo-slideshow'],
      bgColor: '#000000',
    },
    'memory-slideshow-2': {
      name: 'Memory Slideshow 2',
      colors: ['#1a1a1a', '#FFFFFF', '#FFD700'],
      features: ['photo-transitions', 'music-sync', 'modern-ui'],
      bgColor: '#000000',
    },

    // Elegant Templates
    'classic-gold-1': {
      name: 'Classic Gold 1',
      colors: ['#FFD700', '#FFFFFF', '#1a1a1a'],
      features: ['gold-theme', 'minimal-ui', 'elegant'],
      bgColor: '#FFFFFF',
    },
    'family-memory-2': {
      name: 'Family Memory 2',
      colors: ['#8B4513', '#D2B48C', '#FFFFFF'],
      features: ['memory-timeline', 'photos', 'family-theme'],
      bgColor: '#FAF0E6',
    },

    // Romantic Templates
    'romantic-rose-1': {
      name: 'Romantic Rose 1',
      colors: ['#FF69B4', '#FFFFFF', '#FFB6C1'],
      features: ['heart-animation', 'rose-petals', 'love-quotes'],
      bgColor: '#FFF0F5',
    },
    'love-story-2': {
      name: 'Love Story 2',
      colors: ['#C71585', '#FFFFFF', '#FFB6C1'],
      features: ['timeline', 'photos', 'love-story'],
      bgColor: '#FFF5EE',
    },
    'romantic-dark-1': {
      name: 'Romantic Dark 1',
      colors: ['#8B0000', '#FFFFFF', '#FF1493'],
      features: ['dark-romantic', 'heart-animation', 'love-quotes'],
      bgColor: '#1a1a1a',
    },

    // Party Templates
    'party-neon-1': {
      name: 'Party Neon 1',
      colors: ['#00FF00', '#FF00FF', '#00FFFF'],
      features: ['neon-lights', 'fun-transitions', 'party-vibe'],
      bgColor: '#000000',
    },
    'funny-moments-2': {
      name: 'Funny Moments 2',
      colors: ['#FFD700', '#FF1493', '#00BFFF'],
      features: ['meme-style', 'photo-gallery', 'fun-text'],
      bgColor: '#FFFFFF',
    },
  };

  return designs[templateId] || {
    name: 'Default Template',
    colors: ['#FFFFFF', '#000000'],
    features: ['basic'],
    bgColor: '#FFFFFF',
  };
};

module.exports = {
  templateMap,
  getTemplatesForRelation,
  getTemplateDesign,
};
