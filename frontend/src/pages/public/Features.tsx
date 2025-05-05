import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  ThemeIcon,
  Box,
  Tabs,
  rem,
  useMantineTheme,
  Paper,
  List,
  Group,
  Button,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';

// Icons as SVG paths
const ReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <path d="M14 2v6h6"></path>
    <path d="M16 13H8"></path>
    <path d="M16 17H8"></path>
    <path d="M10 9H8"></path>
  </svg>
);

const AnalyticsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="M18 17V9"></path>
    <path d="M13 17V5"></path>
    <path d="M8 17v-3"></path>
  </svg>
);

const ComplianceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"></path>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

const SecurityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const MobileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12" y2="18"></line>
  </svg>
);

const SupportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export function Features() {
  const theme = useMantineTheme();

  const features = [
    {
      icon: <ReportIcon />,
      title: 'Streamlined Reporting',
      description: 'Simplify your monthly reporting process with our intuitive interface and automated data collection.',
    },
    {
      icon: <AnalyticsIcon />,
      title: 'Advanced Analytics',
      description: 'Gain valuable insights with our powerful analytics dashboard, helping you make data-driven decisions.',
    },
    {
      icon: <ComplianceIcon />,
      title: 'Compliance Monitoring',
      description: 'Stay compliant with regulatory requirements through our comprehensive monitoring tools.',
    },
    {
      icon: <SecurityIcon />,
      title: 'Data Security',
      description: 'Your data is protected with enterprise-grade security measures and role-based access controls.',
    },
    {
      icon: <MobileIcon />,
      title: 'Mobile Responsive',
      description: 'Access PharmaTrack from any device with our fully responsive design optimized for mobile, tablet, and desktop.',
    },
    {
      icon: <SupportIcon />,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our dedicated support team available around the clock.',
    },
  ];

  return (
    <PublicLayout>
      <Box
        py={50}
        style={{
          background: `linear-gradient(45deg, ${theme.colors.blue[7]} 0%, ${theme.colors.cyan[7]} 100%)`,
          color: theme.white,
        }}
      >
        <Container size="lg">
          <Title order={1} ta="center" mb={50}>
            PharmaTrack Features
          </Title>
          <Text size="xl" ta="center" mb={50} maw={800} mx="auto">
            Discover the powerful features that make PharmaTrack the leading solution for pharmacy data collection and reporting.
          </Text>
        </Container>
      </Box>

      <Container size="lg" py={50}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={30} mb={50}>
          {features.map((feature, index) => (
            <Card key={index} padding="lg" radius="md" withBorder>
              <ThemeIcon size={50} radius="md" color="blue" mb="md">
                {feature.icon}
              </ThemeIcon>
              <Text fw={700} fz="lg" mb="xs">
                {feature.title}
              </Text>
              <Text size="sm" c="dimmed">
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>

        <Title order={2} ta="center" mb={30}>
          Tailored Solutions for Different Users
        </Title>

        <Tabs defaultValue="pharmacy" mb={50}>
          <Tabs.List grow mb="xl">
            <Tabs.Tab value="pharmacy">For Pharmacies</Tabs.Tab>
            <Tabs.Tab value="executive">For Executives</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="pharmacy">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
              <Box>
                <Title order={3} mb="md">
                  Pharmacy Dashboard
                </Title>
                <Text mb="xl">
                  Our pharmacy dashboard provides a comprehensive overview of your pharmacy's performance, 
                  compliance status, and reporting requirements. Easily submit monthly reports, manage 
                  inventory, and track your pharmacy's metrics all in one place.
                </Text>

                <List spacing="md">
                  <List.Item>
                    <Text fw={500}>Simplified Monthly Reporting</Text>
                    <Text size="sm">Submit your monthly reports with ease through our intuitive interface</Text>
                  </List.Item>
                  <List.Item>
                    <Text fw={500}>Inventory Management</Text>
                    <Text size="sm">Track your medication inventory and receive alerts for low stock</Text>
                  </List.Item>
                  <List.Item>
                    <Text fw={500}>Compliance Tracking</Text>
                    <Text size="sm">Monitor your compliance status and receive reminders for upcoming deadlines</Text>
                  </List.Item>
                  <List.Item>
                    <Text fw={500}>Historical Data Access</Text>
                    <Text size="sm">Access and review your previous reports and performance metrics</Text>
                  </List.Item>
                </List>
              </Box>

              <Paper withBorder p="xl" radius="md">
                <Box
                  style={{
                    width: '100%',
                    height: 300,
                    backgroundColor: theme.colors.gray[1],
                    borderRadius: theme.radius.md,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text fw={500} c={theme.colors.gray[6]}>
                    Pharmacy Dashboard Preview
                  </Text>
                </Box>
              </Paper>
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="executive">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
              <Box>
                <Title order={3} mb="md">
                  Executive Dashboard
                </Title>
                <Text mb="xl">
                  The executive dashboard provides a bird's-eye view of all pharmacies under your 
                  jurisdiction. Monitor compliance rates, analyze trends, and make data-driven 
                  decisions to improve public health outcomes.
                </Text>

                <List spacing="md">
                  <List.Item>
                    <Text fw={500}>Comprehensive Analytics</Text>
                    <Text size="sm">Access detailed analytics and visualizations of pharmacy data</Text>
                  </List.Item>
                  <List.Item>
                    <Text fw={500}>Compliance Monitoring</Text>
                    <Text size="sm">Track compliance rates across all pharmacies in real-time</Text>
                  </List.Item>
                  <List.Item>
                    <Text fw={500}>Trend Analysis</Text>
                    <Text size="sm">Identify trends in medication usage, ailments, and public health activities</Text>
                  </List.Item>
                  <List.Item>
                    <Text fw={500}>User Management</Text>
                    <Text size="sm">Manage user accounts and access permissions</Text>
                  </List.Item>
                </List>
              </Box>

              <Paper withBorder p="xl" radius="md">
                <Box
                  style={{
                    width: '100%',
                    height: 300,
                    backgroundColor: theme.colors.gray[1],
                    borderRadius: theme.radius.md,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text fw={500} c={theme.colors.gray[6]}>
                    Executive Dashboard Preview
                  </Text>
                </Box>
              </Paper>
            </SimpleGrid>
          </Tabs.Panel>
        </Tabs>

        <Box ta="center">
          <Title order={3} mb="md">
            Ready to Experience PharmaTrack?
          </Title>
          <Text mb="xl" maw={600} mx="auto">
            Join thousands of pharmacies and health executives who are already benefiting from PharmaTrack's powerful features.
          </Text>
          <Group justify="center">
            <Button component={Link} to="/register" size="lg">
              Register Now
            </Button>
            <Button component={Link} to="/contact" variant="outline" size="lg">
              Contact Us
            </Button>
          </Group>
        </Box>
      </Container>
    </PublicLayout>
  );
}
