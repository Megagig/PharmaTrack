import { useState } from 'react';
import {
  Title,
  Paper,
  TextInput,
  Button,
  Group,
  Stack,
  Text,
  Textarea,
  Select,
  Accordion,
  Alert,
  Box,
} from '@mantine/core';

export function Support() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call the API

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div>
      <Title order={2} mb="lg">
        Help & Support
      </Title>

      <Paper withBorder p="md" mb="xl">
        <Text fw={700} size="lg" mb="lg">
          Frequently Asked Questions
        </Text>

        <Accordion>
          <Accordion.Item value="report-submission">
            <Accordion.Control>
              How do I submit a monthly report?
            </Accordion.Control>
            <Accordion.Panel>
              <Text>
                To submit a monthly report, navigate to the "Submit Monthly
                Report" page from the sidebar menu. Fill in all the required
                fields with your pharmacy's data for the month. Make sure to
                include patient demographics, medications dispensed, and any
                public health activities conducted. Once you've completed the
                form, click the "Submit Report" button.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="report-deadline">
            <Accordion.Control>
              What is the deadline for monthly reports?
            </Accordion.Control>
            <Accordion.Panel>
              <Text>
                Monthly reports should be submitted by the 5th day of the
                following month. For example, the report for January should be
                submitted by February 5th. Late submissions may affect your
                pharmacy's compliance rating.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="edit-report">
            <Accordion.Control>
              Can I edit a report after submission?
            </Accordion.Control>
            <Accordion.Panel>
              <Text>
                Once a report is submitted, it cannot be directly edited. If you
                need to make corrections, please contact the PharmaTrack support
                team using the support request form below. Provide details about
                the report and the corrections needed.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="password-reset">
            <Accordion.Control>How do I reset my password?</Accordion.Control>
            <Accordion.Panel>
              <Text>
                You can change your password in the Profile section. Navigate to
                "Profile" in the sidebar, scroll down to the "Account Settings"
                section, and use the password change form. You'll need to enter
                your current password for verification.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="technical-issues">
            <Accordion.Control>
              What should I do if I encounter technical issues?
            </Accordion.Control>
            <Accordion.Panel>
              <Text>
                If you encounter any technical issues while using the system,
                please submit a support request using the form below. Provide as
                much detail as possible about the issue, including what you were
                trying to do, any error messages you received, and the browser
                you're using.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Paper>

      <Paper withBorder p="md">
        <Text fw={700} size="lg" mb="lg">
          Submit Support Request
        </Text>

        {submitted ? (
          <Alert color="green" mb="md">
            Your support request has been submitted. We'll get back to you soon.
          </Alert>
        ) : (
          <form onSubmit={handleSubmitRequest}>
            <Stack>
              <Select
                label="Request Type"
                placeholder="Select request type"
                data={[
                  'Technical Issue',
                  'Report Problem',
                  'Account Issue',
                  'General Question',
                  'Other',
                ]}
                required
              />

              <Textarea
                label="Description"
                placeholder="Please provide details about your request"
                minRows={5}
                required
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">Submit Request</Button>
              </Group>
            </Stack>
          </form>
        )}

        <Box mt="xl">
          <Text fw={700} size="md" mb="sm">
            Contact Information
          </Text>
          <Group>
            <Text>Email: support@pharmatrack.example.com</Text>
            <Text>Phone: +234 800 123 4567</Text>
            <Text>(Available Monday-Friday, 9am-5pm)</Text>
          </Group>
        </Box>
      </Paper>
    </div>
  );
}
