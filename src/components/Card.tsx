import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface Props extends HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article' | 'li';
  flush?: boolean;
}

/** Fläche mit feinem Rahmen. Karten werden nie ineinander verschachtelt. */
export function Card({ as: Tag = 'section', flush = false, className, ...rest }: Props) {
  const classes = [styles.card, flush ? styles.flush : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return <Tag className={classes} {...rest} />;
}
