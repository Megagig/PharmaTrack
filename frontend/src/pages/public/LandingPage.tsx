import { Link } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Box,
  SimpleGrid,
  Card,
  ThemeIcon,
  rem,
  useMantineTheme,
  Image,
  Paper,
  Flex,
  Divider,
} from '@mantine/core';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { AnimatedElement } from '../../components/animations/AnimatedElement';

// Icons as SVG paths
const AnalyticsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18"></path>
    <path d="M18 17V9"></path>
    <path d="M13 17V5"></path>
    <path d="M8 17v-3"></path>
  </svg>
);

const ReportIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <path d="M14 2v6h6"></path>
    <path d="M16 13H8"></path>
    <path d="M16 17H8"></path>
    <path d="M10 9H8"></path>
  </svg>
);

const SecurityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const ComplianceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 11l3 3L22 4"></path>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

export function LandingPage() {
  const theme = useMantineTheme();

  const features = [
    {
      icon: <AnalyticsIcon />,
      title: 'Advanced Analytics',
      description:
        'Gain valuable insights with our powerful analytics dashboard, helping you make data-driven decisions.',
    },
    {
      icon: <ReportIcon />,
      title: 'Streamlined Reporting',
      description:
        'Simplify your monthly reporting process with our intuitive interface and automated data collection.',
    },
    {
      icon: <SecurityIcon />,
      title: 'Data Security',
      description:
        'Your data is protected with enterprise-grade security measures and role-based access controls.',
    },
    {
      icon: <ComplianceIcon />,
      title: 'Compliance Monitoring',
      description:
        'Stay compliant with regulatory requirements through our comprehensive monitoring tools.',
    },
  ];

  const testimonials = [
    {
      quote:
        'PharmaTrack has revolutionized how we manage our pharmacy data. The reporting process is now seamless and efficient.',
      author: 'Dr. Sarah Johnson',
      position: 'Chief Pharmacist, Community Health Center',
    },
    {
      quote:
        'The analytics provided by PharmaTrack have helped us identify trends and make better decisions for public health initiatives.',
      author: 'Michael Chen',
      position: 'Health Department Executive',
    },
    {
      quote:
        'Implementation was smooth and the support team was incredibly helpful. Our staff adapted to the system quickly.',
      author: 'Lisa Rodriguez',
      position: 'Pharmacy Manager, Regional Hospital',
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <Box
        py={80}
        style={{
          background: `linear-gradient(45deg, ${theme.colors.blue[7]} 0%, ${theme.colors.cyan[7]} 100%)`,
          color: theme.white,
        }}
      >
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
            <Box pt={20}>
              <Title order={1} size={rem(48)} fw={900} lh={1.1} mb={30}>
                Streamline Your Pharmacy Data Collection with{' '}
                <Text
                  component="span"
                  inherit
                  variant="gradient"
                  gradient={{ from: 'cyan', to: 'white' }}
                >
                  PharmaTrack
                </Text>
              </Title>
              <Text size="xl" mb={30}>
                A comprehensive solution for pharmacies and health executives to
                collect, analyze, and report critical pharmacy data.
              </Text>
              <Group>
                <Button component={Link} to="/register" size="lg" radius="md">
                  Get Started
                </Button>
                <Button
                  component={Link}
                  to="/features"
                  size="lg"
                  radius="md"
                  variant="outline"
                  color="white"
                >
                  Learn More
                </Button>
              </Group>
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AnimatedElement type="fadeInRight" delay={0.3}>
                <Box
                  style={{
                    width: '100%',
                    height: 350,
                    borderRadius: theme.radius.md,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <img
                    src="/src/assets/dashboard-preview.svg"
                    alt="PharmaTrack Dashboard Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: theme.radius.md,
                    }}
                  />
                </Box>
              </AnimatedElement>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container size="lg" py={80}>
        <Title order={2} ta="center" mb={50}>
          Powerful Features for Pharmacy Management
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={30}>
          {features.map((feature, index) => (
            <AnimatedElement
              key={index}
              type="fadeInUp"
              delay={0.1 * (index + 1)}
            >
              <Card padding="lg" radius="md" withBorder>
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
            </AnimatedElement>
          ))}
        </SimpleGrid>
      </Container>

      {/* How It Works Section */}
      <Box bg={theme.colors.gray[0]} py={80}>
        <Container size="lg">
          <Title order={2} ta="center" mb={50}>
            How PharmaTrack Works
          </Title>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing={30}>
            <AnimatedElement type="fadeInUp" delay={0.1}>
              <Paper
                withBorder
                p="xl"
                radius="md"
                style={{ textAlign: 'center' }}
              >
                <Box
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.blue[6],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <Text c="white" fw={700} fz="xl">
                    1
                  </Text>
                </Box>
                <Text fw={700} fz="lg" mb="xs">
                  Register Your Pharmacy
                </Text>
                <Text size="sm" c="dimmed">
                  Create an account and set up your pharmacy profile with all
                  necessary details.
                </Text>
              </Paper>
            </AnimatedElement>

            <AnimatedElement type="fadeInUp" delay={0.2}>
              <Paper
                withBorder
                p="xl"
                radius="md"
                style={{ textAlign: 'center' }}
              >
                <Box
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.blue[6],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <Text c="white" fw={700} fz="xl">
                    2
                  </Text>
                </Box>
                <Text fw={700} fz="lg" mb="xs">
                  Submit Monthly Reports
                </Text>
                <Text size="sm" c="dimmed">
                  Easily submit your monthly data through our intuitive
                  reporting interface.
                </Text>
              </Paper>
            </AnimatedElement>

            <AnimatedElement type="fadeInUp" delay={0.3}>
              <Paper
                withBorder
                p="xl"
                radius="md"
                style={{ textAlign: 'center' }}
              >
                <Box
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.blue[6],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <Text c="white" fw={700} fz="xl">
                    3
                  </Text>
                </Box>
                <Text fw={700} fz="lg" mb="xs">
                  Analyze & Improve
                </Text>
                <Text size="sm" c="dimmed">
                  Access analytics and insights to improve your pharmacy
                  operations and compliance.
                </Text>
              </Paper>
            </AnimatedElement>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container size="lg" py={80}>
        <Title order={2} ta="center" mb={50}>
          What Our Users Say
        </Title>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing={30}>
          {testimonials.map((testimonial, index) => (
            <AnimatedElement
              key={index}
              type="fadeInUp"
              delay={0.1 * (index + 1)}
            >
              <Paper withBorder p="xl" radius="md">
                <Text size="lg" style={{ fontStyle: 'italic' }} mb="xl">
                  "{testimonial.quote}"
                </Text>
                <Divider mb="md" />
                <Text fw={700}>{testimonial.author}</Text>
                <Text size="sm" c="dimmed">
                  {testimonial.position}
                </Text>
              </Paper>
            </AnimatedElement>
          ))}
        </SimpleGrid>
      </Container>

      {/* CTA Section */}
      <Box
        py={80}
        style={{
          background: `linear-gradient(45deg, ${theme.colors.indigo[7]} 0%, ${theme.colors.blue[7]} 100%)`,
          color: theme.white,
        }}
      >
        <Container size="md" ta="center">
          <AnimatedElement type="fadeInUp" delay={0.1}>
            <Title order={2} mb={30}>
              Ready to Transform Your Pharmacy Data Management?
            </Title>
          </AnimatedElement>
          <AnimatedElement type="fadeInUp" delay={0.2}>
            <Text size="xl" mb={30} maw={600} mx="auto">
              Join thousands of pharmacies nationwide who are streamlining their
              reporting and improving compliance with PharmaTrack.
            </Text>
          </AnimatedElement>
          <AnimatedElement type="fadeInUp" delay={0.3}>
            <Group justify="center">
              <Button component={Link} to="/register" size="lg" radius="md">
                Register Now
              </Button>
              <Button
                component={Link}
                to="/contact"
                size="lg"
                radius="md"
                variant="outline"
                color="white"
              >
                Contact Sales
              </Button>
            </Group>
          </AnimatedElement>
        </Container>
      </Box>
    </PublicLayout>
  );
}
