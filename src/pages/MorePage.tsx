import { BookOpen, Settings } from 'lucide-react';
import { icon } from '../components/icon';
import { List, ListRow } from '../components/ListRow';
import { PageHeader } from '../components/PageHeader';

export function MorePage() {
  return (
    <>
      <PageHeader title="Mehr" />
      <List>
        <ListRow
          to="/mehr/grundlagen"
          leading={<BookOpen {...icon} />}
          title="Grundlagen"
          meta="Progression, Ernährung, Schlaf, Sicherheit"
        />
        <ListRow
          to="/mehr/einstellungen"
          leading={<Settings {...icon} />}
          title="Einstellungen"
          meta="Wochenplan, Bank, Erinnerung, Daten"
        />
      </List>
    </>
  );
}
