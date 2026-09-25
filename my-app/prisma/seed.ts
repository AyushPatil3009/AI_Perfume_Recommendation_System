import { PrismaClient, GenderTarget, NoteCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding for Perfume Recommendation Platform...');

  // 1. Clean existing data
  await prisma.recommendationLog.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.perfumeNote.deleteMany();
  await prisma.perfume.deleteMany();
  await prisma.fragranceNote.deleteMany();
  await prisma.brand.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // 2. Create Brands
  const brandData = [
    { name: 'Dior', slug: 'dior', description: 'French luxury fashion house founded in 1946 by Christian Dior.' },
    { name: 'Chanel', slug: 'chanel', description: 'Iconic French haute couture luxury house founded by Coco Chanel.' },
    { name: 'Tom Ford', slug: 'tom-ford', description: 'American luxury fashion house known for glamorous, sensual fragrances.' },
    { name: 'Creed', slug: 'creed', description: 'Anglo-French luxury perfume house renowned for royal heritage scents.' },
    { name: 'Maison Francis Kurkdjian', slug: 'mfk', description: 'Parisian niche luxury perfume house famous for modern artistic creations.' },
    { name: 'Yves Saint Laurent', slug: 'ysl', description: 'Parisian luxury fashion house known for bold, elegant fragrances.' },
    { name: 'Parfums de Marly', slug: 'parfums-de-marly', description: 'Haute Parfumerie recreating the splendor of the 18th century French court.' },
    { name: 'Giorgio Armani', slug: 'giorgio-armani', description: 'Italian luxury brand famous for fresh aquatic and refined scents.' },
  ];

  const createdBrands: Record<string, string> = {};
  for (const b of brandData) {
    const brand = await prisma.brand.create({ data: b });
    createdBrands[b.slug] = brand.id;
  }
  console.log(`✅ Created ${Object.keys(createdBrands).length} luxury brands.`);

  // 3. Create Fragrance Notes
  const notesData = [
    // Citrus / Fresh
    { name: 'Calabrian Bergamot', slug: 'calabrian-bergamot', family: 'Citrus', description: 'Sparkling, crisp citrus note with light floral nuance.' },
    { name: 'Lemon', slug: 'lemon', family: 'Citrus', description: 'Zesty, energetic citrus note.' },
    { name: 'Grapefruit', slug: 'grapefruit', family: 'Citrus', description: 'Bittersweet, invigorating fresh citrus.' },
    { name: 'Mandarin Orange', slug: 'mandarin-orange', family: 'Citrus', description: 'Juicy, sweet citrus note.' },
    
    // Floral
    { name: 'Jasmine', slug: 'jasmine', family: 'Floral', description: 'Rich, intoxicating white floral note.' },
    { name: 'Damask Rose', slug: 'damask-rose', family: 'Floral', description: 'Opulent, romantic velvety rose.' },
    { name: 'Lavender', slug: 'lavender', family: 'Floral', description: 'Clean, aromatic herbaceous floral note.' },
    { name: 'Iris', slug: 'iris', family: 'Floral', description: 'Powdery, elegant, earthy floral.' },

    // Woody / Earthy
    { name: 'Cedarwood', slug: 'cedarwood', family: 'Woody', description: 'Dry, pencil-shaving woody note providing structure.' },
    { name: 'Sandalwood', slug: 'sandalwood', family: 'Woody', description: 'Creamy, warm, soothing precious wood.' },
    { name: 'Vetiver', slug: 'vetiver', family: 'Woody', description: 'Smoky, earthy, green rooty note.' },
    { name: 'Oud (Agarwood)', slug: 'oud', family: 'Woody', description: 'Precious, dark, resinous, smoky oriental wood.' },
    { name: 'Patchouli', slug: 'patchouli', family: 'Woody', description: 'Dark, earthy, sweet herbaceous leaf.' },

    // Gourmand / Warm / Amber
    { name: 'Bourbon Vanilla', slug: 'bourbon-vanilla', family: 'Gourmand', description: 'Rich, warm, sweet pods with balsamic nuances.' },
    { name: 'Tonka Bean', slug: 'tonka-bean', family: 'Gourmand', description: 'Sweet almond-tobacco-vanilla accord.' },
    { name: 'Amber', slug: 'amber', family: 'Amber', description: 'Warm, resinous, cozy oriental accord.' },
    { name: 'Cognac / Rum', slug: 'cognac-rum', family: 'Gourmand', description: 'Warmboozy, oak-barreled liquor note.' },
    { name: 'Cardamom', slug: 'cardamom', family: 'Spicy', description: 'Warm, aromatic, eucalyptus-spiced pods.' },

    // Fresh / Marine / Synthetic Accords
    { name: 'Ambroxan', slug: 'ambroxan', family: 'Amber', description: 'Modern woody-ambergris synthetic providing immense sillage.' },
    { name: 'Sea Salt & Marine Notes', slug: 'sea-salt-marine', family: 'Aquatic', description: 'Breezy ocean air and salty water accords.' },
    { name: 'Pineapple', slug: 'pineapple', family: 'Fruity', description: 'Juicy, smoky tropical fruit note.' },
  ];

  const createdNotes: Record<string, string> = {};
  for (const n of notesData) {
    const note = await prisma.fragranceNote.create({ data: n });
    createdNotes[n.slug] = note.id;
  }
  console.log(`✅ Created ${Object.keys(createdNotes).length} fragrance notes.`);

  // 4. Create Curated Perfumes with Pyramid Notes & Affiliate Links
  const perfumes = [
    {
      title: 'Sauvage Eau de Parfum',
      slug: 'dior-sauvage-edp',
      brandSlug: 'dior',
      gender: GenderTarget.MALE,
      priceRange: '$$$',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop',
      description: 'A sensual interpretation with warm bergamot, smoky vanilla, and ambroxan. Spicy, mysterious, and effortlessly magnetic for evening wear.',
      seasonSummer: 6, seasonWinter: 9, seasonSpring: 7, seasonAutumn: 9,
      occasionOffice: 7, occasionDateNight: 10, occasionCasual: 8, occasionParty: 9,
      amazonUrl: 'https://www.amazon.com/dp/B078WZ6N31',
      flipkartUrl: 'https://www.flipkart.com/p/itm12345678',
      officialUrl: 'https://www.dior.com/en_us/beauty/products/sauvage',
      topNotes: ['calabrian-bergamot'],
      heartNotes: ['lavender', 'cardamom'],
      baseNotes: ['bourbon-vanilla', 'ambroxan', 'cedarwood']
    },
    {
      title: 'Bleu de Chanel Eau de Parfum',
      slug: 'bleu-de-chanel-edp',
      brandSlug: 'chanel',
      gender: GenderTarget.MALE,
      priceRange: '$$$',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop',
      description: 'An aromatic woody fragrance with captivating grapefruit, amber, and incense notes. The ultimate versatile signature scent for modern gentlemen.',
      seasonSummer: 8, seasonWinter: 7, seasonSpring: 9, seasonAutumn: 8,
      occasionOffice: 10, occasionDateNight: 9, occasionCasual: 9, occasionParty: 8,
      amazonUrl: 'https://www.amazon.com/dp/B00P145H0Y',
      flipkartUrl: 'https://www.flipkart.com/p/itm87654321',
      officialUrl: 'https://www.chanel.com/us/fragrance/p/107360/bleu-de-chanel-eau-de-parfum-spray',
      topNotes: ['grapefruit', 'lemon'],
      heartNotes: ['mint', 'jasmine'],
      baseNotes: ['sandalwood', 'cedarwood', 'amber']
    },
    {
      title: 'Baccarat Rouge 540',
      slug: 'mfk-baccarat-rouge-540',
      brandSlug: 'mfk',
      gender: GenderTarget.UNISEX,
      priceRange: '$$$$',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop',
      description: 'A luminous and intense fragrance laying on the skin like an amber floral breeze with saffron, jasmine, and cedarwood warmth.',
      seasonSummer: 5, seasonWinter: 10, seasonSpring: 7, seasonAutumn: 10,
      occasionOffice: 6, occasionDateNight: 10, occasionCasual: 6, occasionParty: 10,
      amazonUrl: 'https://www.amazon.com/dp/B01BML3JIK',
      flipkartUrl: 'https://www.flipkart.com/p/itmmfk54321',
      officialUrl: 'https://www.franciskurkdjian.com/us-en/p/baccarat-rouge-540',
      topNotes: ['jasmine'],
      heartNotes: ['amber', 'cardamom'],
      baseNotes: ['cedarwood', 'ambroxan']
    },
    {
      title: 'Creed Aventus',
      slug: 'creed-aventus',
      brandSlug: 'creed',
      gender: GenderTarget.MALE,
      priceRange: '$$$$',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
      description: 'The legendary fruity-smoky fragrance opening with tart pineapple and bergamot, backed by birch wood and oakmoss authority.',
      seasonSummer: 9, seasonWinter: 6, seasonSpring: 10, seasonAutumn: 8,
      occasionOffice: 9, occasionDateNight: 9, occasionCasual: 9, occasionParty: 9,
      amazonUrl: 'https://www.amazon.com/dp/B00475E84M',
      flipkartUrl: 'https://www.flipkart.com/p/itmcreed123',
      officialUrl: 'https://creedfragrance.com/products/aventus',
      topNotes: ['pineapple', 'calabrian-bergamot'],
      heartNotes: ['patchouli', 'jasmine'],
      baseNotes: ['oakmoss', 'amber', 'vanilla']
    },
    {
      title: 'Tobacco Vanille',
      slug: 'tom-ford-tobacco-vanille',
      brandSlug: 'tom-ford',
      gender: GenderTarget.UNISEX,
      priceRange: '$$$$',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop',
      description: 'Opulent, warm, and iconic. Reminiscent of an English Gentlemen’s Club, blended with rich tobacco leaf, aromatic spices, and sweet bourbon vanilla.',
      seasonSummer: 2, seasonWinter: 10, seasonSpring: 4, seasonAutumn: 10,
      occasionOffice: 4, occasionDateNight: 10, occasionCasual: 5, occasionParty: 9,
      amazonUrl: 'https://www.amazon.com/dp/B002ZCDV5S',
      flipkartUrl: 'https://www.flipkart.com/p/itmtf123456',
      officialUrl: 'https://www.tomfordbeauty.com/product/tobacco-vanille-eau-de-parfum',
      topNotes: ['cardamom'],
      heartNotes: ['tonka-bean', 'cognac-rum'],
      baseNotes: ['bourbon-vanilla', 'wood']
    },
    {
      title: 'Acqua Di Giò Profondo',
      slug: 'giorgio-armani-acqua-di-gio-profondo',
      brandSlug: 'giorgio-armani',
      gender: GenderTarget.MALE,
      priceRange: '$$$',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=800&auto=format&fit=crop',
      description: 'A captivating deep marine fragrance awakening the senses with green mandarin, sea salt marine accords, and woody patchouli.',
      seasonSummer: 10, seasonWinter: 3, seasonSpring: 9, seasonAutumn: 5,
      occasionOffice: 8, occasionDateNight: 7, occasionCasual: 10, occasionParty: 7,
      amazonUrl: 'https://www.amazon.com/dp/B085V86Q68',
      flipkartUrl: 'https://www.flipkart.com/p/itmadg99999',
      officialUrl: 'https://www.giorgioarmanibeauty-usa.com/fragrance/mens-fragrances/acqua-di-gio/acqua-di-gio-profondo-eau-de-parfum',
      topNotes: ['mandarin-orange', 'sea-salt-marine'],
      heartNotes: ['lavender'],
      baseNotes: ['patchouli', 'amber']
    },
    {
      title: 'Parfums de Marly Delina',
      slug: 'parfums-de-marly-delina',
      brandSlug: 'parfums-de-marly',
      gender: GenderTarget.FEMALE,
      priceRange: '$$$$',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
      description: 'A charming and firmly modern floral bouquet. A sensual accord centered around Turkish damask rose, lychee, peony, and creamy vanilla.',
      seasonSummer: 8, seasonWinter: 5, seasonSpring: 10, seasonAutumn: 7,
      occasionOffice: 8, occasionDateNight: 10, occasionCasual: 9, occasionParty: 9,
      amazonUrl: 'https://www.amazon.com/dp/B073X2S7Z4',
      flipkartUrl: 'https://www.flipkart.com/p/itmpdm888',
      officialUrl: 'https://parfums-de-marly.com/products/delina',
      topNotes: ['calabrian-bergamot'],
      heartNotes: ['damask-rose', 'peony'],
      baseNotes: ['bourbon-vanilla', 'cedarwood']
    },
    {
      title: 'YSL Libre Intense',
      slug: 'ysl-libre-intense',
      brandSlug: 'ysl',
      gender: GenderTarget.FEMALE,
      priceRange: '$$$',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=800&auto=format&fit=crop',
      description: 'The fragrance of an instinctual, wild, and free woman. Grandiflorum jasmine and French lavender wrapped in smoldering orchid vanilla.',
      seasonSummer: 4, seasonWinter: 10, seasonSpring: 6, seasonAutumn: 9,
      occasionOffice: 7, occasionDateNight: 10, occasionCasual: 6, occasionParty: 10,
      amazonUrl: 'https://www.amazon.com/dp/B08HMDKM1P',
      flipkartUrl: 'https://www.flipkart.com/p/itmysl777',
      officialUrl: 'https://www.yslbeautyus.com/fragrance/womens-fragrance/libre/libre-eau-de-parfum-intense',
      topNotes: ['mandarin-orange', 'lavender'],
      heartNotes: ['jasmine'],
      baseNotes: ['bourbon-vanilla', 'tonka-bean', 'amber']
    }
  ];

  for (const p of perfumes) {
    const { topNotes, heartNotes, baseNotes, brandSlug, ...perfumeFields } = p;
    
    const createdPerfume = await prisma.perfume.create({
      data: {
        ...perfumeFields,
        brandId: createdBrands[brandSlug],
      }
    });

    // Link Top Notes
    for (const noteSlug of topNotes) {
      if (createdNotes[noteSlug]) {
        await prisma.perfumeNote.create({
          data: {
            perfumeId: createdPerfume.id,
            noteId: createdNotes[noteSlug],
            type: NoteCategory.TOP,
          }
        });
      }
    }

    // Link Heart Notes
    for (const noteSlug of heartNotes) {
      if (createdNotes[noteSlug]) {
        await prisma.perfumeNote.create({
          data: {
            perfumeId: createdPerfume.id,
            noteId: createdNotes[noteSlug],
            type: NoteCategory.HEART,
          }
        });
      }
    }

    // Link Base Notes
    for (const noteSlug of baseNotes) {
      if (createdNotes[noteSlug]) {
        await prisma.perfumeNote.create({
          data: {
            perfumeId: createdPerfume.id,
            noteId: createdNotes[noteSlug],
            type: NoteCategory.BASE,
          }
        });
      }
    }
  }

  console.log(`✅ Created ${perfumes.length} full perfume records with notes & affiliate links.`);
  console.log('🚀 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
