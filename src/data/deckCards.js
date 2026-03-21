// Yes/No/Maybe Card Deck Data
// Categories of playful/spicy scenarios for couples

export const DECK_CATEGORIES = [
  { id: 'sensory', label: 'Sensory Play', color: '#FFB6C1' },
  { id: 'roleplay', label: 'Role Play', color: '#FFD4C4' },
  { id: 'power', label: 'Power Dynamics', color: '#E8D5F2' },
  { id: 'location', label: 'New Locations', color: '#B8D4E3' },
  { id: 'teasing', label: 'Teasing & Denial', color: '#FFE4B5' },
  { id: 'toys', label: 'Toys & Tools', color: '#F0E68C' },
];

export const DECK_CARDS = [
  // Sensory Play
  {
    id: 'blindfold',
    category: 'sensory',
    title: 'Blindfold Surprise',
    description: 'One partner wears a blindfold while the other leads the experience',
    intensity: 1,
  },
  {
    id: 'ice',
    category: 'sensory',
    title: 'Ice Play',
    description: 'Using ice cubes to explore temperature sensations',
    intensity: 1,
  },
  {
    id: 'feathers',
    category: 'sensory',
    title: 'Feather Touch',
    description: 'Light, teasing touches with feathers or soft fabrics',
    intensity: 1,
  },
  {
    id: 'massage_oil',
    category: 'sensory',
    title: 'Warm Oil Massage',
    description: 'Full body massage with warmed massage oil',
    intensity: 1,
  },
  {
    id: 'silk_scarf',
    category: 'sensory',
    title: 'Soft Restraint',
    description: 'Gentle wrist restraint with silk scarves or soft ties',
    intensity: 2,
  },
  
  // Role Play
  {
    id: 'stranger',
    category: 'roleplay',
    title: 'Strangers at a Bar',
    description: 'Meet at a bar as strangers and pretend to pick each other up',
    intensity: 2,
  },
  {
    id: 'massage_therapist',
    category: 'roleplay',
    title: 'Massage Client',
    description: 'One plays massage therapist, the other the client',
    intensity: 2,
  },
  {
    id: 'boss_secretary',
    category: 'roleplay',
    title: 'Office Fantasy',
    description: 'Boss and employee power dynamic roleplay',
    intensity: 2,
  },
  {
    id: 'photographer',
    category: 'roleplay',
    title: 'Photo Shoot',
    description: 'One directs a boudoir photo shoot of the other',
    intensity: 2,
  },
  {
    id: 'royalty',
    category: 'roleplay',
    title: 'King/Queen & Servant',
    description: 'Royalty being pampered by their devoted servant',
    intensity: 2,
  },
  
  // Power Dynamics
  {
    id: 'follow_orders',
    category: 'power',
    title: 'Follow My Lead',
    description: 'One partner gives commands for an evening, the other follows',
    intensity: 2,
  },
  {
    id: 'no_touching',
    category: 'power',
    title: 'Look But Don\'t Touch',
    description: 'One teases while the other must watch without touching',
    intensity: 2,
  },
  {
    id: 'reward_punish',
    category: 'power',
    title: 'Rewards & Consequences',
    description: 'A game where good behavior earns rewards',
    intensity: 3,
  },
  {
    id: 'begging',
    category: 'power',
    title: 'Make Me Beg',
    description: 'Withholding until they ask (beg) nicely',
    intensity: 2,
  },
  {
    id: 'collar',
    category: 'power',
    title: 'Symbolic Collar',
    description: 'Wearing a necklace or collar as a symbol of connection',
    intensity: 2,
  },
  
  // New Locations
  {
    id: 'shower',
    category: 'location',
    title: 'Steam Shower',
    description: 'Intimate moment in the shower together',
    intensity: 1,
  },
  {
    id: 'couch',
    category: 'location',
    title: 'Couch Surprise',
    description: 'Spontaneous encounter on the living room couch',
    intensity: 1,
  },
  {
    id: 'kitchen',
    category: 'location',
    title: 'Kitchen Counter',
    description: 'Passionate moment while cooking or after',
    intensity: 1,
  },
  {
    id: 'hotel',
    category: 'location',
    title: 'Hotel Getaway',
    description: 'Book a hotel room just for a few hours',
    intensity: 2,
  },
  {
    id: 'car',
    category: 'location',
    title: 'Parked Car',
    description: 'Steamy session in a parked, private location',
    intensity: 2,
  },
  
  // Teasing & Denial
  {
    id: 'slow_kisses',
    category: 'teasing',
    title: 'Slow Kiss Torture',
    description: 'Kissing everywhere except where they want most',
    intensity: 1,
  },
  {
    id: 'clothing_on',
    category: 'teasing',
    title: 'Clothing Optional',
    description: 'Pleasure while still partially dressed',
    intensity: 1,
  },
  {
    id: 'almost',
    category: 'teasing',
    title: 'Almost There',
    description: 'Bring them close then pause, repeat',
    intensity: 2,
  },
  {
    id: 'text_tease',
    category: 'teasing',
    title: 'All Day Texts',
    description: 'Send teasing messages throughout the day',
    intensity: 1,
  },
  {
    id: 'timed_wait',
    category: 'teasing',
    title: 'Timed Release',
    description: 'They must wait until you say they can',
    intensity: 2,
  },
  
  // Toys & Tools
  {
    id: 'vibrator',
    category: 'toys',
    title: 'Shared Vibrator',
    description: 'Using a vibrator together during intimacy',
    intensity: 1,
  },
  {
    id: 'massager',
    category: 'toys',
    title: 'Wand Massager',
    description: 'Using a wand for full body pleasure',
    intensity: 1,
  },
  {
    id: 'cuffs',
    category: 'toys',
    title: 'Soft Cuffs',
    description: 'Velcro or soft padded wrist cuffs',
    intensity: 2,
  },
  {
    id: 'blindfold_toy',
    category: 'toys',
    title: 'Sensory Deprivation',
    description: 'Blindfold plus headphones with music',
    intensity: 2,
  },
  {
    id: 'temperature',
    category: 'toys',
    title: 'Temperature Toys',
    description: 'Glass or metal toys that hold heat/cold',
    intensity: 2,
  },
];
