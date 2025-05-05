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

export function PrivacyPolicy() {
  return (
    <PublicLayout>
      <Container size="lg" py={50}>
        <Paper withBorder p="xl" radius="md" mb={30}>
          <Title order={1} mb={30}>Privacy Policy</Title>
          <Text mb={20}>
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>

          <Text mb={20}>
            At PharmaTrack, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
          </Text>

          <Title order={2} mt={30} mb={15}>1. Information We Collect</Title>
          <Text mb={10}>We collect information that you provide directly to us, including:</Text>
          <List mb={20}>
            <List.Item>Personal information (name, email address, phone number)</List.Item>
            <List.Item>Pharmacy details (name, address, license number)</List.Item>
            <List.Item>Account credentials</List.Item>
            <List.Item>Report data submitted through our platform</List.Item>
            <List.Item>Communications with us</List.Item>
          </List>
          
          <Text mb={10}>We also automatically collect certain information when you use our platform, including:</Text>
          <List mb={20}>
            <List.Item>Log information (IP address, browser type, pages visited)</List.Item>
            <List.Item>Device information</List.Item>
            <List.Item>Usage information</List.Item>
            <List.Item>Cookies and similar technologies</List.Item>
          </List>

          <Title order={2} mt={30} mb={15}>2. How We Use Your Information</Title>
          <Text mb={10}>We use the information we collect to:</Text>
          <List mb={20}>
            <List.Item>Provide, maintain, and improve our services</List.Item>
            <List.Item>Process and complete transactions</List.Item>
            <List.Item>Send you technical notices, updates, security alerts, and support messages</List.Item>
            <List.Item>Respond to your comments, questions, and requests</List.Item>
            <List.Item>Monitor and analyze trends, usage, and activities in connection with our services</List.Item>
            <List.Item>Detect, investigate, and prevent fraudulent transactions and other illegal activities</List.Item>
            <List.Item>Personalize and improve the services</List.Item>
          </List>

          <Title order={2} mt={30} mb={15}>3. Sharing of Information</Title>
          <Text mb={10}>We may share the information we collect in the following circumstances:</Text>
          <List mb={20}>
            <List.Item>With service providers who perform services on our behalf</List.Item>
            <List.Item>With regulatory authorities, as required by law</List.Item>
            <List.Item>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business</List.Item>
            <List.Item>Between and among PharmaTrack and our current and future parents, affiliates, subsidiaries, and other companies under common control and ownership</List.Item>
            <List.Item>With your consent or at your direction</List.Item>
          </List>

          <Title order={2} mt={30} mb={15}>4. Data Security</Title>
          <Text mb={20}>
            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or email transmission is ever fully secure or error-free.
          </Text>

          <Title order={2} mt={30} mb={15}>5. Your Rights and Choices</Title>
          <Text mb={10}>You have several rights regarding your personal information:</Text>
          <List mb={20}>
            <List.Item>Access: You can request access to your personal information</List.Item>
            <List.Item>Correction: You can request that we correct inaccurate or incomplete information</List.Item>
            <List.Item>Deletion: You can request that we delete your personal information</List.Item>
            <List.Item>Restriction: You can request that we restrict the processing of your information</List.Item>
            <List.Item>Objection: You can object to our processing of your personal information</List.Item>
            <List.Item>Data Portability: You can request a copy of your personal information in a structured, commonly used, and machine-readable format</List.Item>
          </List>

          <Title order={2} mt={30} mb={15}>6. Cookies Policy</Title>
          <Text mb={20}>
            We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users of our platform. This helps us provide you with a good experience when you browse our platform and also allows us to improve our services. For detailed information about the cookies we use and the purposes for which we use them, please see our Cookie Policy.
          </Text>

          <Title order={2} mt={30} mb={15}>7. Children's Privacy</Title>
          <Text mb={20}>
            Our services are not directed to children under 18, and we do not knowingly collect personal information from children under 18. If we learn that we have collected personal information of a child under 18, we will take steps to delete such information as soon as possible.
          </Text>

          <Title order={2} mt={30} mb={15}>8. Changes to this Privacy Policy</Title>
          <Text mb={20}>
            We may update this privacy policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our platform prior to the change becoming effective. We encourage you to periodically review this page for the latest information on our privacy practices.
          </Text>

          <Title order={2} mt={30} mb={15}>9. Contact Us</Title>
          <Text mb={20}>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </Text>
          <Text mb={20}>
            Email: privacy@pharmatrack.com<br />
            Address: 123 Health Street, Lagos, Nigeria
          </Text>

          <Divider my={30} />

          <Group>
            <Button component={Link} to="/terms" variant="outline">
              Terms of Service
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
