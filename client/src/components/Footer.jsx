import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div className={`container footer-grid`} style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                {/* Brand Info */}
                <div style={styles.footerBrand} className="footer-brand">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{
                            width: '40px', height: '40px', flexShrink: 0,
                            background: 'linear-gradient(135deg, #6366f1, #ec4899)', 
                            borderRadius: '12px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                        }}>
                            <span style={{color: 'white', fontWeight: '900', fontSize: '1.2rem'}}>S</span>
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '950', letterSpacing: '-1.5px', color: '#fff' }}>Smart<span style={{ color: '#6366f1' }}>Shop</span></h2>
                    </div>
                    <p style={styles.tagline}>
                        India's premium e-commerce destination for the best products at the best prices. Shop with confidence.
                    </p>
                    <div style={styles.socialLinks} className="footer-socials">
                        <div className="footer-social-icon" style={styles.socialIcon}><FaTwitter size={18} /></div>
                        <div className="footer-social-icon" style={styles.socialIcon}><FaInstagram size={18} /></div>
                        <div className="footer-social-icon" style={styles.socialIcon}><FaLinkedin size={18} /></div>
                        <div className="footer-social-icon" style={styles.socialIcon}><FaFacebook size={18} /></div>
                        <div className="footer-social-icon" style={styles.socialIcon}><FaYoutube size={18} /></div>
                    </div>
                </div>

                {/* Quick Links */}
                <div style={styles.footerColumn}>
                    <h4 style={styles.footerHeading}>Quick Links</h4>
                    <ul style={styles.footerList}>
                        <li style={styles.footerItem}><Link to="/products" style={{ color: 'inherit', textDecoration: 'none' }}>All Products</Link></li>
                        <li style={styles.footerItem}><Link to="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>Cart</Link></li>
                        <li style={styles.footerItem}><Link to="/orders" style={{ color: 'inherit', textDecoration: 'none' }}>My Orders</Link></li>
                        <li style={styles.footerItem}><Link to="/wishlist" style={{ color: 'inherit', textDecoration: 'none' }}>Wishlist</Link></li>
                        <li style={styles.footerItem}><Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>My Profile</Link></li>
                    </ul>
                </div>

                {/* Help */}
                <div style={styles.footerColumn}>
                    <h4 style={styles.footerHeading}>Help</h4>
                    <ul style={styles.footerList}>
                        <li style={styles.footerItem}>Shipping Policy</li>
                        <li style={styles.footerItem}>Return Policy</li>
                        <li style={styles.footerItem}>Privacy Policy</li>
                        <li style={styles.footerItem}>Terms of Service</li>
                        <li style={styles.footerItem}>FAQ</li>
                    </ul>
                </div>

                {/* Contact */}
                <div style={styles.footerColumn}>
                    <h4 style={styles.footerHeading}>Contact Us</h4>
                    <ul style={styles.footerList}>
                        <li style={{...styles.footerItem, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <HiOutlineMail className="text-primary-400" size={18} />
                            <span>support@smartshop.in</span>
                        </li>
                        <li style={{...styles.footerItem, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <HiOutlinePhone className="text-primary-400" size={18} />
                            <span>+91 98765 43210</span>
                        </li>
                        <li style={{...styles.footerItem, display: 'flex', alignItems: 'flex-start', gap: '0.5rem'}}>
                            <HiOutlineLocationMarker className="text-primary-400 mt-1" size={18} />
                            <span>123 Tech Park, Bangalore,<br />Karnataka 560001</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={styles.footerBottom}>
                <div className="container" style={styles.bottomContent}>
                    <p>&copy; {new Date().getFullYear()} SmartShop. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                         <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span>🔒</span> Secure Payments</span>
                         <span style={{ opacity: 0.5 }}>|</span>
                         <span>Powered by Razorpay</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        padding: "6rem 0 0",
        background: "#000000",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        marginTop: "auto"
    },
    footerBrand: {
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
    },
    footerLogo: {
        objectFit: "contain",
    },
    tagline: {
        fontSize: "1.1rem",
        color: "#94a3b8",
        lineHeight: "1.6",
        fontWeight: "500",
    },
    socialLinks: {
        display: "flex",
        gap: "1.25rem",
        marginTop: "0.5rem",
    },
    socialIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#fff",
    },
    footerColumn: {
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
    },
    footerHeading: {
        fontSize: "1.2rem",
        fontWeight: "800",
        color: "#ffffff",
    },
    footerList: {
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: 0,
        margin: 0
    },
    footerItem: {
        color: "#94a3b8",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: "pointer",
        transition: "color 0.2s",
    },
    footerBottom: {
        padding: "2rem 0",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    },
    bottomContent: {
        display: "flex",
        justifyContent: "space-between",
        color: "#94a3b8",
        fontSize: "0.9rem",
        fontWeight: "600",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1rem",
        flexWrap: "wrap",
        gap: "1rem"
    },
};

export default Footer;
