// lib/mockStoryData.js
export const storyCategories = [
  { id: 'all', name: 'All Stories', icon: '📖' },
  { id: 'ramayana', name: 'Ramayana', icon: '🏹' },
  { id: 'mahabharata', name: 'Mahabharata', icon: '⚔️' },
  { id: 'saints', name: 'Saints & Sages', icon: '🕉️' },
  { id: 'parable', name: 'Parables', icon: '💡' },
];

export const stories = [
  {
    id: 1,
    title: "The Golden Deer - A Tale from Ramayana",
    description: "The story of how Maricha disguised himself as a golden deer to distract Rama and Sita during their exile.",
    fullStory: "During their exile in the Dandaka forest, Sita saw a beautiful golden deer grazing near their hermitage. Its coat shimmered like pure gold, and its eyes sparkled like diamonds. Sita was captivated by its beauty and asked Rama to catch it for her...\n\nRama, seeing Sita's delight, agreed to chase the deer. But the deer was no ordinary animal - it was Maricha, a demon in disguise. He led Rama deep into the forest, far away from the hermitage.\n\nMeanwhile, Maricha, imitating Rama's voice, cried out for help. Sita, hearing the cry, became anxious and insisted that Lakshmana go to his brother's aid. Lakshmana, sensing a trap, drew a protective line (Lakshmana Rekha) around the hermitage before leaving, warning Sita not to cross it.\n\nThis was the moment Ravana had been waiting for. Disguised as a wandering sage, he approached Sita, crossing the line using his cunning. The rest, as they say, is history.\n\nThe golden deer was a symbol of desire - something beautiful and tempting that led to dangerous consequences. It teaches us to be wary of things that appear too good to be true.",
    category: "ramayana",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=450&fit=crop",
    readingTime: 4,
    author: "Valmiki",
    date: "2025-01-15",
    featured: true,
    tags: ["Ramayana", "Wisdom", "Desire", "Deception"],
    moral: "Desire can lead to dangerous consequences. Always question things that appear too good to be true."
  },
  {
    id: 2,
    title: "The Story of Eklavya - Guru Dakshina",
    description: "The tale of Eklavya, a young tribal boy who taught himself archery and offered his guru his thumb.",
    fullStory: "Eklavya was a young Nishada boy who had a burning desire to learn archery. He approached Dronacharya, the royal guru, but was refused because of his low birth...\n\nUndeterred, Eklavya created a clay statue of Dronacharya and began practicing in front of it. Through sheer determination and self-discipline, he became the greatest archer of his time.\n\nOne day, Dronacharya came to the forest and saw Eklavya's skill. He was amazed but also concerned - he had promised Arjuna that he would make him the greatest archer. Dronacharya asked Eklavya for his guru dakshina (fee).\n\nEklavya, without hesitation, offered anything. Dronacharya asked for his right thumb - the most essential part for an archer. Eklavya, honoring his guru, cut off his thumb and offered it without hesitation.\n\nThis story teaches us about dedication, sacrifice, and the power of self-learning. Eklavya's devotion to his guru and his craft is legendary.",
    category: "mahabharata",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop",
    readingTime: 5,
    author: "Vyasa",
    date: "2025-01-14",
    featured: true,
    tags: ["Mahabharata", "Dedication", "Sacrifice", "Learning"],
    moral: "True dedication and self-discipline can overcome any obstacle. A guru's words are sacred."
  },
  {
    id: 3,
    title: "The Blind Saint - Surdas",
    description: "The inspiring story of Surdas, the blind saint whose devotion to Lord Krishna was beyond sight.",
    fullStory: "Surdas was born blind, but his lack of sight only deepened his inner vision. He was a poet, musician, and saint who lived in the 15th century...\n\nDespite his blindness, Surdas had the ability to see the divine in everything. His songs and bhajans dedicated to Lord Krishna are still sung today. He would often say, 'I cannot see with my eyes, but my heart sees Krishna everywhere.'\n\nHe was a disciple of Vallabhacharya, who recognized Surdas's divine talent. Surdas composed over 100,000 songs, though only a few thousand survive today.\n\nWhen people asked him about his blindness, he replied, 'The eyes of the heart are more powerful than the eyes of the body. I see Krishna in every face, in every flower, in every moment.'\n\nHis life teaches us that physical limitations cannot hold back spiritual realization. True vision comes from the heart.",
    category: "saints",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop",
    readingTime: 4,
    author: "Various",
    date: "2025-01-13",
    featured: true,
    tags: ["Saints", "Devotion", "Music", "Vision"],
    moral: "True vision comes from the heart, not the eyes. Spiritual realization transcends physical limitations."
  },
  {
    id: 4,
    title: "The Wise Man and the Elephant - A Parable",
    description: "A beautiful parable about six blind men who encounter an elephant and learn about the nature of truth.",
    fullStory: "Six blind men were taken to see an elephant. Each man touched a different part of the animal and formed his own idea of what an elephant was...\n\nThe first man touched the trunk and said, 'An elephant is like a large snake.' The second touched the leg and said, 'An elephant is like a pillar.' The third touched the ear and said, 'An elephant is like a fan.' The fourth touched the tail and said, 'An elephant is like a rope.' The fifth touched the tusk and said, 'An elephant is like a spear.' The sixth touched the side and said, 'An elephant is like a wall.'\n\nEach man was right from his perspective, but they all were wrong in their limited understanding. The wise man explained that the elephant represented the ultimate truth - each of us sees only a small part, but the whole is greater than any single perspective.\n\nThis parable teaches us humility and the importance of understanding that we all have limited perspectives. True wisdom comes from acknowledging that we don't know everything.",
    category: "parable",
    image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&h=450&fit=crop",
    readingTime: 3,
    author: "Unknown",
    date: "2025-01-12",
    featured: false,
    tags: ["Parable", "Wisdom", "Perspective", "Truth"],
    moral: "Truth is vast and cannot be fully understood from just one perspective. Embrace different viewpoints."
  },
  {
    id: 5,
    title: "The Story of Dhruva - Unwavering Devotion",
    description: "The inspiring tale of Dhruva, a young prince who performed intense penance to receive a boon from Lord Vishnu.",
    fullStory: "Dhruva was a young prince who felt slighted by his stepmother. He decided to seek a higher purpose and went to the forest to meditate...\n\nFor months, Dhruva meditated with unwavering focus. He ate nothing, drank nothing, and thought only of the divine. His determination was so strong that even the gods were moved.\n\nFinally, Lord Vishnu appeared before him. Dhruva, though still a child, had gained immense spiritual power. He asked for a boon - he wanted a place in the heavens where he could always be remembered.\n\nLord Vishnu granted his wish and placed him in the sky as the Dhruva Nakshatra (the North Star). This star serves as a guide for all travelers, shining steadily and never changing its position.\n\nDhruva's story teaches us about the power of determination and unwavering devotion. When we set our minds on a goal and pursue it with complete dedication, even the impossible becomes possible.",
    category: "saints",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=450&fit=crop",
    readingTime: 5,
    author: "Unknown",
    date: "2025-01-11",
    featured: false,
    tags: ["Saints", "Devotion", "Determination", "Vishnu"],
    moral: "Unwavering devotion and determination can achieve what seems impossible. Never give up on your goals."
  },
  {
    id: 6,
    title: "The Test of Devotion - Tale of Kannappa",
    description: "The story of Kannappa, a tribal hunter who worshipped Lord Shiva through his own simple but powerful methods.",
    fullStory: "Kannappa was a tribal hunter who lived in the forest. He was a simple man with a pure heart. He would go to the temple and perform his own unique form of worship...\n\nKannappa would offer meat to the Shiva lingam and pour water from his mouth onto it. The priests were horrified and tried to stop him. But Lord Shiva, who sees the heart, accepted Kannappa's sincere devotion over the priests' elaborate but mechanical rituals.\n\nOne day, Kannappa noticed that one of the eyes of the Shiva lingam was bleeding. Without a second thought, he plucked out his own eye and placed it on the lingam. The bleeding stopped. But then the other eye also started bleeding. Kannappa, without hesitation, placed his foot to mark the spot and began to pluck his other eye.\n\nAt that moment, Lord Shiva appeared before him and blessed him. Kannappa was transformed and became a great devotee.\n\nThis story teaches us that devotion is a matter of the heart, not of rituals. True worship comes from sincere love and sacrifice.",
    category: "saints",
    image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&h=450&fit=crop",
    readingTime: 4,
    author: "Various",
    date: "2025-01-10",
    featured: false,
    tags: ["Saints", "Devotion", "Sacrifice", "Shiva"],
    moral: "True devotion comes from the heart, not from rituals. Sincere love is the greatest offering."
  },
  {
    id: 7,
    title: "The Betrayal in Mahabharata - Duryodhana's Story",
    description: "The story of Duryodhana's betrayal and the tragic choices that led to the great war of Kurukshetra.",
    fullStory: "Duryodhana was the eldest of the Kauravas, born to King Dhritarashtra and Queen Gandhari. He was proud, jealous, and ambitious...\n\nHis hatred for the Pandavas grew from a young age. He felt that the throne of Hastinapura was rightfully his, and he could not bear the idea of sharing it with his cousins. His jealousy was further fueled by Shakuni, his uncle.\n\nDuryodhana's betrayal was his greatest flaw. He refused to give the Pandavas their rightful share of the kingdom. He tried to kill them multiple times - the palace of lac, the game of dice, and finally, the great war of Kurukshetra.\n\nEven on the battlefield, Duryodhana had moments of conscience. Krishna offered him a chance to make peace, but Duryodhana refused. His pride was his undoing.\n\nThe story of Duryodhana teaches us about the dangers of jealousy, pride, and unwillingness to see the truth. It reminds us that our choices shape our destiny.",
    category: "mahabharata",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop",
    readingTime: 6,
    author: "Vyasa",
    date: "2025-01-09",
    featured: false,
    tags: ["Mahabharata", "Jealousy", "Pride", "Karma"],
    moral: "Jealousy and pride lead to destruction. Choose forgiveness and humility over revenge."
  },
  {
    id: 8,
    title: "The Teachings of Ramana Maharshi",
    description: "The inspiring teachings of the great sage Ramana Maharshi on self-inquiry and spiritual realization.",
    fullStory: "Ramana Maharshi was a spiritual master who taught the path of self-inquiry. He believed that the ultimate truth is self-realization...\n\nHis most famous teaching was the question, 'Who am I?' He taught that by constantly asking this question and looking inward, we can transcend the ego and realize our true nature.\n\nWhen people asked about his teachings, he would say, 'The mind is a powerful force. It can enslave us or empower us. By turning inward and asking 'Who am I?', we can free ourselves from all suffering.'\n\nRamana Maharshi remained in silence for much of his life, teaching through his presence rather than words. His teachings continue to inspire seekers around the world.\n\nThe story of Ramana Maharshi teaches us the power of self-inquiry and the importance of looking inward. True wisdom comes from knowing ourselves.",
    category: "saints",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=450&fit=crop",
    readingTime: 3,
    author: "Ramana Maharshi",
    date: "2025-01-08",
    featured: false,
    tags: ["Saints", "Self-Inquiry", "Realization", "Wisdom"],
    moral: "True wisdom comes from knowing ourselves. Look inward and ask 'Who am I?'."
  },
  {
    id: 9,
    title: "The Frog in the Well - A Parable",
    description: "The parable of the frog who lived in a well and thought that was the whole world.",
    fullStory: "There was a frog who lived in a small well. He had never seen the world outside. He thought that the well was the entire universe...\n\nOne day, a sea turtle came to the well. The frog asked the turtle, 'Where do you come from?' The turtle replied, 'From the great ocean.'\n\nThe frog asked, 'Is your ocean bigger than my well?' The turtle laughed and said, 'The ocean is so vast that you cannot even imagine it. It stretches beyond the horizon in all directions.'\n\nThe frog was shocked. He had never imagined anything bigger than his well. He couldn't even believe that the ocean existed.\n\nThis parable teaches us about our limited perspective. Like the frog in the well, we often think our own experience is the whole truth. We must be open to learning and understanding that there is so much more to the world than we can see from our own little well.",
    category: "parable",
    image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&h=450&fit=crop",
    readingTime: 2,
    author: "Unknown",
    date: "2025-01-07",
    featured: false,
    tags: ["Parable", "Perspective", "Learning", "Humility"],
    moral: "We must be humble and open to learning. The world is larger than our own experience."
  },
  {
    id: 10,
    title: "The Story of Prahlad - Unshakeable Faith",
    description: "The inspiring tale of Prahlad, a young prince whose faith in Lord Vishnu protected him from his father's evil.",
    fullStory: "Prahlad was born into the family of Hiranyakashipu, a demon king who hated Lord Vishnu. Despite his father's evil nature, Prahlad was a devoted follower of Vishnu...\n\nHis father tried to kill him multiple times - by throwing him off a cliff, by poisoning him, by ordering him to be crushed by elephants. But each time, Lord Vishnu protected him.\n\nFinally, Hiranyakashipu asked Prahlad, 'Where is your Vishnu?' Prahlad replied, 'He is everywhere, in everything, inside you and inside me.' Enraged, the demon king pointed to a pillar and asked, 'Is he in this pillar?' Prahlad said yes.\n\nThen Vishnu appeared from the pillar in the form of Narasimha - half-man, half-lion - and destroyed Hiranyakashipu.\n\nPrahlad's faith was unshakeable. He never doubted, even in the face of death. His story teaches us about the power of faith and the protection that comes from unwavering devotion.",
    category: "saints",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=450&fit=crop",
    readingTime: 5,
    author: "Various",
    date: "2025-01-06",
    featured: false,
    tags: ["Saints", "Faith", "Devotion", "Protection"],
    moral: "Unshakeable faith can protect us and guide us through the most difficult challenges."
  },
  {
    id: 11,
    title: "The Reunion of Rama and Sita",
    description: "The emotional story of Rama and Sita's reunion after the great battle of Lanka.",
    fullStory: "After the battle of Lanka, Rama and Sita were finally reunited. But the joy of reunion was mixed with the pain of separation and the challenges they had faced...\n\nRama, however, could not immediately embrace Sita. As a king, he had to consider public opinion. He asked Sita to prove her purity by entering a fire (Agni Pariksha). Sita, with her unwavering love and loyalty, entered the fire without hesitation.\n\nAgni, the fire god, protected her and she emerged unharmed. Her purity was established.\n\nThe reunion of Rama and Sita is a story of love, loyalty, and the challenges that come with being a king. It teaches us about the importance of trust, honor, and the power of true love.\n\nRam and Sita's story is a timeless tale of devotion and love that continues to inspire generations.",
    category: "ramayana",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop",
    readingTime: 4,
    author: "Valmiki",
    date: "2025-01-05",
    featured: false,
    tags: ["Ramayana", "Love", "Devotion", "Reunion"],
    moral: "True love endures all challenges. Trust and honor are the foundation of a strong relationship."
  },
  {
    id: 12,
    title: "The Power of Surrender - Karna's Story",
    description: "The story of Karna, the great warrior who had the power to win any battle but was defeated by his own choices.",
    fullStory: "Karna was one of the greatest warriors in the Mahabharata. He was the son of Surya, the sun god, but was abandoned at birth...\n\nKarna grew up in poverty and faced constant rejection. He was ridiculed for his low birth and denied the education he deserved. Despite this, he became a master of archery.\n\nWhen Krishna offered him the truth of his birth and the chance to join the Pandavas, Karna refused. His loyalty to Duryodhana, who had given him a chance when no one else would, was unwavering.\n\nKarna was defeated on the battlefield of Kurukshetra. His death is a tragic story of greatness mixed with poor choices.\n\nKarna's story teaches us about the power of surrender and the dangers of attachment. Even the greatest warriors can be defeated by their own choices.",
    category: "mahabharata",
    image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&h=450&fit=crop",
    readingTime: 5,
    author: "Vyasa",
    date: "2025-01-04",
    featured: false,
    tags: ["Mahabharata", "Loyalty", "Choices", "Destiny"],
    moral: "Our choices shape our destiny. Sometimes surrendering to a greater truth is the path to victory."
  },
];

// Helper functions
export const getCategoryStories = (categoryId) => {
  if (categoryId === 'all') return stories;
  return stories.filter(story => story.category === categoryId);
};

export const getFeaturedStories = () => {
  return stories.filter(story => story.featured);
};

export const getStoryById = (id) => {
  return stories.find(story => story.id === id);
};

export const searchStories = (query) => {
  const searchLower = query.toLowerCase();
  return stories.filter(story =>
    story.title.toLowerCase().includes(searchLower) ||
    story.description.toLowerCase().includes(searchLower) ||
    story.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
    story.author.toLowerCase().includes(searchLower)
  );
};