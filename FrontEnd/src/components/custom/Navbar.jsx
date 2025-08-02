// src/components/customs/Navbar.jsx
'use client';
import { logoChat } from '../../assets/Assets';

import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { IconMenu2, IconX } from '@tabler/icons-react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const Navbar = ({ children, className }) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > 100);
  });

  return (
    <motion.div className={cn('fixed inset-x-0 top-3 z-50 w-full', className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { visible })
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? 'blur(10px)' : 'none',
        boxShadow: visible
          ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
          : 'none',
        width: visible ? '40%' : '100%',
        y: visible ? 20 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: '800px',
        height: '60px',
      }}
      className={cn(
        'relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 lg:flex dark:bg-transparent',
        visible && 'bg-white/10 dark:bg-[#1A1A1A]/70',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick, activePage }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-bold text-white transition duration-200 lg:flex lg:space-x-2',
        className
      )}
    >
      {items.map((item, idx) => {
        const isActive = activePage === item.link;
        const isHovered = hovered === idx;
        const shouldShowEffect = isHovered || isActive;
        
        return (
          <a
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onClick={onItemClick}
            className="relative px-4 py-2 text-white dark:text-white transition-all duration-300"
            key={`link-${idx}`}
            href={item.link}
          >
            {shouldShowEffect && (
              <motion.div
                layoutId="hovered"
                className={cn(
                  "absolute inset-0 h-full w-full rounded-full backdrop-blur-sm",
                  isActive 
                    ? "bg-gradient-to-r from-cyan-400/50 to-purple-400/50 " 
                    : "bg-gradient-to-r from-cyan-400/30 to-purple-400/30"
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <span className={cn(
              "relative z-20 transition-all duration-300",
              // isActive 
              //   ? "bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent" 
              //   : "bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-purple-300"
            )}>
              {item.name}
            </span>
          </a>
        );
      })}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? 'blur(10px)' : 'none',
        boxShadow: visible
          ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
          : 'none',
        width: visible ? '90%' : '100%',
        paddingRight: visible ? '12px' : '0px',
        paddingLeft: visible ? '12px' : '0px',
        borderRadius: visible ? '4px' : '2rem',
        y: visible ? 20 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        'relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 m-0 lg:hidden',
        visible && 'bg-white/10 dark:bg-black/90',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex w-full flex-row items-center justify-between ',
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({ children, className, isOpen }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      menuRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            'fixed inset-x-0 top-16 z-40 w-full bg-neutral-950 px-4 py-8',
            'h-[calc(100vh-64px)] overflow-y-auto',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({ isOpen, onClick }) => {
  return isOpen ? (
    <IconX className="text-white dark:text-white" onClick={onClick} size={24} />
  ) : (
    <IconMenu2
      className="text-white dark:text-white"
      onClick={onClick}
      size={24}
    />
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="#"
      className="relative z-20 mr-4 flex items-center space-x-2  py-1 text-sm font-normal text-white"
    >
      <img src={logoChat} alt="logo3" width={70} height={70} className="m-0" />

      <span className="relative right-3 font-bold italic  bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
        SMART VITALS
      </span>
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = 'a',
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const baseStyles =
    'px-4 py-2 rounded-md text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-lg hover:from-cyan-500 hover:to-purple-500 transition-all duration-200',
    secondary:
      'bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-200',
    dark: 'bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]',
    gradient:
      'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]',
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default function CustomNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('/');

  // Get current pathname
  useEffect(() => {
    setActivePage(window.location.pathname);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'Features', link: '/Features' },
    { name: 'About', link: '/About' },
    { name: 'Contact', link: '/Contact' },
    { name: 'Dashboard', link: '/Dashboard'}
  ];

  return (
    <Navbar className="top-0 fixed z-50">
      {/* Desktop Navigation */}
      <NavBody className="max-w-screen ">
        <NavbarLogo />
        <NavItems
          items={navItems}
          activePage={activePage}
          onItemClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex items-center space-x-4">
          <NavbarButton href="/Login" variant="secondary" className="px-4 py-2">
            Sign In
          </NavbarButton>
          <NavbarButton href="Signup" variant="primary" className="px-4 py-2">
            Sign Up
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav className="top-0 z-50">
        <MobileNavHeader className="relative right-2">
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isMobileMenuOpen}>
          {navItems.map((item, idx) => {
            const isActive = activePage === item.link;
            return (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                className={cn(
                  "block w-full px-4 py-3 text-lg text-white rounded-md transition-all duration-300 relative overflow-hidden",
                  isActive && "bg-gradient-to-r from-cyan-400/30 to-purple-400/30 border border-cyan-400/50"
                )}
                onClick={toggleMobileMenu}
              >
                <span className={cn(
                  "transition-all duration-300 relative z-10",
                  isActive 
                    ? "bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent" 
                    : "bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-purple-300"
                )}>
                  {item.name}
                </span>
              </a>
            );
          })}
          <div className="flex flex-col space-y-4 w-full mt-4 border-t border-neutral-700 pt-4">
            <NavbarButton href="Login" variant="secondary" className="w-full ">
              Sign In
            </NavbarButton>
            <NavbarButton href="Signup" variant="primary" className="w-full">
              Sign Up
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
