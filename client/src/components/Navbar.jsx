import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import api from '../services/api';

const Navbar = ({ initialQuery = "" }) => {
    const [query, setQuery] = useState(initialQuery);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { cart } = useSelector(state => state.cart);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (query.trim().length > 1) {
            const delayDebounceFn = setTimeout(() => {
                api.get(`/products?search=${encodeURIComponent(query.trim())}&limit=5`)
                    .then(res => {
                        setSuggestions(res.data.products);
                        setShowSuggestions(true);
                    })
                    .catch(err => console.error(err));
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [query]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const handleSearch = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query.trim())}`);
            setShowSuggestions(false);
        }
    };

    return (
        <div style={{
            ...styles.navWrapper,
            top: isScrolled ? "15px" : "0",
        }}>
            <nav
                style={{
                    ...styles.navbar,
                    width: isScrolled ? "98%" : "100%",
                    maxWidth: isScrolled ? "1750px" : "100%",
                    borderRadius: isScrolled ? "100px" : "0",
                    height: isScrolled ? "100px" : "130px",
                    transform: isHovered && isScrolled ? "scale(1.005)" : "scale(1)",
                    boxShadow: isScrolled ? "0 25px 50px -12px rgba(0,0,0,0.15)" : "none",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="navbar-padding"
            >
                <div style={styles.navContainer}>
                    {/* LEFT SECTION: Logo */}
                    <div style={styles.leftSection}>
                        <Link to="/" style={styles.logoLink}>
                            <div style={{
                                width: '40px', height: '40px', 
                                background: 'linear-gradient(135deg, #6366f1, #ec4899)', 
                                borderRadius: '12px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                            }}>
                                <span style={{color: 'white', fontWeight: '900', fontSize: '1.2rem'}}>S</span>
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '950', letterSpacing: '-1.5px', color: '#000', lineHeight: 1 }}>Smart<span style={{color: '#6366f1'}}>Shop</span></h2>
                        </Link>
                    </div>

                    {/* MOBILE TOGGLE (Visible only on mobile) */}
                    {isMobile && (
                        <button onClick={() => setIsMobileMenuOpen(true)} style={styles.mobileMenuBtn}>
                            <HiOutlineMenu size={32} />
                        </button>
                    )}

                    {/* DESKTOP CENTER & RIGHT SECTIONS (Hidden on mobile) */}
                    {!isMobile && (
                        <>
                            {/* CENTER SECTION: Search Bar */}
                            <div style={styles.centerSection}>
                                <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                                    <form onSubmit={handleSearch} style={styles.searchForm}>
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onFocus={() => { if (query.trim().length > 1) setShowSuggestions(true); }}
                                            onBlur={() => { setTimeout(() => setShowSuggestions(false), 200); }}
                                            style={styles.searchInput}
                                        />
                                        <button type="submit" style={styles.searchBtn} id="navbar-search-btn">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        </button>
                                    </form>

                                    {/* Suggestions Dropdown */}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div style={{
                                            position: 'absolute', top: '110%', left: 0, right: 0,
                                            background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                            border: '1px solid #f1f5f9', overflow: 'hidden', zIndex: 100
                                        }}>
                                            {suggestions.map(p => (
                                                <Link 
                                                    to={`/products/${p._id}`} 
                                                    key={p._id}
                                                    onClick={() => { setShowSuggestions(false); setQuery(''); }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                                        textDecoration: 'none', borderBottom: '1px solid #f1f5f9', color: '#0f172a'
                                                    }}
                                                    className="hover:bg-slate-50 transition-colors"
                                                >
                                                    <img src={p.images[0] || 'https://via.placeholder.com/40'} alt={p.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                                    <div>
                                                        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{p.title}</div>
                                                        <div style={{ color: '#6366f1', fontWeight: '800', fontSize: '0.85rem' }}>₹{p.price}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                            <div 
                                                onClick={handleSearch}
                                                style={{
                                                    padding: '0.75rem', textAlign: 'center', background: '#f8fafc',
                                                    color: '#6366f1', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer'
                                                }}
                                                className="hover:bg-indigo-50 transition-colors"
                                            >
                                                View all results for "{query}"
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT SECTION: Navigation & Login */}
                            <div style={styles.rightSection}>
                                <div style={styles.navLinksMain}>
                                    <Link to="/products" style={styles.navTextLink}>Products</Link>
                                    <Link to="/cart" style={styles.navTextLink}>
                                        Cart {cart?.items?.length > 0 && <span className="bg-primary-600 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-1">{cart.items.length}</span>}
                                    </Link>
                                    <Link to="/wishlist" style={styles.navTextLink}>Wishlist</Link>
                                </div>

                                <div style={styles.userSection}>
                                    {isAuthenticated ? (
                                        <div style={styles.profileBox}>
                                            {/* Store Owner / Admin Shortcut */}
                                            {user?.role === 'storeOwner' && (
                                                <Link to="/store" style={{ ...styles.navTextLink, color: '#6366f1', fontSize: '0.9rem', marginRight: '0.5rem' }}>
                                                    Dashboard
                                                </Link>
                                            )}
                                            {user?.role === 'admin' && (
                                                <a href="http://localhost:5174" target="_blank" rel="noreferrer" style={{ ...styles.navTextLink, color: '#6366f1', fontSize: '0.9rem', marginRight: '0.5rem' }}>
                                                    Dashboard
                                                </a>
                                            )}

                                            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                                                <div style={styles.userAvatar}>
                                                    {user?.name ? user.name[0].toUpperCase() : "U"}
                                                </div>
                                                <span style={{ color: '#000', fontWeight: '800', fontSize: '0.9rem' }}>
                                                    {user?.name?.split(' ')[0] || "My Account"}
                                                </span>
                                            </Link>
                                            <span style={{color: '#cbd5e1'}}>|</span>
                                            <Link to="/orders" style={{ ...styles.navTextLink, fontSize: '0.9rem' }}>Orders</Link>
                                            <span style={{color: '#cbd5e1'}}>|</span>
                                            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                                        </div>
                                    ) : (
                                        <Link to="/login" style={{textDecoration: 'none', marginLeft: '1rem'}}>
                                            <div style={styles.loginBtn}>
                                                <span style={{ fontSize: '1.2rem' }}>👤</span>
                                                <span style={styles.loginText}>Login</span>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </nav>

            {/* MOBILE MENU OVERLAY */}
            {isMobile && isMobileMenuOpen && (
                <div style={styles.mobileMenuOverlay}>
                    <div style={styles.mobileHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '40px', height: '40px', 
                                background: 'linear-gradient(135deg, #6366f1, #ec4899)', 
                                borderRadius: '12px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                            }}>
                                <span style={{color: 'white', fontWeight: '900', fontSize: '1.2rem'}}>S</span>
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '950', letterSpacing: '-1px' }}>Smart<span style={{color: '#6366f1'}}>Shop</span></h2>
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileMenuBtn}>
                            <HiOutlineX size={32} />
                        </button>
                    </div>

                    {/* Mobile Links */}
                    <div style={styles.mobileNavLinks}>
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileNavLink}>Home</Link>
                        <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileNavLink}>Products</Link>
                        <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileNavLink}>Cart</Link>
                        <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileNavLink}>Wishlist</Link>
                        {isAuthenticated && <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileNavLink}>My Orders</Link>}
                    </div>

                    {/* Mobile User Section */}
                    <div style={{ marginTop: 'auto', paddingBottom: '2rem' }}>
                        {isAuthenticated ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', background: '#f1f5f9', padding: '1rem 2rem', borderRadius: '100px' }}>
                                    <div style={styles.userAvatar}>
                                        {user?.name ? user.name[0].toUpperCase() : "U"}
                                    </div>
                                    <span style={{ color: '#000', fontWeight: '800', fontSize: '1.1rem' }}>
                                        {user?.name || "My Account"}
                                    </span>
                                </Link>
                                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} style={{ ...styles.logoutBtn, fontSize: '1.1rem', padding: '1rem' }}>Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                                <button style={{ ...styles.loginBtn, width: '100%', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '1.4rem' }}>👤</span>
                                    <span style={styles.loginText}>Login / Sign Up</span>
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    navWrapper: {
        position: "fixed", left: 0, right: 0, width: "100%", display: "flex", justifyContent: "center", zIndex: 1000, pointerEvents: "none", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    navbar: {
        backgroundColor: "#ffffff", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", pointerEvents: "auto", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", borderBottom: "1px solid #f0f0f0",
        padding: "0 2rem",
    },
    navContainer: {
        display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "1850px", margin: "0 auto", position: "relative", gap: "2rem",
    },
    leftSection: { display: "flex", alignItems: "center", flexShrink: 0, zIndex: 2 },
    centerSection: {
        flex: 1, display: "flex", justifyContent: "center", zIndex: 1, maxWidth: "700px", minWidth: "300px"
    },
    rightSection: { display: "flex", alignItems: "center", gap: "1.5rem", flexShrink: 0, zIndex: 2 },
    logoLink: { display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" },
    logoImg: { objectFit: "contain" },
    navLinksMain: { display: "flex", gap: "1.5rem", alignItems: "center" },
    navTextLink: { fontSize: "1.05rem", fontWeight: "900", color: "#000", cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none" },
    searchForm: { position: "relative", width: "100%" },
    searchInput: {
        width: "100%", padding: "1rem 2.5rem", paddingRight: "3.5rem", borderRadius: "100px", border: "3px solid #000", fontSize: "1.1rem", backgroundColor: "#fff", outline: "none", color: "#000", fontWeight: "800",
    },
    searchBtn: {
        position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "linear-gradient(135deg, #000, #333)", width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
    },
    userSection: { display: "flex", alignItems: "center" },
    loginBtn: {
        display: "flex", alignItems: "center", gap: "1.5rem", padding: "0.8rem 1.8rem", backgroundColor: "#000", color: "#fff", borderRadius: "100px", cursor: "pointer", whiteSpace: "nowrap", fontSize: "1.1rem", fontWeight: "900",
    },
    loginText: { fontSize: "1rem", fontWeight: "900" },
    profileBox: {
        display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#f8fafc", padding: "0.5rem 1rem", borderRadius: "100px", border: "2px solid #e2e8f0",
    },
    userAvatar: {
        width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "0.8rem",
    },
    logoutBtn: { background: "none", border: "none", color: "#ef4444", fontWeight: "800", cursor: "pointer", fontSize: "0.9rem" },
    mobileMenuBtn: { background: "none", border: "none", cursor: "pointer", color: "#000", zIndex: 2001 },
    mobileMenuOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", zIndex: 2000, padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", overflowY: "auto", transition: "opacity 0.3s ease" },
    mobileHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
    mobileNavLinks: { display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", width: "100%" },
    mobileNavLink: { fontSize: "1.5rem", fontWeight: "900", color: "#0f172a", textDecoration: "none" }
};

export default Navbar;
