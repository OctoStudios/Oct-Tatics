import { Anchor, Button, Container, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { tokenPresent } from '@services/local_storage';
import { performLogin } from '@services/user';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Entrar | Octo Tatics';
    if (tokenPresent()) {
      navigate('/');
    }
  }, [navigate]);

  async function attemptLogin(email: string, password: string) {
    const success = await performLogin(email, password);
    if (success) {
      showNotification({
        color: 'green',
        title: t('login_success_title'),
        icon: <IconCheck />,
        message: '',
      });
      await navigate('/');
    }
  }

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : t('invalid_email_validation')),
      password: (value) => (value.length >= 8 ? null : t('invalid_password_validation')),
    },
  });

  return (
    <main className="login-page">
      <Container size={480} className="login-page__container">
        <div className="login-page__eyebrow">OCTÓVIUN STUDIOS · GESTÃO ESPORTIVA</div>
        <Title ta="center" order={1} c="navy.8" className="login-page__title">
          {t('welcome_title')}{' '}
          <Text inherit component="span" c="cobalt.6">
            Octo Tatics
          </Text>
        </Title>
        <Text c="dimmed" ta="center" mt="sm">
          Gestão de campeonatos, equipes e partidas em um só lugar.
        </Text>
        <Paper withBorder shadow="sm" p="xl" mt="xl" radius="md" className="login-page__paper">
          <form onSubmit={form.onSubmit(async (values) => attemptLogin(values.email, values.password))}>
            <TextInput
              label={t('email_input_label')}
              placeholder={t('email_input_placeholder')}
              required
              my="lg"
              type="email"
              autoComplete="email"
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label={t('password_input_label')}
              placeholder={t('password_input_placeholder')}
              required
              mt="md"
              autoComplete="current-password"
              {...form.getInputProps('password')}
            />
            <Button fullWidth mt="xl" type="submit" color="cobalt">
              {t('sign_in_title')}
            </Button>
          </form>
          <Text c="dimmed" size="sm" ta="center" mt="lg">
            <Anchor<'a'> onClick={() => navigate('/create-account')} size="sm">
              {t('create_account_button')}
            </Anchor>
            {' · '}
            <Anchor<'a'> onClick={() => navigate('/password-reset')} size="sm">
              {t('forgot_password_button')}
            </Anchor>
          </Text>
        </Paper>
        <Text c="dimmed" size="xs" ta="center" mt="xl">
          Uma plataforma da Octóviun Studios
        </Text>
      </Container>
    </main>
  );
}
