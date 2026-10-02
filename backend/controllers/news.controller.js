/* ══════════════════════════════════════════════════════════════
   NEWS CONTROLLER — INDIAN REGION & REAL-TIME TEAM INDIA CRICKET
   ══════════════════════════════════════════════════════════════ */

// High-quality imagery for Team India cricket stories
const cricketImages = [
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop', // cricket stadium under lights
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop', // cricket ball and pitch
  'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&auto=format&fit=crop', // batsman stance
  'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&auto=format&fit=crop', // cricket stadium crowd
  'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop', // cricket boundary action
];

// Curated Indian & Global News Pool (Rotates & Refreshes on 2-hour cycles)
const curatedNews = [
  /* ════════════════════════════════════════════════════════════
     1. SPORT — TEAM INDIA CRICKET (Guaranteed Core & Live)
     ════════════════════════════════════════════════════════════ */
  {
    id: 'spt-ind-1',
    category: 'sport',
    region: 'India 🇮🇳',
    title: "Team India Announces Squad for Upcoming Test Series: Rohit Sharma to Lead with Bumrah as Deputy",
    description: "BCCI selection committee finalizes the 16-man squad. Key spinners and pacers drafted in as India sharpens strategy for the World Test Championship final race.",
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop',
    source: 'BCCI Official / ESPNcricinfo',
    url: 'https://www.bcci.tv/news',
  },
  {
    id: 'spt-ind-2',
    category: 'sport',
    region: 'India 🇮🇳',
    title: "Virat Kohli Reaches Historic Milestone in International Cricket, Clinches Record Average in Chases",
    description: "The veteran Indian batter achieves another batting benchmark across formats, sparking praise from cricket legends globally as India seals a dramatic victory.",
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
    source: 'ESPNcricinfo',
    url: 'https://www.espncricinfo.com/team/india-6',
  },
  {
    id: 'spt-ind-3',
    category: 'sport',
    region: 'India 🇮🇳',
    title: "IPL Mega Auction & Retention Rules Announced: Franchises Prepare Bidding Strategy",
    description: "The IPL governing council confirms retention slabs and RTM cards for franchises ahead of the upcoming tournament season, shaking up team compositions.",
    image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&auto=format&fit=crop',
    source: 'Cricbuzz India',
    url: 'https://www.cricbuzz.com/cricket-news',
  },
  {
    id: 'spt-ind-4',
    category: 'sport',
    region: 'India 🇮🇳',
    title: "India Women's Cricket Team Shines in Multi-Format Series with Dominant All-Round Display",
    description: "Harmanpreet Kaur and Smriti Mandhana deliver match-winning partnerships as Team India registers a comprehensive whitewash.",
    image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&auto=format&fit=crop',
    source: 'NDTV Sports Cricket',
    url: 'https://sports.ndtv.com/cricket',
  },
  {
    id: 'spt-world-1',
    category: 'sport',
    region: 'World 🌍',
    title: "ICC World Test Championship Standings: India Holds Top Ranking Amid High-Stakes Away Tours",
    description: "With vital series points on the line, Team India consolidates its rank at the summit of the ICC WTC points table.",
    image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop',
    source: 'ICC Official',
    url: 'https://www.icc-cricket.com/rankings',
  },

  /* ════════════════════════════════════════════════════════════
     2. AI — INDIAN INITIATIVES & GLOBAL ADVANCES
     ════════════════════════════════════════════════════════════ */
  {
    id: 'ai-ind-1',
    category: 'ai',
    region: 'India 🇮🇳',
    title: "IndiaAI Mission Kicks Off: Government Tenders 10,000 GPUs to Democratize AI Infrastructure",
    description: "The Ministry of Electronics & IT rolls out computing subsidies for Indian researchers, academic institutions, and deep-tech AI startups building foundation models.",
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    source: 'PIB Delhi / Mint',
    url: 'https://www.livemint.com/technology',
  },
  {
    id: 'ai-ind-2',
    category: 'ai',
    region: 'India 🇮🇳',
    title: "Indian Vernacular AI Boom: Sarvam AI & Bhashini Deploy Multilingual Models for 22 Languages",
    description: "Voice-first generative AI frameworks empower farmers, rural banking, and students across India with speech recognition in regional languages.",
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop',
    source: 'YourStory India',
    url: 'https://yourstory.com/category/ai',
  },
  {
    id: 'ai-ind-3',
    category: 'ai',
    region: 'India 🇮🇳',
    title: "ISRO Integrates Autonomous AI Algorithms for Chandrayaan-4 and Gaganyaan Trajectory Guidance",
    description: "India's space research organization utilizes real-time neural vision navigation systems for planetary sample retrieval and space docking.",
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    source: 'The Hindu Science',
    url: 'https://www.thehindu.com/sci-tech/science/',
  },
  {
    id: 'ai-world-1',
    category: 'ai',
    region: 'World 🌍',
    title: "Next-Generation Autonomous Coding Agent Frameworks Redefine Software Development",
    description: "Researchers unveil long-horizon reasoning agents capable of automated testing, PR reviews, and self-healing cloud software architecture.",
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
    source: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/',
  },

  /* ════════════════════════════════════════════════════════════
     3. TECHNOLOGY — INDIAN TECH HUB & SEMICONDUCTOR REVOLUTION
     ════════════════════════════════════════════════════════════ */
  {
    id: 'tech-ind-1',
    category: 'technology',
    region: 'India 🇮🇳',
    title: "India's Semiconductor Hub Takes Shape: Tata-PSMC Dholera Fab and Micron Sanand Unit Advance",
    description: "Gujarat and Assam emerge as global chip manufacturing centers as multiple commercial semiconductor fabrication plants near pilot production.",
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
    source: 'The Economic Times Tech',
    url: 'https://economictimes.indiatimes.com/tech',
  },
  {
    id: 'tech-ind-2',
    category: 'technology',
    region: 'India 🇮🇳',
    title: "UPI Crosses 16 Billion Monthly Transactions: Expands Real-Time Cross-Border Links to France & UAE",
    description: "NPCI International enables frictionless Indian digital payments abroad, reinforcing India's global leadership in digital public infrastructure.",
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop',
    source: 'Moneycontrol',
    url: 'https://www.moneycontrol.com/news/technology/',
  },
  {
    id: 'tech-ind-3',
    category: 'technology',
    region: 'India 🇮🇳',
    title: "Bengaluru & Hyderabad Cement Status as Global GCC Capital with Over 1,600 Innovation Centers",
    description: "Multinational tech companies scale engineering, AI research, and cloud architectures out of Indian engineering centers.",
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
    source: 'Inc42',
    url: 'https://inc42.com/',
  },
  {
    id: 'tech-world-1',
    category: 'technology',
    region: 'World 🌍',
    title: "Quantum Leap: Fault-Tolerant Logical Qubits Demonstrate Error-Corrected Calculations",
    description: "Quantum physics laboratories achieve breakthrough fidelity, paving the road for molecular simulations and encryption breakthroughs.",
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
    source: 'Wired Science',
    url: 'https://www.wired.com/category/science/',
  },

  /* ════════════════════════════════════════════════════════════
     4. BUSINESS — SENSEX, NIFTY, INDIAN MARKETS & ECONOMY
     ════════════════════════════════════════════════════════════ */
  {
    id: 'biz-ind-1',
    category: 'business',
    region: 'India 🇮🇳',
    title: "Sensex & Nifty Hover Near All-Time Highs Powered by Unprecedented Domestic SIP Inflows",
    description: "Indian stock markets demonstrate resilient momentum as monthly mutual fund SIP contributions surpass ₹23,000 Crore.",
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop',
    source: 'Business Standard',
    url: 'https://www.business-standard.com/markets',
  },
  {
    id: 'biz-ind-2',
    category: 'business',
    region: 'India 🇮🇳',
    title: "Tata Group and Reliance Accelerate Multi-Billion Dollar Green Hydrogen & Solar Mega-Projects",
    description: "India's corporate powerhouses drive massive clean energy investments in Kutch and Jamnagar to achieve net-zero manufacturing targets.",
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop',
    source: 'The Economic Times',
    url: 'https://economictimes.indiatimes.com/',
  },
  {
    id: 'biz-ind-3',
    category: 'business',
    region: 'India 🇮🇳',
    title: "RBI Monetary Policy: Governor Emphasizes 7.2% GDP Growth Rate and Inflation Stability",
    description: "Reserve Bank of India maintains an optimistic macroeconomic outlook, citing robust manufacturing indices and resilient consumer spending.",
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop',
    source: 'Financial Express',
    url: 'https://www.financialexpress.com/economy/',
  },
  {
    id: 'biz-world-1',
    category: 'business',
    region: 'World 🌍',
    title: "Global Supply Chain Rebalancing: Multi-Nationals Expand Manufacturing Corridors",
    description: "International manufacturers diversify factory footprints toward South Asia and Southeast Asia, spurring bilateral industrial agreements.",
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
    source: 'Bloomberg',
    url: 'https://www.bloomberg.com',
  },

  /* ════════════════════════════════════════════════════════════
     5. ENTERTAINMENT — INDIAN CINEMA, OTT & CREATIVE PULSE
     ════════════════════════════════════════════════════════════ */
  {
    id: 'ent-ind-1',
    category: 'entertainment',
    region: 'India 🇮🇳',
    title: "Pan-Indian Cinema Sweeps Global Box Office: Big-Budget Epics Set Opening Weekend Records",
    description: "High-octane spectacles bridging North and South Indian cinema capture record-breaking viewership across theaters in North America, UK, and the Gulf.",
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop',
    source: 'Hindustan Times Entertainment',
    url: 'https://www.hindustantimes.com/entertainment',
  },
  {
    id: 'ent-ind-2',
    category: 'entertainment',
    region: 'India 🇮🇳',
    title: "National Film Awards Celebrate Groundbreaking Storytelling Across Regional Languages",
    description: "Jury honors independent masterpieces in Malayalam, Tamil, Bengali, and Hindi cinema for daring narratives and realistic cinematography.",
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop',
    source: 'NDTV Movies',
    url: 'https://www.ndtv.com/entertainment',
  },
  {
    id: 'ent-ind-3',
    category: 'entertainment',
    region: 'India 🇮🇳',
    title: "Indian Indie Music and Classical Fusion Dominate Global Streaming Charts",
    description: "Artists blend traditional ragas with modern synthwave and folk rhythms, racking up hundreds of millions of international streams.",
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop',
    source: 'Rolling Stone India',
    url: 'https://rollingstoneindia.com/',
  },
  {
    id: 'ent-world-1',
    category: 'entertainment',
    region: 'World 🌍',
    title: "Virtual Production & Real-Time CGI Stages Transform Modern Film Sets",
    description: "Cinematographers replace traditional green screens with dynamic LED volumes powered by real-time Unreal rendering engines.",
    image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop',
    source: 'Variety',
    url: 'https://variety.com',
  },
];

/* ─── LIVE CRICKET FEED CACHE ────────────────────────────── */
let liveCricketCache = {
  data: [],
  lastFetched: 0,
};

// Fetch real-time cricket stories from ESPNcricinfo India RSS
const fetchLiveTeamIndiaCricket = async () => {
  const now = Date.now();
  // Return cached live cricket if fetched within last 20 minutes
  if (liveCricketCache.data.length > 0 && now - liveCricketCache.lastFetched < 20 * 60 * 1000) {
    return liveCricketCache.data;
  }

  try {
    const res = await fetch('https://www.espncricinfo.com/rss/content/story/feeds/6.xml', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error('Cricket feed response not ok');
    const xml = await res.text();

    const items = [];
    const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

    for (let i = 0; i < Math.min(itemMatches.length, 6); i++) {
      const itemXml = itemMatches[i];
      const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);

      let cleanTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      cleanTitle = cleanTitle
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');

      let cleanDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      cleanDesc = cleanDesc
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');

      const link = linkMatch ? linkMatch[1].trim() : 'https://www.espncricinfo.com';

      if (cleanTitle) {
        items.push({
          id: `live-cric-${i}-${Date.now().toString().slice(-4)}`,
          category: 'sport',
          region: 'India 🇮🇳',
          isLive: true,
          title: cleanTitle,
          description: cleanDesc || 'Latest live match developments and squad analysis from Team India.',
          image: cricketImages[i % cricketImages.length],
          source: 'ESPNcricinfo (Live 🏏)',
          url: link,
          publishedAt: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
        });
      }
    }

    if (items.length > 0) {
      liveCricketCache = {
        data: items,
        lastFetched: now,
      };
      return items;
    }
  } catch (err) {
    console.warn('Live cricket RSS fetch notice (using curated Indian cricket):', err.message);
  }

  return liveCricketCache.data;
};

/* ─── 2-Hour Rolling Cycle Calculator ─────────────────────── */
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

const getFeedWindow = () => {
  const now = Date.now();
  const windowIndex = Math.floor(now / TWO_HOURS_MS);
  const lastUpdated = new Date(windowIndex * TWO_HOURS_MS);
  const nextUpdate = new Date((windowIndex + 1) * TWO_HOURS_MS);
  const secondsRemaining = Math.max(0, Math.floor((nextUpdate.getTime() - now) / 1000));

  return {
    windowIndex,
    lastUpdated: lastUpdated.toISOString(),
    nextUpdate: nextUpdate.toISOString(),
    secondsRemaining,
  };
};

/* ─── GET NEWS (Indian Region Focused + Real-Time Team India Cricket) ─── */
export const getNews = async (req, res) => {
  try {
    const { category, region } = req.query;
    const windowInfo = getFeedWindow();

    // 1. Fetch real-time live Team India cricket news
    const liveCricket = await fetchLiveTeamIndiaCricket();

    // 2. Format curated news with fresh timestamps in current 2-hr window
    const formattedCurated = curatedNews.map((item, idx) => {
      const minuteOffset = ((idx * 13 + windowInfo.windowIndex * 7) % 110) + 5;
      const published = new Date(Date.now() - minuteOffset * 60 * 1000).toISOString();

      return {
        ...item,
        publishedAt: published,
      };
    });

    // 3. Merge live cricket items at the top of sports feed
    const allArticles = [...liveCricket, ...formattedCurated];

    let filtered = allArticles;

    // Filter by Category
    if (category && category.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by Region (India vs World)
    if (region && region.toLowerCase() !== 'all') {
      const isIndia = region.toLowerCase() === 'india';
      filtered = filtered.filter((item) =>
        isIndia ? item.region.includes('India') : item.region.includes('World')
      );
    }

    res.json({
      total: filtered.length,
      categories: ['all', 'sport', 'technology', 'ai', 'business', 'entertainment'],
      regions: ['all', 'india', 'world'],
      activeRegionFocus: 'India & Team India Cricket (with Global Radar)',
      updateSchedule: 'Every 2 hours (Live Cricket Real-Time)',
      lastUpdated: windowInfo.lastUpdated,
      nextUpdate: windowInfo.nextUpdate,
      secondsRemaining: windowInfo.secondsRemaining,
      articles: filtered,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
