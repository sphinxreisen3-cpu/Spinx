'use client';

import { useEffect, useRef, useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import styles from '@/styles/components/admin/ActionMenu.module.css';

interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface ActionMenuProps {
  actions: ActionItem[];
}

export function ActionMenu({ actions }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <button
        className={styles.triggerButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Actions"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FaEllipsisV />
      </button>

      <div className={`${styles.dropdown} ${!isOpen ? styles.dropdownHidden : ''}`}>
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${styles.menuItem} ${action.variant === 'danger' ? styles.menuItemDanger : ''}`}
            onClick={() => {
              action.onClick();
              setIsOpen(false);
            }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
