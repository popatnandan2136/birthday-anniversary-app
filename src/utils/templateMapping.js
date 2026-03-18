// Birthday template mapping based on relation and age group
export const BIRTHDAY_TEMPLATE_MAP = {
  // Little Sister templates
  little_sister: [
    { id: 'sister-cute-1', label: 'Sister Cute 1', component: 'SisterCuteTemplate1' },
    { id: 'sister-cute-2', label: 'Sister Cute 2', component: 'SisterCuteTemplate2' },
    { id: 'sister-cute-3', label: 'Sister Cute 3', component: 'SisterCuteTemplate3' },
  ],
  // Elder Sister templates
  elder_sister: [
    { id: 'sister-elegant-1', label: 'Sister Elegant 1', component: 'SisterElegantTemplate1' },
    { id: 'sister-elegant-2', label: 'Sister Elegant 2', component: 'SisterElegantTemplate2' },
  ],
  // Little Brother templates
  little_brother: [
    { id: 'brother-fun-1', label: 'Brother Fun 1', component: 'BrotherFunTemplate1' },
    { id: 'brother-fun-2', label: 'Brother Fun 2', component: 'BrotherFunTemplate2' },
    { id: 'brother-fun-3', label: 'Brother Fun 3', component: 'BrotherFunTemplate3' },
  ],
  // Elder Brother templates
  elder_brother: [
    { id: 'brother-cool-1', label: 'Brother Cool 1', component: 'BrotherCoolTemplate1' },
    { id: 'brother-cool-2', label: 'Brother Cool 2', component: 'BrotherCoolTemplate2' },
  ],
  // Son templates - age-based
  son_0_5: [
    { id: 'cartoon-baby-1', label: 'Baby Cartoon 1', component: 'CartoonBabyTemplate1' },
    { id: 'cartoon-baby-2', label: 'Baby Cartoon 2', component: 'CartoonBabyTemplate2' },
  ],
  son_5_10: [
    { id: 'cartoon-kids-1', label: 'Kids Cartoon 1', component: 'CartoonKidsTemplate1' },
    { id: 'cartoon-kids-2', label: 'Kids Cartoon 2', component: 'CartoonKidsTemplate2' },
  ],
  son_10_15: [
    { id: 'teen-modern-1', label: 'Teen Modern 1', component: 'TeenModernTemplate1' },
    { id: 'teen-modern-2', label: 'Teen Modern 2', component: 'TeenModernTemplate2' },
  ],
  son_15_18: [
    { id: 'teen-cool-1', label: 'Teen Cool 1', component: 'TeenCoolTemplate1' },
    { id: 'teen-cool-2', label: 'Teen Cool 2', component: 'TeenCoolTemplate2' },
  ],
  son_18: [
    { id: 'adult-modern-1', label: 'Adult Modern 1', component: 'AdultModernTemplate1' },
    { id: 'adult-modern-2', label: 'Adult Modern 2', component: 'AdultModernTemplate2' },
  ],
  // Daughter templates - age-based
  daughter_0_5: [
    { id: 'cartoon-baby-girl-1', label: 'Baby Girl Cartoon 1', component: 'CartoonBabyGirlTemplate1' },
    { id: 'cartoon-baby-girl-2', label: 'Baby Girl Cartoon 2', component: 'CartoonBabyGirlTemplate2' },
  ],
  daughter_5_10: [
    { id: 'cartoon-kids-girl-1', label: 'Kids Girl Cartoon 1', component: 'CartoonKidsGirlTemplate1' },
    { id: 'cartoon-kids-girl-2', label: 'Kids Girl Cartoon 2', component: 'CartoonKidsGirlTemplate2' },
  ],
  daughter_10_15: [
    { id: 'teen-pink-1', label: 'Teen Pink 1', component: 'TeenPinkTemplate1' },
    { id: 'teen-pink-2', label: 'Teen Pink 2', component: 'TeenPinkTemplate2' },
  ],
  daughter_15_18: [
    { id: 'teen-princess-1', label: 'Teen Princess 1', component: 'TeenPrincessTemplate1' },
    { id: 'teen-princess-2', label: 'Teen Princess 2', component: 'TeenPrincessTemplate2' },
  ],
  daughter_18: [
    { id: 'adult-elegant-1', label: 'Adult Elegant 1', component: 'AdultElegantTemplate1' },
    { id: 'adult-elegant-2', label: 'Adult Elegant 2', component: 'AdultElegantTemplate2' },
  ],
  // Father templates
  father: [
    { id: 'father-classic-1', label: 'Father Classic 1', component: 'FatherClassicTemplate1' },
    { id: 'father-classic-2', label: 'Father Classic 2', component: 'FatherClassicTemplate2' },
  ],
  // Mother templates
  mother: [
    { id: 'mother-love-1', label: 'Mother Love 1', component: 'MotherLoveTemplate1' },
    { id: 'mother-love-2', label: 'Mother Love 2', component: 'MotherLoveTemplate2' },
  ],
  // Friend templates
  friend: [
    { id: 'friend-party-1', label: 'Friend Party 1', component: 'FriendPartyTemplate1' },
    { id: 'friend-party-2', label: 'Friend Party 2', component: 'FriendPartyTemplate2' },
  ],
};

// Anniversary templates
export const ANNIVERSARY_TEMPLATE_MAP = [
  { id: 'wife-romantic-1', label: 'Wife Romantic 1', component: 'WifeRomanticTemplate1' },
  { id: 'wife-romantic-2', label: 'Wife Romantic 2', component: 'WifeRomanticTemplate2' },
  { id: 'husband-romantic-1', label: 'Husband Romantic 1', component: 'HusbandRomanticTemplate1' },
  { id: 'husband-romantic-2', label: 'Husband Romantic 2', component: 'HusbandRomanticTemplate2' },
  { id: 'love-story-timeline', label: 'Love Story Timeline', component: 'LoveStoryTimelineTemplate' },
  { id: 'photo-memory', label: 'Photo Memory', component: 'PhotoMemoryTemplate' },
];

// Get birthday templates based on relation and age group
export const getBirthdayTemplates = (relation, ageGroup = null) => {
  if (ageGroup && relation === 'son') {
    const ageKey = `${relation}_${ageGroup.replace('-', '_')}`;
    return BIRTHDAY_TEMPLATE_MAP[ageKey] || [];
  }
  if (ageGroup && relation === 'daughter') {
    const ageKey = `${relation}_${ageGroup.replace('-', '_')}`;
    return BIRTHDAY_TEMPLATE_MAP[ageKey] || [];
  }
  return BIRTHDAY_TEMPLATE_MAP[relation] || [];
};

// Get template component name by ID
export const getTemplateComponentName = (templateId, type = 'birthday') => {
  if (type === 'birthday') {
    const allTemplates = Object.values(BIRTHDAY_TEMPLATE_MAP).flat();
    return allTemplates.find((t) => t.id === templateId)?.component || null;
  } else if (type === 'anniversary') {
    return ANNIVERSARY_TEMPLATE_MAP.find((t) => t.id === templateId)?.component || null;
  }
  return null;
};
