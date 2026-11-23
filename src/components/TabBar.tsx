import { CalendarDays, ChartLine, Dumbbell, Ellipsis } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import styles from './TabBar.module.css';

const TABS = [
  { to: '/', label: 'Heute', Icon: Dumbbell, end: true },
  { to: '/woche', label: 'Woche', Icon: CalendarDays, end: false },
  { to: '/fortschritt', label: 'Fortschritt', Icon: ChartLine, end: false },
  { to: '/mehr', label: 'Mehr', Icon: Ellipsis, end: false },
];

export function TabBar() {
  return (
    <nav className={styles.bar} aria-label="Hauptnavigation">
      <ul className={styles.list}>
        {TABS.map(({ to, label, Icon, end }) => (
          <li key={to} className={styles.item}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
            >
              <Icon size={22} strokeWidth={1.75} aria-hidden />
              <span className={styles.label}>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
