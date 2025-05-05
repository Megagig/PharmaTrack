import { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  TextInput,
  NumberInput,
  Button,
  Group,
  Divider,
  Textarea,
  Switch,
  MultiSelect,
  Select,
  Grid,
  Alert,
  LoadingOverlay,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useAuthStore } from '../../store/authStore';
import {
  reportService,
  ReportCreateRequest,
} from '../../services/reportService';
import { useNavigate } from 'react-router-dom';

export function SubmitReport() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState<ReportCreateRequest>({
    reportDate: new Date(),
    patientsServed: 0,
    maleCount: 0,
    femaleCount: 0,
    childrenCount: 0,
    adultCount: 0,
    elderlyCount: 0,
    topMedications: [],
    commonAilments: [],
    adverseDrugReactions: 0,
    adverseReactionDetails: '',
    referralsMade: 0,
    immunizationsGiven: 0,
    healthEducationSessions: 0,
    bpChecks: 0,
    expiredDrugs: false,
    stockouts: false,
    supplyDelays: false,
    notes: '',
  });

  // Dropdown data
  const commonMedications = [
    'Paracetamol',
    'Amoxicillin',
    'Ibuprofen',
    'Metformin',
    'Lisinopril',
    'Omeprazole',
    'Atorvastatin',
    'Salbutamol',
    'Hydrochlorothiazide',
    'Metronidazole',
    'Ciprofloxacin',
  ];

  const commonAilments = [
    'Malaria',
    'Upper Respiratory Infection',
    'Hypertension',
    'Diabetes',
    'Gastritis',
    'Urinary Tract Infection',
    'Pneumonia',
    'Arthritis',
    'Asthma',
    'Skin Infection',
  ];

  // Check if user is authenticated and has a pharmacy ID
  useEffect(() => {
    if (!user || !user.pharmacyId) {
      setError('You must be logged in as a pharmacy to submit reports');
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (field: keyof ReportCreateRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.pharmacyId) {
      setError('You must be logged in as a pharmacy to submit reports');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await reportService.createReport(formData);
      setSubmitted(true);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      reportDate: new Date(),
      patientsServed: 0,
      maleCount: 0,
      femaleCount: 0,
      childrenCount: 0,
      adultCount: 0,
      elderlyCount: 0,
      topMedications: [],
      commonAilments: [],
      adverseDrugReactions: 0,
      adverseReactionDetails: '',
      referralsMade: 0,
      immunizationsGiven: 0,
      healthEducationSessions: 0,
      bpChecks: 0,
      expiredDrugs: false,
      stockouts: false,
      supplyDelays: false,
      notes: '',
    });
  };

  if (submitted) {
    return (
      <div>
        <Title order={2} mb="lg">
          Submit Monthly Report
        </Title>
        <Alert color="green" title="Success!" mb="xl">
          Your monthly report has been submitted successfully.
        </Alert>
        <Group>
          <Button onClick={() => setSubmitted(false)}>
            Submit Another Report
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/pharmacy/my-reports')}
          >
            View My Reports
          </Button>
        </Group>
      </div>
    );
  }

  return (
    <div>
      <Title order={2} mb="lg">
        Submit Monthly Report
      </Title>

      {error && (
        <Alert color="red" mb="xl" withCloseButton onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper withBorder p="md" pos="relative">
        <LoadingOverlay visible={loading} />

        <form onSubmit={handleSubmit}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput
                label="Report Date"
                placeholder="Select date"
                required
                mb="md"
                value={formData.reportDate}
                onChange={(value) => handleInputChange('reportDate', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Total Patients Served"
                placeholder="Enter number"
                required
                min={0}
                mb="md"
                value={formData.patientsServed}
                onChange={(value) => handleInputChange('patientsServed', value)}
              />
            </Grid.Col>
          </Grid>

          <Divider
            my="md"
            label="Patient Demographics"
            labelPosition="center"
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Male Patients"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.maleCount}
                onChange={(value) => handleInputChange('maleCount', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Female Patients"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.femaleCount}
                onChange={(value) => handleInputChange('femaleCount', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Children (0-12 years)"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.childrenCount}
                onChange={(value) => handleInputChange('childrenCount', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Adults (13-59 years)"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.adultCount}
                onChange={(value) => handleInputChange('adultCount', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Elderly (60+ years)"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.elderlyCount}
                onChange={(value) => handleInputChange('elderlyCount', value)}
              />
            </Grid.Col>
          </Grid>

          <Divider
            my="md"
            label="Medications & Ailments"
            labelPosition="center"
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <MultiSelect
                label="Top Medications Dispensed"
                placeholder="Select medications"
                data={commonMedications}
                searchable
                creatable
                getCreateLabel={(query) => `+ Add ${query}`}
                mb="md"
                value={formData.topMedications}
                onChange={(value) => handleInputChange('topMedications', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <MultiSelect
                label="Common Ailments Treated"
                placeholder="Select ailments"
                data={commonAilments}
                searchable
                creatable
                getCreateLabel={(query) => `+ Add ${query}`}
                mb="md"
                value={formData.commonAilments}
                onChange={(value) => handleInputChange('commonAilments', value)}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Adverse Drug Reactions"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.adverseDrugReactions}
                onChange={(value) =>
                  handleInputChange('adverseDrugReactions', value)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Textarea
                label="Adverse Reaction Details"
                placeholder="Provide details of any adverse reactions"
                mb="md"
                value={formData.adverseReactionDetails}
                onChange={(e) =>
                  handleInputChange('adverseReactionDetails', e.target.value)
                }
              />
            </Grid.Col>
          </Grid>

          <Divider
            my="md"
            label="Public Health Activities"
            labelPosition="center"
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Referrals Made"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.referralsMade}
                onChange={(value) => handleInputChange('referralsMade', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Immunizations Given"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.immunizationsGiven}
                onChange={(value) =>
                  handleInputChange('immunizationsGiven', value)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Health Education Sessions"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.healthEducationSessions}
                onChange={(value) =>
                  handleInputChange('healthEducationSessions', value)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="BP Checks"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.bpChecks}
                onChange={(value) => handleInputChange('bpChecks', value)}
              />
            </Grid.Col>
          </Grid>

          <Divider my="md" label="Supply Chain Issues" labelPosition="center" />

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Expired Drugs Identified"
                mb="md"
                checked={formData.expiredDrugs}
                onChange={(e) =>
                  handleInputChange('expiredDrugs', e.currentTarget.checked)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Stockouts Experienced"
                mb="md"
                checked={formData.stockouts}
                onChange={(e) =>
                  handleInputChange('stockouts', e.currentTarget.checked)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Supply Delays"
                mb="md"
                checked={formData.supplyDelays}
                onChange={(e) =>
                  handleInputChange('supplyDelays', e.currentTarget.checked)
                }
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label="Additional Notes"
            placeholder="Any other information you'd like to share"
            mb="xl"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />

          <Group justify="flex-end">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit">Submit Report</Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}
