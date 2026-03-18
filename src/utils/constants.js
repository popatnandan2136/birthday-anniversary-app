// Relations
export const RELATIONS = {
  SISTER: 'sister',
  BROTHER: 'brother',
  SON: 'son',
  DAUGHTER: 'daughter',
  FRIEND: 'friend',
  FATHER: 'father',
  MOTHER: 'mother',
  WIFE: 'wife',
  HUSBAND: 'husband',
  CUSTOM: 'custom',
};

export const RELATION_CHOICES = [
  { value: 'sister', label: 'Sister' },
  { value: 'brother', label: 'Brother' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'friend', label: 'Friend' },
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'wife', label: 'Wife' },
  { value: 'husband', label: 'Husband' },
  { value: 'custom', label: 'Custom' },
];

// Sister types
export const SISTER_TYPES = [
  { value: 'little_sister', label: 'Little Sister' },
  { value: 'elder_sister', label: 'Elder Sister' },
];

// Brother types
export const BROTHER_TYPES = [
  { value: 'little_brother', label: 'Little Brother' },
  { value: 'elder_brother', label: 'Elder Brother' },
];

// Age groups
export const AGE_GROUPS = [
  { value: '0-5', label: '0 - 5 years' },
  { value: '5-10', label: '5 - 10 years' },
  { value: '10-15', label: '10 - 15 years' },
  { value: '15-18', label: '15 - 18 years' },
  { value: '18+', label: '18+ years' },
];

// Wish types
export const WISH_TYPES = {
  BIRTHDAY: 'birthday',
  ANNIVERSARY: 'anniversary',
};

// Wish statuses
export const WISH_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

// Relations that have age-specific templates
export const RELATIONS_WITH_AGE = ['son', 'daughter', 'little_sister', 'little_brother'];

// Relations that have gender-specific sub-types
export const RELATIONS_WITH_SUBTYPES = ['sister', 'brother'];
