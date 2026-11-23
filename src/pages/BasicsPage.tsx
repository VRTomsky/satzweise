import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { BASICS } from '../data/basics';
import { BasicsBlocks } from '../features/basics/BasicsBlocks';

export function BasicsPage() {
  return (
    <>
      <PageHeader back={{ to: '/mehr', label: 'Mehr' }} title="Grundlagen" />
      {BASICS.map((section) => (
        <Section key={section.id} title={section.title}>
          <BasicsBlocks section={section} />
        </Section>
      ))}
    </>
  );
}
