import { Grid, Paper, Select, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import TournamentsCardTable from '@components/card_tables/tournaments';
import TournamentModal from '@components/modals/tournament_modal';
import { TournamentFilter } from '@components/utils/tournament';
import { capitalize } from '@components/utils/util';
import { checkForAuthError, getTournaments } from '@services/adapter';
import Layout from './_layout';
import classes from './index.module.css';

export default function HomePage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<TournamentFilter>('OPEN');

  const swrTournamentsResponse = getTournaments(filter);
  checkForAuthError(swrTournamentsResponse);

  return (
    <Layout>
      <Paper className={classes.welcomePanel} radius="md" p="xl" mb="xl">
        <Text className={classes.eyebrow}>OCTÓVIUN STUDIOS · GESTÃO ESPORTIVA</Text>
        <Title order={1} className={classes.pageTitle}>
          {capitalize(t('tournaments_title'))}
        </Title>
        <Text className={classes.welcomeText}>
          Organize campeonatos, acompanhe partidas e mantenha equipes e atletas em um só lugar.
        </Text>
        <div className={classes.crestPlaceholder} aria-label="Espaço reservado para a identidade do clube">
          <Text size="xs" fw={700} ta="center">
            ESPAÇO RESERVADO
          </Text>
          <Text size="xs" ta="center">
            Identidade do clube
          </Text>
        </div>
      </Paper>

      <Grid align="end" gutter="md" mb="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Title order={2} size="h3" c="navy.8">
            Campeonatos
          </Title>
          <Text size="sm" c="dimmed" mt={4}>
            Consulte e gerencie os torneios disponíveis na sua conta.
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <Select
            label="Status do campeonato"
            data={[
              { label: 'Todos', value: 'ALL' },
              { label: 'Arquivados', value: 'ARCHIVED' },
              { label: 'Em andamento', value: 'OPEN' },
            ]}
            allowDeselect={false}
            value={filter}
            onChange={(value) => {
              if (value != null) {
                setFilter(value as TournamentFilter);
              }
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }} className={classes.actionColumn}>
          <TournamentModal swrTournamentsResponse={swrTournamentsResponse} />
        </Grid.Col>
      </Grid>
      <TournamentsCardTable swrTournamentsResponse={swrTournamentsResponse} />
    </Layout>
  );
}
