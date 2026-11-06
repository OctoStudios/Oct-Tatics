import { Anchor, Container, Group, Text } from '@mantine/core';

import { BrandFooter } from '@components/navbar/_brand';
import classes from './footer.module.css';

const links = [
  { link: 'https://docs.bracketapp.nl', label: 'Documentação do projeto original' },
  { link: 'https://github.com/evroon/bracket', label: 'Código-fonte original' },
];

export function DashboardFooter() {
  const items = links.map((link) => (
    <Anchor<'a'>
      c="dimmed"
      key={link.label}
      href={link.link}
      size="sm"
      target="_blank"
      rel="noreferrer"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <div>
          <BrandFooter />
          <Text size="xs" c="dimmed" mt="xs">
            Desenvolvido pela Octóviun Studios · Baseado no projeto Bracket (AGPL-3.0)
          </Text>
        </div>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
