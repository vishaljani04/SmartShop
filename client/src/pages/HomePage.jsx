import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiArrowRight } from 'react-icons/hi';
import api from '../services/api';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector(state => state.products);
  const [partnerProducts, setPartnerProducts] = useState([]);
  const [loadingPartner, setLoadingPartner] = useState(true);

  // Robust Logo Dictionary with highly reliable PNG versions
  const BRAND_LOGOS = {
    'Amazon': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    'Flipkart': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Flipkart_logo.svg',
    'Samsung': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1024px-Samsung_Logo.svg.png',
    'Apple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    'Myntra': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png',
    'Reliance Digital': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Reliance_Digital_Logo.svg/1024px-Reliance_Digital_Logo.svg.png',
    'Croma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Croma_Logo.svg/1024px-Croma_Logo.svg.png',
    'Tata CLiQ': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Tata_Cliq_Logo.svg/1024px-Tata_Cliq_Logo.svg.png',
    'Ajio': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Logo_of_Ajio.png',
    'IKEA': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg',
    'Decathlon': 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Decathlon_Logo.svg',
    'Jiomart': 'https://upload.wikimedia.org/wikipedia/commons/9/91/JioMart_logo.svg',
    'Blinkit': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Blinkit_logo.svg/1024px-Blinkit_logo.svg.png',
    'Zomato': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Zomato_Logo.svg/1024px-Zomato_Logo.svg.png',
    'Swiggy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Swiggy_logo.svg/1024px-Swiggy_logo.svg.png',
    'Sony': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
    'LG': 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg',
    'HP': 'https://upload.wikimedia.org/wikipedia/commons/2/29/HP_New_Logo_2D.svg',
    'Dell': 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg',
    'Lenovo': 'https://upload.wikimedia.org/wikipedia/commons/1/13/Lenovo_Logo.svg',
    'Asus': 'https://upload.wikimedia.org/wikipedia/commons/d/de/Asus_Logo.svg',
    'Microsoft': 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    'Xiaomi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/1024px-Xiaomi_logo_%282021-%29.svg.png',
  };

  const [dynamicSellers, setDynamicSellers] = useState(
    Object.keys(BRAND_LOGOS).map(name => ({ name, logo: BRAND_LOGOS[name] }))
  );

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, featured: 'true' }));
    api.get('/products?hasGlobalPartner=true&limit=8')
      .then(res => {
        setPartnerProducts(res.data.products);
        setLoadingPartner(false);
      }).catch(() => setLoadingPartner(false));

    api.get('/products/global-partners')
      .then(res => {
        const fetchedPartners = res.data.partners;
        setDynamicSellers(prevSellers => {
          const currentNames = prevSellers.map(s => s.name.toLowerCase());
          const newOnes = fetchedPartners
            .filter(name => !currentNames.includes(name.toLowerCase()))
            .map(name => ({
              name,
              logo: BRAND_LOGOS[name] || `https://logo.clearbit.com/${name.toLowerCase().replace(/\s+/g, '')}.com`
            }));
          return [...prevSellers, ...newOnes];
        });
      }).catch(err => console.error(err));
  }, [dispatch]);

  const handleSearchFromHero = (e) => {
    e.preventDefault();
    const query = e.target.elements['hero-search'].value;
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const scrollingSellers = [...dynamicSellers, ...dynamicSellers, ...dynamicSellers, ...dynamicSellers];

  const testimonials = [
    { name: "Rahul Sharma", review: "SmartShop is a life saver! Best quality products ever.", rating: 5, role: "Verified Buyer" },
    { name: "Priya Malik", review: "I love how I can see amazing collections on one screen. Super fast interface!", rating: 5, role: "Regular User" },
    { name: "Amit Kumar", review: "The interface is super fast and clean. No annoying ads.", rating: 4, role: "Gadget Enthusiast" },
    { name: "Sneha Varma", review: "Shopping is so much easier now. Highly recommended tool for all shoppers!", rating: 5, role: "Daily Shopper" },
  ];

  const scrollingTestimonials = [...testimonials, ...testimonials];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Hero Section with Video Background */}
      <section style={styles.hero}>
        <video autoPlay muted loop playsInline preload="auto" disablePictureInPicture style={styles.heroVideo}>
          <source src="/Background.mp4" type="video/mp4" />
        </video>
        <div style={styles.heroOverlay}></div>

        <div className="container" style={styles.heroContent}>
          <h1 className="animate-fade-in" style={styles.title}>
            Shop <span style={styles.gradientText}>Smart</span> <br /> Live Better.
          </h1>

          <div style={styles.heroSearchContainer}>
            <form onSubmit={handleSearchFromHero} style={styles.heroSearchForm}>
              <input type="text" placeholder="Search for mobiles, laptops, electronics..." id="hero-search" style={styles.heroSearchInput} />
              <button type="submit" style={styles.heroSearchBtn}>Search</button>
            </form>
          </div>

          <p className="animate-fade-in" style={styles.subtitle}>
            Empowering millions to save on every purchase. The ultimate shopping destination.
          </p>
          <div style={styles.heroBadges}>
            <span>⭐ Premium Quality</span>
            <span>⚡ Fast Delivery</span>
          </div>
        </div>
      </section>



      {/* Featured Products Integrates SmartShop Logic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-black text-dark-900">Featured <span style={styles.gradientText}>Products</span></h2>
            <p className="text-dark-400 mt-2 text-lg">Handpicked deals just for you</p>
          </div>
          <Link to="/products" className="btn-secondary text-sm flex items-center space-x-1" style={{borderRadius: '100px', fontWeight: '800'}}>
            <span>View All</span>
            <HiArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading products..." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Global Partner Products Section */}
      {partnerProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50/50 rounded-3xl mb-16 mt-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-dark-900">Global <span style={styles.gradientText}>Partner</span> Products</h2>
              <p className="text-dark-400 mt-2 text-lg">Specially sourced deals from top global brands</p>
            </div>
          </div>
          {loadingPartner ? (
            <LoadingSpinner text="Loading Partner Products..." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {partnerProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Testimonials Section */}
      <section style={styles.testimonialSection}>
        <div className="container">
          <h2 style={{ ...styles.sectionTitle, color: 'white', marginBottom: '1rem' }}>User <span style={styles.gradientText}>Feedback</span></h2>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '3rem', fontSize: '1.2rem' }}>Trusted by millions of shoppers across India</p>
        </div>

        <div style={{ overflow: 'hidden', padding: '2rem 0' }}>
          <div className="testimonial-ticker">
            {scrollingTestimonials.map((t, i) => (
              <div key={i} className="testimonial-card-item">
                <div style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '0.25rem' }}>
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>
                <p style={styles.reviewText}>"{t.review}"</p>

                <div className="user-meta">
                  <div className="user-avatar" style={{background: 'linear-gradient(135deg, #6366f1, #ec4899)'}}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="user-info">
                    <span className="user-name" style={{color: 'white', fontWeight: '800'}}>{t.name}</span>
                    <span className="user-role" style={{display:'block', color: '#94a3b8', fontSize: '0.85rem'}}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Partners Ticker Section */}
      <section id="brands" style={styles.tickerSection}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Global <span style={styles.gradientText}>Partners</span></h2>
        </div>
        <div className="scroll-wrapper">
          <div className="scroll-container">
            {scrollingSellers.map((seller, i) => (
              <div key={i} className="seller-logo-item">
                {seller.logo.includes('ui-avatars') ? (
                  <span className="text-2xl font-black text-slate-800 tracking-tighter uppercase px-4 opacity-50">{seller.name}</span>
                ) : (
                  <>
                    <img 
                      src={seller.logo} 
                      alt={seller.name} 
                      className="seller-ticker-img max-h-12 w-auto" 
                      onError={(e) => { 
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }} 
                    />
                    <span className="hidden text-2xl font-black text-slate-800 tracking-tighter uppercase px-4 opacity-50">
                      {seller.name}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

const styles = {
  hero: { position: "relative", height: "85vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginTop: "130px" },
  heroVideo: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 },
  heroOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)", zIndex: 2 },
  heroContent: { position: "relative", zIndex: 3, textAlign: "center", color: "white" },
  title: { fontSize: "5rem", fontWeight: "950", lineHeight: "1.1", marginBottom: "1.5rem" },
  subtitle: { fontSize: "1.5rem", maxWidth: "800px", margin: "0 auto 2.5rem", opacity: 0.9, fontWeight: "500" },
  gradientText: { background: "linear-gradient(to right, #6366f1, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSearchContainer: { margin: "0 auto 2.5rem", maxWidth: "600px", width: "100%", position: "relative" },
  heroSearchForm: { display: "flex", gap: "0.5rem", background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(12px)", padding: "0.5rem", borderRadius: "100px", border: "1px solid rgba(255, 255, 255, 0.2)" },
  heroSearchInput: { flex: 1, background: "transparent", border: "none", padding: "1rem 1.5rem", color: "white", fontSize: "1.1rem", outline: "none", fontWeight: "600" },
  heroSearchBtn: { padding: "0.8rem 2.5rem", borderRadius: "100px", background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "white", fontWeight: "800", fontSize: "1rem", border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)", transition: "transform 0.2s" },
  heroBadges: { display: "flex", justifyContent: "center", gap: "2.5rem", fontSize: "0.95rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px" },
  tickerSection: { padding: "4rem 0 3rem", background: "#ffffff", overflow: "hidden", position: "relative" },
  sectionTitle: { fontSize: "3.5rem", fontWeight: "900", textAlign: "center", marginBottom: "4rem" },
  testimonialSection: { padding: "3rem 0", background: "#000000", overflow: "hidden" },
  reviewText: { color: "#e2e8f0", fontSize: "1.15rem", lineHeight: "1.7", fontStyle: "italic", fontWeight: "500" },
};

export default HomePage;
