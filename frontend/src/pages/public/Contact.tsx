import {
  Container,
  Title,
  Text,
  SimpleGrid,
  TextInput,
  Textarea,
  Button,
  Group,
  Paper,
  Box,
  Select,
  useMantineTheme,
} from '@mantine/core';
import { useState } from 'react';
import { PublicLayout } from '../../components/layout/PublicLayout';

export function Contact() {
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      alert('Your message has been sent! We will get back to you soon.');
    }, 1000);
  };

  return (
    <PublicLayout>
      <Container size="lg" py={50}>
        <Title order={1} ta="center" mb={50}>
          Contact Us
        </Title>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
          <Box>
            <Title order={3} mb="md">
              Get in Touch
            </Title>
            <Text mb="xl">
              Have questions about PharmaTrack? Our team is here to help. Fill out the form and we'll get back to you as soon as possible.
            </Text>

            <Box mb="xl">
              <Text fw={700} mb="xs">
                Email
              </Text>
              <Text>info@pharmatrack.com</Text>
            </Box>

            <Box mb="xl">
              <Text fw={700} mb="xs">
                Phone
              </Text>
              <Text>+1 (555) 123-4567</Text>
            </Box>

            <Box mb="xl">
              <Text fw={700} mb="xs">
                Address
              </Text>
              <Text>123 Health Avenue</Text>
              <Text>Medical District</Text>
              <Text>City, State 12345</Text>
            </Box>

            <Box mb="xl">
              <Text fw={700} mb="xs">
                Hours of Operation
              </Text>
              <Text>Monday - Friday: 9:00 AM - 5:00 PM</Text>
              <Text>Saturday - Sunday: Closed</Text>
            </Box>
          </Box>

          <Paper withBorder p="xl" radius="md">
            <form onSubmit={handleSubmit}>
              <Title order={3} mb="xl">
                Send Us a Message
              </Title>

              <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
                <TextInput
                  label="First Name"
                  placeholder="Your first name"
                  required
                />
                <TextInput
                  label="Last Name"
                  placeholder="Your last name"
                  required
                />
              </SimpleGrid>

              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                mb="md"
              />

              <TextInput
                label="Phone"
                placeholder="(555) 123-4567"
                mb="md"
              />

              <Select
                label="Inquiry Type"
                placeholder="Select an option"
                data={[
                  'General Inquiry',
                  'Technical Support',
                  'Sales',
                  'Partnership',
                  'Feedback',
                  'Other',
                ]}
                required
                mb="md"
              />

              <Textarea
                label="Message"
                placeholder="How can we help you?"
                minRows={5}
                required
                mb="xl"
              />

              <Group justify="flex-end">
                <Button type="submit" loading={loading}>
                  Send Message
                </Button>
              </Group>
            </form>
          </Paper>
        </SimpleGrid>

        <Box mt={50}>
          <Title order={3} ta="center" mb="xl">
            Frequently Asked Questions
          </Title>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
            <Paper withBorder p="lg" radius="md">
              <Text fw={700} mb="xs">
                How do I register for PharmaTrack?
              </Text>
              <Text size="sm">
                You can register by clicking the "Register" button in the top navigation and following the steps to create your account.
              </Text>
            </Paper>

            <Paper withBorder p="lg" radius="md">
              <Text fw={700} mb="xs">
                Is my data secure with PharmaTrack?
              </Text>
              <Text size="sm">
                Yes, we use enterprise-grade security measures to protect your data, including encryption and secure access controls.
              </Text>
            </Paper>

            <Paper withBorder p="lg" radius="md">
              <Text fw={700} mb="xs">
                Can I access PharmaTrack on my mobile device?
              </Text>
              <Text size="sm">
                Yes, PharmaTrack is fully responsive and can be accessed from any device, including smartphones and tablets.
              </Text>
            </Paper>

            <Paper withBorder p="lg" radius="md">
              <Text fw={700} mb="xs">
                How often do I need to submit reports?
              </Text>
              <Text size="sm">
                Reports are typically submitted monthly, but the exact frequency may depend on your regulatory requirements.
              </Text>
            </Paper>
          </SimpleGrid>
        </Box>
      </Container>
    </PublicLayout>
  );
}
