import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import Blog from "@/models/blog";

export async function POST(req: Request) {
  try {
    await ConnectDB();

    // 1. Data parse karein (Agar Postman se bhej rahe hain)
    // Agar aap data isi file mein likhna chahte hain, toh 'req.json()' wali line hata dein
    const blogsData = [
  {
    "title": "Wheat Cultivation: Best Practices for Bumper Yield",
    "titleUrdu": "گندم کی کاشت: بمپر پیداوار کے لیے بہترین طریقے",
    "slug": "wheat-cultivation-bumper-yield-guide",
    "slugUrdu": "گندم-کی-کاشت-بہترین-طریقے",
    "subCategory": "Trending",
    "status": "Active",
    "author": "Asim Raza",
    "category": "Agri-Tech",
    "content": "<h2>Maximize Your Harvest</h2><p>Using certified seeds and timely irrigation is key to a successful wheat season. Farmers should focus on balanced fertilizer use to ensure healthy grain development.</p>",
    "contentUrdu": "<h2>اپنی فصل کی پیداوار بڑھائیں</h2><p>تصدیق شدہ بیجوں کا استعمال اور بروقت آبیاری گندم کے کامیاب سیزن کی بنیاد ہے۔ کسانوں کو اناج کی صحت مند نشوونما کے لیے کھاد کے متوازن استعمال پر توجہ دینی چاہیے۔</p>",
    "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800",
    "createdAt": new Date("2026-01-23T09:00:00Z")
  },
  {
    "title": "Poultry Farming: Management Tips for Beginners",
    "titleUrdu": "پولٹری فارمنگ: نئے حضرات کے لیے انتظام کے طریقے",
    "slug": "poultry-farming-management-beginners",
    "slugUrdu": "پولٹری-فارمنگ-انتظام-کے-طریقے",
    "subCategory": "Trending",
    "status": "Active",
    "author": "Dr. Irfan",
    "category": "Agri-Tech",
    "content": "<h2>Start Your Poultry Business</h2><p>Ventilation and temperature control are the most critical factors in poultry success. Proper vaccination schedules help prevent common diseases in flocks.</p>",
    "contentUrdu": "<h2>پولٹری کا کاروبار شروع کریں</h2><p>پولٹری کی کامیابی میں ہوا کی آمد و رفت اور درجہ حرارت کا کنٹرول سب سے اہم عوامل ہیں۔ ویکسینیشن کا درست شیڈول بیماریوں سے بچاؤ میں مدد دیتا ہے۔</p>",
    "image": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800",
    "createdAt": new Date("2026-01-23T11:30:00Z")
  },
  {
    "title": "Drip Irrigation: Saving Water in Modern Agriculture",
    "titleUrdu": "ڈریپ اریگیشن: جدید زراعت میں پانی کی بچت",
    "slug": "drip-irrigation-water-saving-technology",
    "slugUrdu": "ڈریپ-اریگیشن-پانی-کی-بچت",
    "subCategory": "Trending",
    "status": "Active",
    "author": "Sami Ullah",
    "category": "Agri-Tech",
    "content": "<h2>Efficient Water Usage</h2><p>Drip irrigation delivers water directly to the plant roots, reducing wastage by 60%. It is highly effective for orchards and vegetable farms.</p>",
    "contentUrdu": "<h2>پانی کا موثر استعمال</h2><p>ڈریپ اریگیشن پانی کو براہ راست پودوں کی جڑوں تک پہنچاتی ہے، جس سے ضیاع میں 60 فیصد تک کمی آتی ہے۔ یہ باغات اور سبزیوں کے لیے انتہائی موثر ہے۔</p>",
    "image": "https://images.unsplash.com/photo-1592919016381-99f36bc1d61c?q=80&w=800",
    "createdAt": new Date("2026-01-24T08:00:00Z")
  },
  {
    "title": "Cotton Pests: Identification and Control Measures",
    "titleUrdu": "کپاس کے کیڑے: پہچان اور بچاؤ کی تدابیر",
    "slug": "cotton-pests-identification-control",
    "slugUrdu": "کپاس-کے-کیڑے-بچاؤ-کی-تدابیر",
    "subCategory": "Trending",
    "status": "Active",
    "author": "Zainab Ali",
    "category": "Agri-Tech",
    "content": "<h2>Protect Your White Gold</h2><p>Whitefly and Pink Bollworm are the biggest threats to cotton. Integrated Pest Management (IPM) is the best way to control them without excessive chemicals.</p>",
    "contentUrdu": "<h2>اپنے سفید سونے کی حفاظت کریں</h2><p>سفید مکھی اور گلابی سنڈی کپاس کے لیے سب سے بڑا خطرہ ہیں۔ ان کو کنٹرول کرنے کے لیے آئی پی ایم (IPM) بہترین طریقہ ہے۔</p>",
    "image": "https://images.unsplash.com/photo-1594900030502-12502685957d?q=80&w=800",
    "createdAt": new Date("2026-01-24T10:00:00Z")
  },
  {
    "title": "Tunnel Farming: Growing Off-Season Vegetables",
    "titleUrdu": "ٹنل فارمنگ: بے موسمی سبزیاں اگانے کا طریقہ",
    "slug": "tunnel-farming-off-season-vegetables",
    "slugUrdu": "ٹنل-فارمنگ-بے-موسمی-سبزیاں",
    "subCategory": "Trending",
    "status": "Active",
    "author": "Waleed Khan",
    "category": "Agriculture",
    "content": "<h2>Year-Round Production</h2><p>Tunnel farming allows farmers to grow summer vegetables like cucumbers and capsicum in winter, fetching high market prices during the off-season.</p>",
    "contentUrdu": "<h2>سال بھر پیداوار</h2><p>ٹنل فارمنگ کسانوں کو سردیوں میں گرمیوں کی سبزیاں جیسے کھیرا اور شملہ مرچ اگانے کی اجازت دیتی ہے، جس سے مارکیٹ میں اچھی قیمت ملتی ہے۔</p>",
    "image": "https://images.unsplash.com/photo-1585499193151-0f1eecf4f3bc?q=80&w=800",
    "createdAt": new Date("2026-01-25T09:15:00Z")
  },
  {
    "title": "Citrus Care: How to Get Large and Sweet Fruit",
    "titleUrdu": "کینو کی دیکھ بھال: بڑے اور میٹھے پھل حاصل کرنے کا طریقہ",
    "slug": "citrus-care-sweet-fruit-tips",
    "slugUrdu": "کینو-کی-دیکھ-بھال-میٹھے-پھل",
    "subCategory": "Trending",
    "status": "Active",
    "author": "Hassan Raza",
    "category": "Agri-Tech",
    "content": "<h2>Boost Your Citrus Yield</h2><p>Pruning and proper potassium application are vital for citrus trees. Protecting the trees from citrus canker ensures high-quality export-grade fruit.</p>",
    "contentUrdu": "<h2>کینو کی پیداوار بڑھائیں</h2><p>درختوں کی کانٹ چھانٹ اور پوٹاش کا درست استعمال بہت ضروری ہے۔ سٹرس کینکر سے بچاؤ ایکسپورٹ کوالٹی کا پھل یقینی بناتا ہے۔</p>",
    "image": "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=800",
    "createdAt": new Date("2026-01-25T14:00:00Z")
  },
  {
    "title": "Fish Farming: A Profitable Venture in Punjab",
    "titleUrdu": "فش فارمنگ: پنجاب میں منافع بخش کاروبار",
    "slug": "fish-farming-profitable-business-punjab",
    "slugUrdu": "فش-فارمنگ-منافع-بخش-کاروبار",
    "subCategory": "Trending",
    "status": "Active",
    "author": "Umar Hayat",
    "category": "Agriculture",
    "content": "<h2>Blue Revolution</h2><p>Pond management and water quality are key in aquaculture. Tilapia and Rohu are popular breeds that grow fast and have high market demand.</p>",
    "contentUrdu": "<h2>بلیو ریولوشن</h2><p>فش فارمنگ میں تالاب کا انتظام اور پانی کی کوالٹی کلیدی حیثیت رکھتی ہے۔ تلاپیہ اور راہو تیزی سے بڑھنے والی مشہور نسلیں ہیں۔</p>",
    "image": "https://images.unsplash.com/photo-1524147023055-5c162fd4866c?q=80&w=800",
    "createdAt": new Date("2026-01-26T10:45:00Z")
  },
  {
    "title": "Vertical Farming: Agriculture in the Modern City",
    "titleUrdu": "ورٹیکل فارمنگ: جدید شہروں میں زراعت",
    "slug": "vertical-farming-urban-agriculture",
    "slugUrdu": "ورٹیکل-فارمنگ-شہری-زراعت",
    "subCategory": "Trending",
    "status": "Active",
    "author": "Sara Ahmed",
    "category": "Agri-Tech",
    "content": "<h2>The Sky is the Limit</h2><p>Vertical farming uses stacked layers to grow food in controlled environments. It uses 95% less land and is perfect for feeding growing urban populations.</p>",
    "contentUrdu": "<h2>جدید شہری کاشتکاری</h2><p>ورٹیکل فارمنگ میں تہوں کی صورت میں خوراک اگائی جاتی ہے۔ یہ زمین کا 95 فیصد کم استعمال کرتی ہے اور شہروں کے لیے بہترین ہے۔</p>",
    "image": "https://images.unsplash.com/photo-1585499193151-0f1eecf4f3bc?q=80&w=800",
    "createdAt": new Date("2026-01-26T13:00:00Z")
  },
  {
    "title": "Soil Testing: Why Every Farmer Needs It",
    "titleUrdu": "زمین کا تجزیہ: ہر کسان کو اس کی ضرورت کیوں ہے",
    "slug": "soil-testing-importance-farmers",
    "slugUrdu": "زمین-کا-تجزیہ-اہمیت",
    "subCategory": "Trending",
    "status": "Active",
    "author": "Dr. Amna",
    "category": "Sustainability",
    "content": "<h2>Know Your Soil</h2><p>Soil testing reveals the nutrient levels of your land. This helps farmers apply only the necessary fertilizers, saving money and protecting the environment.</p>",
    "contentUrdu": "<h2>اپنی زمین کو پہچانیں</h2><p>زمین کا تجزیہ غذائی اجزاء کی سطح بتاتا ہے۔ اس سے کسانوں کو صرف ضروری کھاد ڈالنے میں مدد ملتی ہے، جس سے پیسے کی بچت ہوتی ہے۔</p>",
    "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800",
    "createdAt": new Date("2026-01-27T08:30:00Z")
  },
  {
    "title": "Organic Honey Production: Challenges and Rewards",
    "titleUrdu": "نامیاتی شہد کی تیاری: چیلنجز اور فوائد",
    "slug": "organic-honey-production-guide",
    "slugUrdu": "نامیاتی-شہد-کی-تیاری",
    "subCategory": "Trending",
    "status": "Active",
    "author": "Bilal Siddiqui",
    "category": "Agriculture",
    "content": "<h2>Pure and Profitable</h2><p>Organic honey fetches a premium price in international markets. Avoiding antibiotics and pesticides in beekeeping is essential for organic certification.</p>",
    "contentUrdu": "<h2>خالص اور منافع بخش</h2><p>نامیاتی شہد کی عالمی منڈیوں میں بہت قیمت ہے۔ آرگینک سرٹیفیکیشن کے لیے کیڑے مار ادویات سے پرہیز لازمی ہے۔</p>",
    "image": "https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?q=80&w=800",
    "createdAt": new Date("2026-01-27T11:00:00Z")
  }
]
    if (!blogsData || blogsData.length === 0) {
      return NextResponse.json({ success: false, message: "No data provided" }, { status: 400 });
    }

    // 2. Data insert karein
    const result = await Blog.insertMany(blogsData);

    return NextResponse.json({ 
      success: true, 
      message: `${result.length} Blogs successfully inserted!`,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Insertion Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}