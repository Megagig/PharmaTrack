import {
  Container,
  Title,
  Text,
  Paper,
  List,
  Box,
  Divider,
  Button,
  Group,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';

export function TermsOfService() {
  return (
    <PublicLayout>
      <Container size="lg" py={50}>
        <Paper withBorder p="xl" radius="md" mb={30}>
          <Title order={1} mb={30}>Terms of Service</Title>
          <Text mb={20}>
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>

          <Text mb={20}>
            Welcome to PharmaTrack. Please read these Terms of Service ("Terms") carefully as they contain important information about your legal rights, remedies, and obligations. By accessing or using the PharmaTrack platform, you agree to comply with and be bound by these Terms.
          </Text>

          <Title order={2} mt={30} mb={15}>1. Acceptance of Terms</Title>
          <Text mb={20}>
            By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the services.
          </Text>

          <Title order={2} mt={30} mb={15}>2. Description of Services</Title>
          <Text mb={20}>
            PharmaTrack provides a platform for pharmacy data collection, reporting, and analytics. Our services include but are not limited to:
          </Text>
          <List mb={20}>
            <List.Item>Monthly reporting tools for pharmacies</List.Item>
            <List.Item>Analytics dashboards for health executives</List.Item>
            <List.Item>Compliance monitoring features</List.Item>
            <List.Item>Data storage and management</List.Item>
          </List>

          <Title order={2} mt={30} mb={15}>3. User Accounts</Title>
          <Text mb={20}>
            To access certain features of our platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </Text>
          <Text mb={20}>
            You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </Text>

          <Title order={2} mt={30} mb={15}>4. User Responsibilities</Title>
          <Text mb={20}>
            You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
          </Text>
          <List mb={20}>
            <List.Item>Use the services in any way that violates any applicable law or regulation</List.Item>
            <List.Item>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</List.Item>
            <List.Item>Interfere with or disrupt the services or servers or networks connected to the services</List.Item>
            <List.Item>Attempt to gain unauthorized access to any portion of the services</List.Item>
          </List>

          <Title order={2} mt={30} mb={15}>5. Data Privacy</Title>
          <Text mb={20}>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our services, you consent to our collection and use of your data as described in our Privacy Policy.
          </Text>

          <Title order={2} mt={30} mb={15}>6. Intellectual Property</Title>
          <Text mb={20}>
            The services and all content and materials included on or within the services, including, but not limited to, text, graphics, logos, images, and software, are the property of PharmaTrack or its licensors and are protected by copyright, trademark, and other intellectual property laws.
          </Text>

          <Title order={2} mt={30} mb={15}>7. Limitation of Liability</Title>
          <Text mb={20}>
            To the maximum extent permitted by law, PharmaTrack shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
          </Text>
          <List mb={20}>
            <List.Item>Your access to or use of or inability to access or use the services</List.Item>
            <List.Item>Any conduct or content of any third party on the services</List.Item>
            <List.Item>Any content obtained from the services</List.Item>
            <List.Item>Unauthorized access, use, or alteration of your transmissions or content</List.Item>
          </List>

          <Title order={2} mt={30} mb={15}>8. Modifications to Terms</Title>
          <Text mb={20}>
            We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by posting the updated Terms on our platform and updating the "Last Updated" date. Your continued use of the services after any such changes constitutes your acceptance of the new Terms.
          </Text>

          <Title order={2} mt={30} mb={15}>9. Termination</Title>
          <Text mb={20}>
            We may terminate or suspend your account and access to the services at any time, without prior notice or liability, for any reason, including if you breach these Terms.
          </Text>

          <Title order={2} mt={30} mb={15}>10. Governing Law</Title>
          <Text mb={20}>
            These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions.
          </Text>

          <Divider my={30} />

          <Text fw={500} mb={20}>
            By using PharmaTrack, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </Text>

          <Group>
            <Button component={Link} to="/privacy" variant="outline">
              Privacy Policy
            </Button>
            <Button component={Link} to="/" color="blue">
              Return to Home
            </Button>
          </Group>
        </Paper>
      </Container>
    </PublicLayout>
  );
}
