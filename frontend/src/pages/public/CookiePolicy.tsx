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
  Table,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';

export function CookiePolicy() {
  return (
    <PublicLayout>
      <Container size="lg" py={50}>
        <Paper withBorder p="xl" radius="md" mb={30}>
          <Title order={1} mb={30}>Cookie Policy</Title>
          <Text mb={20}>
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>

          <Text mb={20}>
            This Cookie Policy explains how PharmaTrack ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </Text>

          <Title order={2} mt={30} mb={15}>1. What are cookies?</Title>
          <Text mb={20}>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </Text>
          <Text mb={20}>
            Cookies set by the website owner (in this case, PharmaTrack) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
          </Text>

          <Title order={2} mt={30} mb={15}>2. Why do we use cookies?</Title>
          <Text mb={20}>
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our platform to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our platform. Third parties serve cookies through our platform for advertising, analytics, and other purposes.
          </Text>

          <Title order={2} mt={30} mb={15}>3. Types of cookies we use</Title>
          <Text mb={20}>
            The specific types of first and third-party cookies served through our platform and the purposes they perform are described below:
          </Text>

          <Table mb={30}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Type of Cookie</Table.Th>
                <Table.Th>Purpose</Table.Th>
                <Table.Th>Duration</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Essential Cookies</Table.Td>
                <Table.Td>These cookies are strictly necessary to provide you with services available through our platform and to use some of its features, such as access to secure areas.</Table.Td>
                <Table.Td>Session / Persistent</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Performance & Functionality Cookies</Table.Td>
                <Table.Td>These cookies are used to enhance the performance and functionality of our platform but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.</Table.Td>
                <Table.Td>Session / Persistent</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Analytics & Customization Cookies</Table.Td>
                <Table.Td>These cookies collect information that is used either in aggregate form to help us understand how our platform is being used or how effective our marketing campaigns are, or to help us customize our platform for you.</Table.Td>
                <Table.Td>Session / Persistent</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Advertising Cookies</Table.Td>
                <Table.Td>These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.</Table.Td>
                <Table.Td>Persistent</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          <Title order={2} mt={30} mb={15}>4. How can you control cookies?</Title>
          <Text mb={20}>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie table above.
          </Text>
          <Text mb={20}>
            You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our platform though your access to some functionality and areas may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information.
          </Text>

          <Title order={2} mt={30} mb={15}>5. How often will we update this Cookie Policy?</Title>
          <Text mb={20}>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </Text>
          <Text mb={20}>
            The date at the top of this Cookie Policy indicates when it was last updated.
          </Text>

          <Title order={2} mt={30} mb={15}>6. Where can you get further information?</Title>
          <Text mb={20}>
            If you have any questions about our use of cookies or other technologies, please email us at privacy@pharmatrack.com.
          </Text>

          <Divider my={30} />

          <Group>
            <Button component={Link} to="/privacy" variant="outline">
              Privacy Policy
            </Button>
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
