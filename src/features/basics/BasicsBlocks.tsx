import type { BasicsSection } from '../../data/basics';
import styles from './BasicsBlocks.module.css';

/** Zeigt einen Abschnitt der Grundlagen (Text, Listen, Zwischenüberschriften). */
export function BasicsBlocks({ section }: { section: BasicsSection }) {
  return (
    <div className={styles.blocks}>
      {section.blocks.map((block, i) => {
        const List = block.ordered ? 'ol' : 'ul';
        return (
          <div key={i} className={styles.block}>
            {block.heading && <h3 className={styles.heading}>{block.heading}</h3>}
            {block.text && <p className={styles.text}>{block.text}</p>}
            {block.items && (
              <List className={block.ordered ? styles.ordered : styles.bullets}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </List>
            )}
          </div>
        );
      })}
    </div>
  );
}
