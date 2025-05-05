import {
  Container,
  Title,
  Text,
  Box,
  SimpleGrid,
  Paper,
  useMantineTheme,
  Timeline,
  List,
  ThemeIcon,
  rem,
} from '@mantine/core';
import { PublicLayout } from '../../components/layout/PublicLayout';

export function About() {
  const theme = useMantineTheme();

  return (
    <PublicLayout>
      <Container size="lg" py={50}>
        <Title order={1} mb={50} ta="center">
          About PharmaTrack
        </Title>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} mb={50}>
          <Box>
            <Title order={3} mb="md">
              Our Mission
            </Title>
            <Text mb="xl">
              At PharmaTrack, our mission is to revolutionize pharmacy data collection and reporting, 
              making it easier for pharmacies to comply with regulations while providing valuable 
              insights to health executives for better decision-making.
            </Text>

            <Title order={3} mb="md">
              Our Vision
            </Title>
            <Text>
              We envision a healthcare ecosystem where data flows seamlessly between pharmacies and 
              regulatory bodies, reducing administrative burden and improving public health outcomes 
              through data-driven decisions.
            </Text>
          </Box>

          <Box
            style={{
              backgroundColor: theme.colors.blue[0],
              borderRadius: theme.radius.md,
              padding: rem(30),
            }}
          >
            <Title order={3} mb="md" c={theme.colors.blue[7]}>
              Why Choose PharmaTrack?
            </Title>
            <List spacing="md">
              <List.Item>
                <Text fw={500}>Streamlined Reporting</Text>
                <Text size="sm">Reduce administrative burden with our intuitive reporting system</Text>
              </List.Item>
              <List.Item>
                <Text fw={500}>Real-time Analytics</Text>
                <Text size="sm">Access valuable insights through comprehensive dashboards</Text>
              </List.Item>
              <List.Item>
                <Text fw={500}>Compliance Assurance</Text>
                <Text size="sm">Stay compliant with changing regulations and requirements</Text>
              </List.Item>
              <List.Item>
                <Text fw={500}>Secure Data Management</Text>
                <Text size="sm">Your data is protected with enterprise-grade security</Text>
              </List.Item>
              <List.Item>
                <Text fw={500}>Dedicated Support</Text>
                <Text size="sm">Our team is always available to assist you</Text>
              </List.Item>
            </List>
          </Box>
        </SimpleGrid>

        <Title order={2} mb={30} ta="center">
          Our Journey
        </Title>

        <Timeline active={3} bulletSize={24} lineWidth={2} mb={50}>
          <Timeline.Item title="2020: Foundation">
            <Text size="sm">
              PharmaTrack was founded with the vision of simplifying pharmacy data collection and reporting.
            </Text>
          </Timeline.Item>

          <Timeline.Item title="2021: Beta Launch">
            <Text size="sm">
              We launched our beta version with a small group of pharmacies to refine our platform.
            </Text>
          </Timeline.Item>

          <Timeline.Item title="2022: National Expansion">
            <Text size="sm">
              PharmaTrack expanded nationwide, serving hundreds of pharmacies across the country.
            </Text>
          </Timeline.Item>

          <Timeline.Item title="2023: Advanced Analytics">
            <Text size="sm">
              We introduced advanced analytics features to provide deeper insights for executives.
            </Text>
          </Timeline.Item>

          <Timeline.Item title="2024: Present Day">
            <Text size="sm">
              Today, PharmaTrack serves thousands of pharmacies and health executives nationwide.
            </Text>
          </Timeline.Item>
        </Timeline>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing={30}>
          <Paper withBorder p="xl" radius="md" ta="center">
            <Title order={1} mb="xs" c={theme.colors.blue[7]}>
              5000+
            </Title>
            <Text>Pharmacies Served</Text>
          </Paper>

          <Paper withBorder p="xl" radius="md" ta="center">
            <Title order={1} mb="xs" c={theme.colors.blue[7]}>
              98%
            </Title>
            <Text>Compliance Rate</Text>
          </Paper>

          <Paper withBorder p="xl" radius="md" ta="center">
            <Title order={1} mb="xs" c={theme.colors.blue[7]}>
              24/7
            </Title>
            <Text>Customer Support</Text>
          </Paper>
        </SimpleGrid>
      </Container>
    </PublicLayout>
  );
}
