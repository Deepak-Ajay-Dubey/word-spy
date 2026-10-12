const fs = require('fs');

// Clusters from the PDF document (each cluster has 8 terms, giving up to 28 pairs each)
const PDF_CLUSTERS = [
  // --- Indian Culture ---
  {
    category: 'Indian Culture',
    sub: 'Indian Snacks',
    words: ['Pakora', 'Aloo Tikki', 'Dahi Vada', 'Khandvi', 'Fafda', 'Mirchi Bajji', 'Dabeli', 'Ram Ladoo']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Sweets',
    words: ['Soan Papdi', 'Mysore Pak', 'Modak', 'Sandesh', 'Cham Cham', 'Shrikhand', 'Basundi', 'Mohanthal']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Regional Snacks',
    words: ['Chakli', 'Murukku', 'Thattai', 'Namak Pare', 'Shankarpali', 'Anarsa', 'Chirote', 'Karanji']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Street Food',
    words: ['Bhel Puri', 'Dabeli', 'Sev Khamani', 'Ram Ladoo', 'Chana Jor Garam', 'Aloo Chaat', 'Jhal Muri', 'Ghugni']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Street Life',
    words: ['Chai Stall', 'Paan Shop', 'Tiffin Service', 'Street Vendor', 'Local Train', 'Share Auto', 'Society Gate', 'Watchman Cabin']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Local Transport',
    words: ['Share Auto', 'Kaali-Peeli Taxi', 'BEST Bus', 'Metro Card', 'Local Train Pass', 'Electric Rickshaw', 'Bike Taxi', 'Tempo Traveller']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Rituals & Festivals',
    words: ['Diya', 'Torana', 'Prasad', 'Aarti Thali', 'Kalash', 'Pandal', 'Visarjan', 'Bhajan']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Festivals',
    words: ['Ganesh Chaturthi', 'Durga Puja', 'Onam', 'Bihu', 'Pongal', 'Navratri', 'Lohri', 'Baisakhi']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Heritage Sites',
    words: ['Ajanta Caves', 'Ellora Caves', 'Konark Temple', 'Hampi Ruins', 'Qutub Minar', 'Red Fort', 'Fatehpur Sikri', 'Rani Ki Vav']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian City Landmarks',
    words: ['Gateway of India', 'Charminar', 'Howrah Bridge', 'Hawa Mahal', 'Mysore Palace', 'Victoria Memorial', 'Gol Gumbaz', 'Sanchi Stupa']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Traditional Textiles',
    words: ['Khadi', 'Paithani', 'Banarasi Brocade', 'Kanjeevaram Silk', 'Pochampally Ikat', 'Muga Silk', 'Tussar Silk', 'Mashru']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Folk Arts',
    words: ['Warli Painting', 'Madhubani Painting', 'Pattachitra', 'Gond Art', 'Tanjore Painting', 'Cheriyal Scroll', 'Saura Art', 'Pithora Painting']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Traditional Instruments',
    words: ['Ektara', 'Ravanhatta', 'Algoza', 'Tumbi', 'Ghatam', 'Kanjira', 'Morsing', 'Chenda']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Classical Instruments',
    words: ['Sitar', 'Veena', 'Tanpura', 'Sarod', 'Santoor', 'Tabla', 'Mridangam', 'Shehnai']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Traditional Games',
    words: ['Pachisi', 'Lagori', 'Gilli Danda', 'Atya Patya', 'Pallanguzhi', 'Navakankari', 'Pagade', 'Moksha Patam']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Regional Languages',
    words: ['Marathi', 'Konkani', 'Gujarati', 'Sindhi', 'Punjabi', 'Dogri', 'Kashmiri', 'Ladakhi']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Local Shops',
    words: ['Medical Store', 'Photocopy Shop', 'Tailoring Shop', 'Mobile Repair Shop', 'Cyber Cafe', 'Laundry Shop', 'Tiffin Centre', 'Stationery Shop']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Household Objects',
    words: ['Pressure Lamp', 'Steel Tiffin', 'Masala Dabba', 'Coconut Scraper', 'Chapati Box', 'Brass Urli', 'Puja Bell', 'Hand Fan']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Everyday Sounds',
    words: ['Train Horn', 'Pressure Cooker Whistle', 'Temple Bell', 'Vendor Call', 'Traffic Signal Beep', 'Auto Horn', 'School Bell', 'Society Intercom']
  },
  {
    category: 'Indian Culture',
    sub: 'Indian Regional Tourism',
    words: ['Houseboat Cruise', 'Toy Train Ride', 'Desert Camp', 'Backwater Cruise', 'Heritage Walk', 'Tea Garden Tour', 'Wildlife Safari', 'Pilgrimage Circuit']
  },
  {
    category: 'Indian Culture',
    sub: 'Classical Dance',
    words: ['Bharatanatyam', 'Kathak', 'Kuchipudi', 'Odissi', 'Manipuri', 'Mohiniyattam', 'Kathakali', 'Sattriya']
  },

  // --- Food & Dining ---
  {
    category: 'Food & Dining',
    sub: 'Indian Breads',
    words: ['Kulcha', 'Bhatura', 'Roomali Roti', 'Missi Roti', 'Makki Roti', 'Appam', 'Pathiri', 'Akki Roti']
  },
  {
    category: 'Food & Dining',
    sub: 'Rice Dishes',
    words: ['Khichdi', 'Lemon Rice', 'Curd Rice', 'Tamarind Rice', 'Jeera Rice', 'Coconut Rice', 'Tomato Rice', 'Bisi Bele Bath']
  },
  {
    category: 'Food & Dining',
    sub: 'Indian Breakfast',
    words: ['Sabudana Khichdi', 'Thalipeeth', 'Pesarattu', 'Pongal', 'Puri Bhaji', 'Sevai Upma', 'Ragi Dosa', 'Akki Rotti']
  },
  {
    category: 'Food & Dining',
    sub: 'Regional Indian Cuisine',
    words: ['Appam Stew', 'Misal Pav', 'Litti Chokha', 'Dal Baati', 'Sarson Saag', 'Undhiyu', 'Akki Rotti', 'Puttu']
  },
  {
    category: 'Food & Dining',
    sub: 'Indian Regional Sweets',
    words: ['Payasam', 'Phirni', 'Kulfi', 'Falooda', 'Ghevar', 'Rabri', 'Mohanthal', 'Adhirasam']
  },
  {
    category: 'Food & Dining',
    sub: 'Indian Home Cooking',
    words: ['Tadka', 'Dum Cooking', 'Stone Grinding', 'Sun-Drying Papad', 'Fermenting Batter', 'Hand Churning', 'Spice Roasting', 'Clay-Pot Cooking']
  },
  {
    category: 'Food & Dining',
    sub: 'Condiments & Spices',
    words: ['Chutney', 'Raita', 'Sambhar Powder', 'Garam Masala', 'Chaat Masala', 'Kasuri Methi', 'Tamarind Paste', 'Curry Leaves']
  },
  {
    category: 'Food & Dining',
    sub: 'Bakery',
    words: ['Muffin', 'Scone', 'Pretzel', 'Brioche', 'Focaccia', 'Ciabatta', 'Sourdough', 'Flatbread']
  },
  {
    category: 'Food & Dining',
    sub: 'Desserts',
    words: ['Tiramisu', 'Cheesecake', 'Trifle', 'Mousse', 'Souffle', 'Panna Cotta', 'Creme Brulee', 'Tres Leches']
  },
  {
    category: 'Food & Dining',
    sub: 'Cafe Drinks',
    words: ['Smoothie', 'Milk Tea', 'Cold Brew', 'Iced Tea', 'Hot Chocolate', 'Lemon Soda', 'Fruit Punch', 'Coconut Water']
  },
  {
    category: 'Food & Dining',
    sub: 'Coffee Orders',
    words: ['Americano', 'Cappuccino', 'Flat White', 'Macchiato', 'Mocha', 'Affogato', 'Cortado', 'Piccolo']
  },
  {
    category: 'Food & Dining',
    sub: 'Kitchen Appliances',
    words: ['Rice Cooker', 'Pressure Cooker', 'Slow Cooker', 'Electric Kettle', 'Induction Cooktop', 'Hand Blender', 'Food Processor', 'Bread Maker']
  },
  {
    category: 'Food & Dining',
    sub: 'Kitchen Tools',
    words: ['Whisk', 'Tongs', 'Slotted Spoon', 'Skimmer', 'Zester', 'Mortar and Pestle', 'Measuring Cup', 'Measuring Spoon']
  },
  {
    category: 'Food & Dining',
    sub: 'Cooking Methods',
    words: ['Boiling', 'Steaming', 'Grilling', 'Roasting', 'Braising', 'Sauteing', 'Poaching', 'Blanching']
  },

  // --- Technology & Media ---
  {
    category: 'Technology & Media',
    sub: 'Computer Hardware',
    words: ['Processor', 'Graphics Card', 'Motherboard', 'RAM', 'SSD', 'Cooling Fan', 'Power Supply', 'Sound Card']
  },
  {
    category: 'Technology & Media',
    sub: 'Cables & Ports',
    words: ['USB-C', 'Ethernet Cable', 'DisplayPort Cable', 'VGA Cable', 'Audio Jack', 'Coaxial Cable', 'Optical Cable', 'HDMI Cable']
  },
  {
    category: 'Technology & Media',
    sub: 'Social Platforms',
    words: ['Discord', 'Reddit', 'Pinterest', 'LinkedIn', 'Twitch', 'Tumblr', 'BeReal', 'Threads']
  },
  {
    category: 'Technology & Media',
    sub: 'Cybersecurity',
    words: ['Phishing', 'Ransomware', 'Spyware', 'Adware', 'Trojan Horse', 'Worm Virus', 'Data Breach', 'Identity Theft']
  },
  {
    category: 'Technology & Media',
    sub: 'File Formats',
    words: ['JPEG', 'PNG', 'GIF', 'SVG', 'MP4', 'MOV', 'WAV', 'FLAC']
  },
  {
    category: 'Technology & Media',
    sub: 'Digital Payments',
    words: ['UPI QR', 'Tap-to-Pay', 'Payment Link', 'Wallet Balance', 'Transaction PIN', 'Refund Status', 'Order Tracking', 'Digital Receipt']
  },
  {
    category: 'Technology & Media',
    sub: 'Creator Economy',
    words: ['Affiliate Link', 'Brand Deal', 'Sponsored Post', 'Media Kit', 'Creator Fund', 'Subscriber Badge', 'Donation Alert', 'Membership Tier']
  },
  {
    category: 'Technology & Media',
    sub: 'Indian Creator Tools',
    words: ['Phone Tripod', 'Wireless Microphone', 'Ring Light', 'LED Panel', 'Teleprompter', 'Camera Gimbal', 'Backdrop Stand', 'Capture Card']
  },
  {
    category: 'Technology & Media',
    sub: 'Video Formats',
    words: ['Reaction Video', 'Explainer Video', 'Tutorial Reel', 'Mini Vlog', 'Behind-the-Scenes', 'Product Review', 'Storytime Video', 'Challenge Video']
  },
  {
    category: 'Technology & Media',
    sub: 'Smart Home Tech',
    words: ['Smart Bulb', 'Smart Plug', 'Wi-Fi Camera', 'Video Doorbell', 'Mesh Router', 'Power Bank', 'USB Hub', 'Bluetooth Speaker']
  },
  {
    category: 'Technology & Media',
    sub: 'Indian Digital Services',
    words: ['DigiLocker', 'UMANG App', 'FASTag Recharge', 'e-Challan', 'Aadhaar OTP', 'UPI Autopay', 'e-KYC', 'Digital Signature']
  },

  // --- Everyday Home & Life ---
  {
    category: 'Everyday Home & Life',
    sub: 'Home Furniture',
    words: ['Ottoman', 'Footstool', 'Sideboard', 'Dresser', 'Chest of Drawers', 'Console Table', 'Nightstand', 'Coffee Table']
  },
  {
    category: 'Everyday Home & Life',
    sub: 'Home Storage',
    words: ['Storage Bin', 'Drawer', 'Trunk', 'Shoe Organizer', 'Laundry Hamper', 'Pegboard', 'Wall Shelf', 'Storage Basket']
  },
  {
    category: 'Everyday Home & Life',
    sub: 'Bathroom Essentials',
    words: ['Loofah', 'Bathrobe', 'Shower Cap', 'Bath Sponge', 'Toilet Brush', 'Plunger', 'Soap Dish', 'Shower Curtain']
  },
  {
    category: 'Everyday Home & Life',
    sub: 'Footwear & Shoes',
    words: ['Espadrilles', 'Clogs', 'Oxfords', 'Brogues', 'Chelsea Boots', 'Mary Janes', 'Ballet Flats', 'Mules']
  },
  {
    category: 'Everyday Home & Life',
    sub: 'Fashion Accessories',
    words: ['Pendant', 'Choker', 'Cuff Bracelet', 'Charm Bracelet', 'Brooch Pin', 'Tie Clip', 'Lapel Pin', 'Hairband']
  },
  {
    category: 'Everyday Home & Life',
    sub: 'Textiles & Fabrics',
    words: ['Denim', 'Corduroy', 'Linen', 'Velvet', 'Satin', 'Chiffon', 'Tweed', 'Flannel']
  },
  {
    category: 'Everyday Home & Life',
    sub: 'Home Textiles',
    words: ['Duvet', 'Quilt', 'Comforter', 'Mattress Protector', 'Pillowcase', 'Bolster Cover', 'Table Runner', 'Placemat']
  },
  {
    category: 'Everyday Home & Life',
    sub: 'Personal Care & Grooming',
    words: ['Face Serum', 'Toner', 'Cleansing Balm', 'Hair Serum', 'Hair Gel', 'Dry Shampoo', 'Body Mist', 'Foot Cream']
  },
  {
    category: 'Everyday Home & Life',
    sub: 'Home Repairs & Tools',
    words: ['Tap Washer', 'Fan Capacitor', 'MCB Switch', 'Pipe Joint', 'Door Latch', 'Window Mesh', 'Plug Fuse', 'Water Motor']
  },
  {
    category: 'Everyday Home & Life',
    sub: 'Construction Tools',
    words: ['Screwdriver', 'Allen Key', 'Wrench', 'Pliers', 'Hacksaw', 'Chisel', 'Spirit Level', 'Stud Finder']
  },
  {
    category: 'Everyday Home & Life',
    sub: 'Cleaning Essentials',
    words: ['Dustpan', 'Scrub Brush', 'Lint Roller', 'Microfiber Cloth', 'Window Squeegee', 'Duster Cloth', 'Cleaning Spray', 'Rubber Gloves']
  },

  // --- Nature & Wildlife ---
  {
    category: 'Nature & Wildlife',
    sub: 'Indian Wildlife',
    words: ['Bengal Tiger', 'Asiatic Lion', 'Indian Elephant', 'One-Horned Rhinoceros', 'Snow Leopard', 'Nilgiri Tahr', 'Blackbuck', 'Gharial']
  },
  {
    category: 'Nature & Wildlife',
    sub: 'Indian Birds',
    words: ['Indian Peafowl', 'Asian Koel', 'Indian Roller', 'Sarus Crane', 'Great Hornbill', 'Painted Stork', 'Rose-Ringed Parakeet', 'Black Drongo']
  },
  {
    category: 'Nature & Wildlife',
    sub: 'Big Cats',
    words: ['Ocelot', 'Caracal', 'Serval', 'Lynx', 'Puma', 'Cougar', 'Margay', 'Clouded Leopard']
  },
  {
    category: 'Nature & Wildlife',
    sub: 'Marine Life',
    words: ['Octopus', 'Squid', 'Cuttlefish', 'Jellyfish', 'Starfish', 'Sea Urchin', 'Sea Cucumber', 'Nautilus']
  },
  {
    category: 'Nature & Wildlife',
    sub: 'Birds of the World',
    words: ['Kingfisher', 'Woodpecker', 'Flamingo', 'Pelican', 'Albatross', 'Ostrich', 'Emu', 'Hornbill']
  },
  {
    category: 'Nature & Wildlife',
    sub: 'Trees & Forest',
    words: ['Oak', 'Maple', 'Cedar', 'Birch', 'Willow', 'Aspen', 'Teak', 'Mahogany']
  },
  {
    category: 'Nature & Wildlife',
    sub: 'Atmosphere & Weather',
    words: ['Drizzle', 'Sleet', 'Hail', 'Haze', 'Mist', 'Downpour', 'Heatwave', 'Blizzard']
  },
  {
    category: 'Nature & Wildlife',
    sub: 'Natural Disasters',
    words: ['Cyclone', 'Tornado', 'Landslide', 'Avalanche', 'Drought', 'Flood', 'Wildfire', 'Dust Storm']
  },
  {
    category: 'Nature & Wildlife',
    sub: 'Geography & Landforms',
    words: ['Isthmus', 'Peninsula', 'Archipelago', 'Atoll', 'Plateau', 'Delta', 'Estuary', 'Glacier']
  },
  {
    category: 'Nature & Wildlife',
    sub: 'Coastal Features',
    words: ['Coral Reef', 'Lagoon', 'Tidal Pool', 'Sandbar', 'Sea Cave', 'Cliff Coast', 'Seagrass Bed', 'Mangrove Swamp']
  },

  // --- Sports & Games ---
  {
    category: 'Sports & Games',
    sub: 'Cricket',
    words: ['Wicketkeeper', 'All-Rounder', 'Leg Spinner', 'Off Spinner', 'Yorker', 'Bouncer', 'Googly', 'Doosra']
  },
  {
    category: 'Sports & Games',
    sub: 'Athletics & Track',
    words: ['Long Jump', 'High Jump', 'Triple Jump', 'Pole Vault', 'Shot Put', 'Discus Throw', 'Javelin Throw', 'Hammer Throw']
  },
  {
    category: 'Sports & Games',
    sub: 'Racket Sports',
    words: ['Squash', 'Padel', 'Pickleball', 'Racquetball', 'Real Tennis', 'Soft Tennis', 'Beach Tennis', 'Platform Tennis']
  },
  {
    category: 'Sports & Games',
    sub: 'Board Games',
    words: ['Catan', 'Risk', 'Clue', 'Ticket to Ride', 'Carcassonne', 'Azul', 'Pandemic', 'Codenames']
  },
  {
    category: 'Sports & Games',
    sub: 'Card Games',
    words: ['Poker', 'Rummy', 'Bridge', 'Hearts', 'Spades', 'Go Fish', 'Old Maid', 'Crazy Eights']
  },
  {
    category: 'Sports & Games',
    sub: 'Fitness & Workout',
    words: ['Warm-up', 'Cool-down', 'Plank', 'Lunge', 'Burpee', 'Mountain Climber', 'Deadlift', 'Squat']
  },
  {
    category: 'Sports & Games',
    sub: 'Water Activities',
    words: ['Kayaking', 'Canoeing', 'Rafting', 'Paddleboarding', 'Snorkelling', 'Scuba Diving', 'Freediving', 'Sailing']
  },
  {
    category: 'Sports & Games',
    sub: 'Outdoor Recreation',
    words: ['Birdwatching', 'Nature Walk', 'Geocaching', 'Orienteering', 'Trail Running', 'Bouldering', 'Caving', 'Paddle Boating']
  },
  {
    category: 'Sports & Games',
    sub: 'Party Games',
    words: ['Charades', 'Trivia Quiz', 'Guess the Song', 'Two Truths and a Lie', 'Would You Rather', 'Truth or Dare', '20 Questions', 'Telephone Game']
  },
  {
    category: 'Sports & Games',
    sub: 'Word Games',
    words: ['Word Chain', 'Anagram', 'Palindrome', 'Synonym', 'Antonym', 'Rhyme', 'Word Ladder', 'Cryptogram']
  },

  // --- Cinema & Pop Culture ---
  {
    category: 'Cinema & Pop Culture',
    sub: 'Indian Cinema',
    words: ['Bollywood', 'Tollywood', 'Kollywood', 'Mollywood', 'Sandalwood', 'Marathi Cinema', 'Punjabi Cinema', 'Bengali Cinema']
  },
  {
    category: 'Cinema & Pop Culture',
    sub: 'Film Genres',
    words: ['Mystery', 'Fantasy', 'Musical', 'Documentary', 'Western', 'Biopic', 'Satire', 'Coming-of-Age']
  },
  {
    category: 'Cinema & Pop Culture',
    sub: 'Film & TV Production',
    words: ['Screenwriter', 'Cinematographer', 'Editor', 'Casting Director', 'Production Designer', 'Sound Designer', 'Stunt Coordinator', 'Script Supervisor']
  },
  {
    category: 'Cinema & Pop Culture',
    sub: 'Film & Narrative Terms',
    words: ['Cold Open', 'Cliffhanger', 'Montage', 'Flashback', 'Voice-over', 'Post-Credits Scene', 'Pilot Episode', 'Season Finale']
  },
  {
    category: 'Cinema & Pop Culture',
    sub: 'Social Deduction',
    words: ['Civilian', 'Undercover', 'Mr. White', 'Secret Word', 'Category Hint', 'Clue Round', 'Accusation Vote', 'Final Guess']
  },
  {
    category: 'Cinema & Pop Culture',
    sub: 'Music & Instruments',
    words: ['Violin', 'Viola', 'Cello', 'Double Bass', 'Oboe', 'Clarinet', 'Bassoon', 'Flute']
  },

  // --- Work & Campus ---
  {
    category: 'Work & Campus',
    sub: 'Campus & College Life',
    words: ['Lecture', 'Tutorial', 'Lab Session', 'Viva', 'Assignment', 'Project Report', 'Practical Exam', 'Internal Assessment']
  },
  {
    category: 'Work & Campus',
    sub: 'Student Life',
    words: ['Lab Journal', 'Hall Ticket', 'College ID', 'Canteen Token', 'Library Card', 'Placement Cell', 'Project Viva', 'Internal Assessment']
  },
  {
    category: 'Work & Campus',
    sub: 'Career Preparation',
    words: ['Mock Interview', 'Aptitude Test', 'Coding Assessment', 'Group Discussion', 'Portfolio Website', 'Internship Application', 'Resume Builder', 'Placement Test']
  },
  {
    category: 'Work & Campus',
    sub: 'Business Roles',
    words: ['Accountant', 'Auditor', 'Recruiter', 'Analyst', 'Consultant', 'Project Manager', 'HR Manager', 'Operations Manager']
  },
  {
    category: 'Work & Campus',
    sub: 'Business Documents',
    words: ['Invoice', 'Receipt', 'Purchase Order', 'Delivery Note', 'Quotation', 'Work Order', 'Payslip', 'Expense Report']
  },
  {
    category: 'Work & Campus',
    sub: 'Meetings & Events',
    words: ['Stand-up Meeting', 'Brainstorming Session', 'Town Hall', 'Retrospective', 'Workshop', 'Seminar', 'Panel Discussion', 'Web Conference']
  },
  {
    category: 'Work & Campus',
    sub: 'Workplace Communication',
    words: ['Agenda', 'Minutes of Meeting', 'Action Item', 'Status Report', 'Escalation Email', 'Out-of-Office Reply', 'Meeting Invite', 'Follow-up Note']
  },
  {
    category: 'Work & Campus',
    sub: 'Personal Finance & Banking',
    words: ['Savings Account', 'Current Account', 'Fixed Deposit', 'Recurring Deposit', 'Debit Mandate', 'Standing Instruction', 'EMI', 'Overdraft']
  }
];

// Helper to normalize pair key
function pairKey(w1, w2) {
  const [a, b] = [w1.toLowerCase().trim(), w2.toLowerCase().trim()].sort();
  return `${a}:::${b}`;
}

// 1. Load existing pairs
const rawExisting = fs.readFileSync('src/data/fallbackWords.ts', 'utf8');
const pairMatches = [...rawExisting.matchAll(/\{\s*category:\s*['\"]([^'\"]+)['\"],\s*civilian:\s*['\"]([^'\"]+)['\"],\s*undercover:\s*['\"]([^'\"]+)['\"]\s*\}/g)];

// Map existing category to one of the 8 broad categories
function mapOldCategory(oldCat) {
  if (oldCat.includes('Food') || oldCat.includes('Kitchen')) return 'Food & Dining';
  if (oldCat.includes('Clothing') || oldCat.includes('Fashion')) return 'Everyday Home & Life';
  if (oldCat.includes('Everyday') || oldCat.includes('Home')) return 'Everyday Home & Life';
  if (oldCat.includes('Technology') || oldCat.includes('Media')) return 'Technology & Media';
  if (oldCat.includes('Sports') || oldCat.includes('Games')) return 'Sports & Games';
  if (oldCat.includes('Travel') || oldCat.includes('Places')) return 'Indian Culture';
  if (oldCat.includes('Nature') || oldCat.includes('Animals')) return 'Nature & Wildlife';
  if (oldCat.includes('Cinema') || oldCat.includes('Pop Culture')) return 'Cinema & Pop Culture';
  if (oldCat.includes('Work') || oldCat.includes('Office')) return 'Work & Campus';
  if (oldCat.includes('People') || oldCat.includes('Feelings')) return 'Everyday Home & Life';
  return 'Everyday Home & Life';
}

const seenKeys = new Set();
const finalPairs = [];

// Add existing pairs mapped to clean broad categories
for (const m of pairMatches) {
  const civ = m[2].trim();
  const und = m[3].trim();
  const k = pairKey(civ, und);
  if (!seenKeys.has(k) && civ.toLowerCase() !== und.toLowerCase()) {
    seenKeys.add(k);
    finalPairs.push({
      category: mapOldCategory(m[1]),
      civilian: civ,
      undercover: und
    });
  }
}
console.log(`Existing valid pairs after deduplication: ${finalPairs.length}`);

// 2. Add pairs from the PDF clusters
let addedFromClusters = 0;
for (const cluster of PDF_CLUSTERS) {
  const words = cluster.words;
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      const civ = words[i].trim();
      const und = words[j].trim();
      if (!civ || !und || civ.toLowerCase() === und.toLowerCase()) continue;
      const k = pairKey(civ, und);
      if (!seenKeys.has(k)) {
        seenKeys.add(k);
        finalPairs.push({
          category: cluster.category,
          civilian: civ,
          undercover: und
        });
        addedFromClusters++;
      }
    }
  }
}

console.log(`Added from PDF clusters: ${addedFromClusters}`);
console.log(`TOTAL final pairs: ${finalPairs.length}`);

// Category breakdown
const breakdown = {};
finalPairs.forEach(p => {
  breakdown[p.category] = (breakdown[p.category] || 0) + 1;
});
console.log('Category breakdown:', breakdown);

// Generate final TypeScript content
const fileLines = [
  "import { WordPair } from '../types';",
  "",
  "export const FALLBACK_WORD_PAIRS: WordPair[] = ["
];

finalPairs.forEach(p => {
  const safeCat = p.category.replace(/'/g, "\\'");
  const safeCiv = p.civilian.replace(/'/g, "\\'");
  const safeUnd = p.undercover.replace(/'/g, "\\'");
  fileLines.push(`  { category: '${safeCat}', civilian: '${safeCiv}', undercover: '${safeUnd}' },`);
});

fileLines.push("];");
fileLines.push("");
fileLines.push("export const CATEGORIES = [");
fileLines.push("  'All Categories',");
fileLines.push("  'Indian Culture',");
fileLines.push("  'Food & Dining',");
fileLines.push("  'Technology & Media',");
fileLines.push("  'Everyday Home & Life',");
fileLines.push("  'Nature & Wildlife',");
fileLines.push("  'Sports & Games',");
fileLines.push("  'Cinema & Pop Culture',");
fileLines.push("  'Work & Campus',");
fileLines.push("  'Surprise Me (AI Live)',");
fileLines.push("];");
fileLines.push("");
fileLines.push("export const SPY_CODENAMES = [");
fileLines.push("  'Ghost',");
fileLines.push("  'Spectre',");
fileLines.push("  'Viper',");
fileLines.push("  'Shadow',");
fileLines.push("  'Falcon',");
fileLines.push("  'Raven',");
fileLines.push("  'Fox',");
fileLines.push("  'Cobra',");
fileLines.push("  'Echo',");
fileLines.push("  'Mirage',");
fileLines.push("  'Sable',");
fileLines.push("  'Apex',");
fileLines.push("  'Cipher',");
fileLines.push("  'Phantom',");
fileLines.push("  'Nova',");
fileLines.push("  'Orion',");
fileLines.push("  'Nemesis',");
fileLines.push("  'Vortex',");
fileLines.push("];");
fileLines.push("");

fs.writeFileSync('src/data/fallbackWords.ts', fileLines.join('\n'), 'utf8');
console.log('Successfully wrote src/data/fallbackWords.ts!');
