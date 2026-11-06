import { Center, Group, Text, Title, UnstyledButton } from '@mantine/core';

import PreloadLink from '@components/utils/link';

export function Brand() {
  return (
    <Center mr="1rem" miw="12rem">
      <UnstyledButton component={PreloadLink} href="/" aria-label="Octo Tatics — início">
        <Group gap="xs" wrap="nowrap">
          <span className="brand-wordmark__octo">OCTO</span>
          <Title order={2} className="brand-wordmark__tatics">
            TATICS
          </Title>
        </Group>
      </UnstyledButton>
    </Center>
  );
}

export function BrandFooter() {
  return (
    <Group gap="xs" wrap="nowrap" aria-label="Octo Tatics">
      <Text fw={800} c="cobalt.6" size="sm" className="brand-wordmark__octo">
        OCTO
      </Text>
      <Text fw={800} c="navy.8" size="sm" className="brand-wordmark__tatics">
        TATICS
      </Text>
    </Group>
  );
}
